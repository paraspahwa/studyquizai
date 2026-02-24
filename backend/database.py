"""
Database configuration and models for StudyQuizAI
"""

import os
from datetime import datetime, timedelta
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean, Float, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from werkzeug.security import generate_password_hash, check_password_hash

# Database setup
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./study_quiz_ai.db"  # Default to SQLite in project root
)

# For SQLite, we need to add check_same_thread=False for concurrent access
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False  # Set to True for SQL query debugging
    )
else:
    engine = create_engine(DATABASE_URL, echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ─────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────

class User(Base):
    """User account with subscription tracking"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    
    # Subscription
    plan = Column(String, default="free")  # 'free', 'monthly', 'yearly'
    subscription_active = Column(Boolean, default=True)
    subscription_end_date = Column(DateTime, nullable=True)
    
    # Usage tracking for free tier (resets daily)
    daily_quizzes_used = Column(Integer, default=0)
    daily_quizzes_date = Column(DateTime, default=datetime.utcnow)
    
    # Account management
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    quizzes = relationship("Quiz", back_populates="user", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="user", cascade="all, delete-orphan")
    quiz_results = relationship("QuizResult", back_populates="user", cascade="all, delete-orphan")
    
    def set_password(self, password: str):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password: str) -> bool:
        """Verify password"""
        return check_password_hash(self.password_hash, password)
    
    def can_create_quiz(self) -> bool:
        """Check if user can create a quiz based on plan and usage"""
        if self.plan != "free":
            return True
        
        # Check if daily limit reset
        now = datetime.utcnow()
        if (now - self.daily_quizzes_date).days >= 1:
            self.daily_quizzes_used = 0
            self.daily_quizzes_date = now
        
        return self.daily_quizzes_used < 3
    
    def increment_daily_usage(self):
        """Increment daily quiz count"""
        now = datetime.utcnow()
        if (now - self.daily_quizzes_date).days >= 1:
            self.daily_quizzes_used = 1
            self.daily_quizzes_date = now
        else:
            self.daily_quizzes_used += 1


class Quiz(Base):
    """Generated quiz from PDF"""
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # PDF and content info
    pdf_filename = Column(String, nullable=False)
    pdf_text = Column(Text, nullable=False)  # Extracted text from PDF
    
    # Quiz data (stored as JSON)
    quiz_data = Column(JSON, nullable=False)  # Full quiz structure
    num_questions = Column(Integer, nullable=False)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    user = relationship("User", back_populates="quizzes")
    results = relationship("QuizResult", back_populates="quiz", cascade="all, delete-orphan")


class QuizResult(Base):
    """User's quiz attempt and score"""
    __tablename__ = "quiz_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False, index=True)
    
    # Results
    score = Column(Integer, nullable=False)  # Number of correct answers
    total_questions = Column(Integer, nullable=False)
    percentage = Column(Float, nullable=False)  # Score as percentage
    
    # User answers (stored as JSON)
    user_answers = Column(JSON, nullable=False)  # {question_id: answer}
    
    # Metadata
    completed_at = Column(DateTime, default=datetime.utcnow, index=True)
    time_taken_seconds = Column(Integer, nullable=True)  # Time to complete quiz
    
    # Relationships
    user = relationship("User", back_populates="quiz_results")
    quiz = relationship("Quiz", back_populates="results")


class Payment(Base):
    """Payment and subscription records"""
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Payment details
    razorpay_order_id = Column(String, unique=True, nullable=False, index=True)
    razorpay_payment_id = Column(String, nullable=True, index=True)
    razorpay_signature = Column(String, nullable=True)
    
    # Plan info
    plan = Column(String, nullable=False)  # 'monthly', 'yearly'
    amount = Column(Float, nullable=False)  # In rupees
    currency = Column(String, default="INR")
    
    # Status
    status = Column(String, default="pending")  # 'pending', 'success', 'failed'
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="payments")


# ─────────────────────────────────────────────
# Database Utilities
# ─────────────────────────────────────────────

def init_db():
    """Create all tables"""
    Base.metadata.create_all(bind=engine)
    print("✅ Database initialized successfully!")


def get_db():
    """Dependency for FastAPI to get DB session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
