"""
StudyQuizAI — Backend (FastAPI)
================================
Rebranded from QuizAPP with:
  • Razorpay one-time + subscription payments
  • Usage limits (free: 3 quizzes/day, pro: unlimited)
  • All original quiz generation logic preserved
"""

import os
import json
import hmac
import hashlib
import time
from datetime import datetime, timedelta
from typing import Optional
from collections import defaultdict

from dotenv import load_dotenv
load_dotenv()  # Load .env for local development (Docker uses env_file)

import razorpay
from fastapi import FastAPI, UploadFile, File, Query, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from pdf_parser import extract_text_from_pdf, chunk_text
from quiz_generator import generate_quiz
from database import init_db, get_db, User, Quiz, QuizResult, Payment
from auth import create_access_token, get_current_user

# ─────────────────────────────────────────────
# App Init
# ─────────────────────────────────────────────
app = FastAPI(title="StudyQuizAI API", version="2.0.0")

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    """Initialize database on app startup"""
    init_db()
    print("🚀 StudyQuizAI API Started!")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        # Add your production domain:
        # "https://studyquizai.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# Razorpay Client
# ─────────────────────────────────────────────
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_xxxxxxxxxxxx")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "your_secret_key")
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# ─────────────────────────────────────────────
# AUTH ROUTES
# ─────────────────────────────────────────────
@app.post("/auth/register")
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if email exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    new_user = User(
        email=request.email,
        full_name=request.full_name or "",
        plan="free",
        subscription_active=True
    )
    new_user.set_password(request.password)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    access_token = create_access_token(new_user.id)
    
    return {
        "status": "success",
        "access_token": access_token,
        "user_id": new_user.id,
        "email": new_user.email,
        "full_name": new_user.full_name,
    }


@app.post("/auth/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Login user"""
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user or not user.check_password(request.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create access token
    access_token = create_access_token(user.id)
    
    return {
        "status": "success",
        "access_token": access_token,
        "user_id": user.id,
        "email": user.email,
        "full_name": user.full_name,
    }


@app.get("/auth/me")
async def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user info"""
    # Refresh to get latest data
    db.refresh(current_user)
    
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "plan": current_user.plan,
        "subscription_active": current_user.subscription_active,
        "created_at": current_user.created_at,
    }

# ─────────────────────────────────────────────
# In-Memory Store (replace with DB in production)
# ─────────────────────────────────────────────
# Tracks free usage per IP: { "ip": { "date": "2026-02-24", "count": 2 } }
free_usage_tracker: dict = defaultdict(lambda: {"date": "", "count": 0})

# Tracks pro users: { "user_id_or_ip": True }
pro_users: set = set()

FREE_DAILY_LIMIT = 3


# ─────────────────────────────────────────────
# Pydantic Models
# ─────────────────────────────────────────────
class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    access_token: str
    user_id: int
    email: str
    full_name: Optional[str]


class OrderRequest(BaseModel):
    amount: int  # in paise (49900 = ₹499)
    currency: str = "INR"
    plan_type: str = "yearly"  # monthly | yearly


class PaymentVerification(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    user_id: Optional[str] = None


class SubscriptionRequest(BaseModel):
    plan_id: str
    total_count: int = 12
    notes: Optional[dict] = None


class SubscriptionVerification(BaseModel):
    razorpay_subscription_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    user_id: Optional[str] = None


# ─────────────────────────────────────────────
# Usage Limit Helpers
# ─────────────────────────────────────────────
def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host


def check_usage_limit(client_id: str) -> dict:
    """Check if a user can generate a quiz."""
    if client_id in pro_users:
        return {"allowed": True, "is_pro": True, "remaining": -1}

    today = datetime.utcnow().strftime("%Y-%m-%d")
    tracker = free_usage_tracker[client_id]

    if tracker["date"] != today:
        tracker["date"] = today
        tracker["count"] = 0

    remaining = FREE_DAILY_LIMIT - tracker["count"]
    return {
        "allowed": remaining > 0,
        "is_pro": False,
        "remaining": max(0, remaining),
        "limit": FREE_DAILY_LIMIT,
    }


def increment_usage(client_id: str):
    today = datetime.utcnow().strftime("%Y-%m-%d")
    tracker = free_usage_tracker[client_id]
    if tracker["date"] != today:
        tracker["date"] = today
        tracker["count"] = 0
    tracker["count"] += 1


# ─────────────────────────────────────────────
# QUIZ ROUTES (original functionality)
# ─────────────────────────────────────────────
@app.post("/upload-and-generate")
async def upload_and_generate(
    file: UploadFile = File(...),
    num_questions: int = Query(default=5),
    difficulty: str = Query(default="medium"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Upload PDF and generate AI quiz for authenticated user.
    Enforces usage limits based on subscription plan.
    """
    # Check usage limit
    if not current_user.can_create_quiz():
        raise HTTPException(
            status_code=429,
            detail={
                "error": "daily_limit_reached",
                "message": f"Free limit of 3 quizzes/day reached. Upgrade to Pro for unlimited access!",
                "remaining": 0,
                "limit": 3,
            },
        )

    # Extract text from PDF
    contents = await file.read()
    text = extract_text_from_pdf(contents)

    if not text or len(text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Could not extract enough text from the PDF.")

    # Chunk large PDFs
    chunks = chunk_text(text)

    # Generate quiz
    quiz = generate_quiz(chunks, num_questions=num_questions, difficulty=difficulty)

    # Store quiz in database
    db_quiz = Quiz(
        user_id=current_user.id,
        pdf_filename=file.filename,
        pdf_text=text,
        quiz_data=quiz,
        num_questions=len(quiz.get("questions", [])),
    )
    db.add(db_quiz)
    
    # Increment usage for free users
    if current_user.plan == "free":
        current_user.increment_daily_usage()
    
    db.commit()
    db.refresh(current_user)

    return {
        "status": "success",
        "quiz_id": db_quiz.id,
        "quiz": quiz,
        "usage": {
            "plan": current_user.plan,
            "daily_used": current_user.daily_quizzes_used if current_user.plan == "free" else 0,
            "daily_limit": 3 if current_user.plan == "free" else -1,
            "remaining": max(0, 3 - current_user.daily_quizzes_used) if current_user.plan == "free" else -1,
        },
    }


@app.get("/usage-status")
async def usage_status(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Check current usage status for authenticated user."""
    db.refresh(current_user)
    
    return {
        "plan": current_user.plan,
        "subscription_active": current_user.subscription_active,
        "daily_used": current_user.daily_quizzes_used if current_user.plan == "free" else 0,
        "daily_limit": 3 if current_user.plan == "free" else -1,
        "remaining": max(0, 3 - current_user.daily_quizzes_used) if current_user.plan == "free" else -1,
    }


# ─────────────────────────────────────────────
# PAYMENT ROUTES — One-Time
# ─────────────────────────────────────────────
@app.post("/payment/create-order")
async def create_order(order_req: OrderRequest):
    try:
        order_data = {
            "amount": order_req.amount,
            "currency": order_req.currency,
            "receipt": f"studyquizai_{int(time.time())}",
            "notes": {
                "plan_type": order_req.plan_type,
                **(order_req.notes or {}),
            },
        }
        order = razorpay_client.order.create(data=order_data)
        return {
            "status": "success",
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "key_id": RAZORPAY_KEY_ID,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/payment/verify-payment")
async def verify_payment(
    verification: PaymentVerification,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Verify payment and upgrade user to Pro"""
    try:
        message = f"{verification.razorpay_order_id}|{verification.razorpay_payment_id}"
        expected_signature = hmac.new(
            RAZORPAY_KEY_SECRET.encode(),
            message.encode(),
            hashlib.sha256,
        ).hexdigest()

        if expected_signature != verification.razorpay_signature:
            raise HTTPException(status_code=400, detail="Payment verification failed")

        # Check if payment already processed
        existing_payment = db.query(Payment).filter(
            Payment.razorpay_payment_id == verification.razorpay_payment_id
        ).first()
        
        if existing_payment:
            raise HTTPException(status_code=400, detail="Payment already verified")

        # Create payment record
        payment = Payment(
            user_id=current_user.id,
            razorpay_order_id=verification.razorpay_order_id,
            razorpay_payment_id=verification.razorpay_payment_id,
            razorpay_signature=verification.razorpay_signature,
            status="success",
        )
        
        # Update user subscription (set to 30 days premium)
        current_user.plan = "monthly"
        current_user.subscription_active = True
        current_user.subscription_end_date = datetime.utcnow() + timedelta(days=30)
        
        db.add(payment)
        db.commit()
        db.refresh(current_user)

        return {
            "status": "success",
            "message": "Payment verified! You are now a Pro user.",
            "payment_id": verification.razorpay_payment_id,
            "plan": current_user.plan,
            "subscription_end_date": current_user.subscription_end_date,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────
# PAYMENT ROUTES — Subscriptions
# ─────────────────────────────────────────────
@app.post("/payment/create-plan")
async def create_plan():
    """Run once to create plans. Or create from Razorpay Dashboard."""
    try:
        monthly = razorpay_client.plan.create({
            "period": "monthly",
            "interval": 1,
            "item": {
                "name": "StudyQuizAI Pro — Monthly",
                "amount": 19900,  # ₹199/month
                "currency": "INR",
                "description": "Unlimited AI quiz generation",
            },
        })
        yearly = razorpay_client.plan.create({
            "period": "yearly",
            "interval": 1,
            "item": {
                "name": "StudyQuizAI Pro — Yearly",
                "amount": 149900,  # ₹1499/year
                "currency": "INR",
                "description": "Unlimited AI quiz generation — Annual",
            },
        })
        return {
            "monthly_plan_id": monthly["id"],
            "yearly_plan_id": yearly["id"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/payment/create-subscription")
async def create_subscription(sub_req: SubscriptionRequest):
    try:
        sub = razorpay_client.subscription.create({
            "plan_id": sub_req.plan_id,
            "total_count": sub_req.total_count,
            "notes": sub_req.notes or {},
        })
        return {
            "status": "success",
            "subscription_id": sub["id"],
            "key_id": RAZORPAY_KEY_ID,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/payment/verify-subscription")
async def verify_subscription(request: Request, verification: SubscriptionVerification):
    try:
        message = f"{verification.razorpay_payment_id}|{verification.razorpay_subscription_id}"
        expected_signature = hmac.new(
            RAZORPAY_KEY_SECRET.encode(),
            message.encode(),
            hashlib.sha256,
        ).hexdigest()

        if expected_signature == verification.razorpay_signature:
            client_id = verification.user_id or get_client_ip(request)
            pro_users.add(client_id)
            return {
                "status": "success",
                "message": "Subscription verified! You are now a Pro user.",
                "is_pro": True,
            }
        else:
            raise HTTPException(status_code=400, detail="Subscription verification failed")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────
# WEBHOOK
# ─────────────────────────────────────────────
@app.post("/payment/webhook")
async def razorpay_webhook(request: Request):
    try:
        payload = await request.body()
        signature = request.headers.get("X-Razorpay-Signature", "")
        webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET", "your_webhook_secret")

        expected = hmac.new(
            webhook_secret.encode(), payload, hashlib.sha256
        ).hexdigest()

        if expected != signature:
            raise HTTPException(status_code=400, detail="Invalid webhook signature")

        event = json.loads(payload)
        event_type = event.get("event")

        if event_type == "payment.captured":
            print(f"✅ Payment captured: {event['payload']['payment']['entity']['id']}")
        elif event_type == "subscription.activated":
            print(f"✅ Subscription activated: {event['payload']['subscription']['entity']['id']}")
        elif event_type == "subscription.cancelled":
            print(f"⚠️ Subscription cancelled: {event['payload']['subscription']['entity']['id']}")

        return {"status": "ok"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────
# Health Check
# ─────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "app": "StudyQuizAI", "version": "2.0.0"}
