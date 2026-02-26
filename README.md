# StudyQuizAI — Complete Setup Guide

> AI-powered quiz generation platform. Upload any PDF → Get a quiz with per-option explanations → Monetize with Razorpay subscriptions.

---

## Table of Contents

1. [What This App Does](#1-what-this-app-does)
2. [Tech Stack](#2-tech-stack)
3. [Prerequisites](#3-prerequisites)
4. [Get Your API Keys](#4-get-your-api-keys)
5. [Project Structure](#5-project-structure)
6. [Environment Variables Setup](#6-environment-variables-setup)
7. [Option A — Docker Setup (Recommended)](#7-option-a--docker-setup-recommended)
8. [Option B — Local Development Setup](#8-option-b--local-development-setup)
9. [Database Setup](#9-database-setup)
10. [Razorpay Payment Setup](#10-razorpay-payment-setup)
11. [Razorpay Webhook Setup](#11-razorpay-webhook-setup)
12. [Running the Application](#12-running-the-application)
13. [Testing Payments](#13-testing-payments)
14. [API Reference](#14-api-reference)
15. [Going Live — Production Checklist](#15-going-live--production-checklist)
16. [Troubleshooting](#16-troubleshooting)

---

## 1. What This App Does

StudyQuizAI is a full-stack SaaS application that lets users:

- Upload any PDF document
- Automatically generate multiple-choice quizzes using OpenAI GPT-4o
- Get per-option explanations for every answer
- Download quiz PDFs and answer sheets
- Subscribe to Pro plans via Razorpay (UPI, cards, net banking)

**Free tier:** 1 quiz per user lifetime
**Pro tier:** Monthly (₹199) or Yearly (₹1,499) — unlimited quizzes

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5 |
| Backend | Python 3.11, FastAPI, Uvicorn |
| AI | OpenAI GPT-4o |
| Payments | Razorpay (UPI, cards, net banking, international) |
| Database | PostgreSQL 15 |
| ORM | SQLAlchemy |
| PDF Parsing | pdfplumber |
| Authentication | JWT (PyJWT) |
| Reverse Proxy | Nginx |
| Containerization | Docker, Docker Compose |

---

## 3. Prerequisites

### For Docker Setup (Recommended)

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose) — v20+
- Git

Verify Docker is installed:
```bash
docker --version
docker compose version
```

### For Local Development Setup

- Git
- Python 3.9 or higher
- Node.js 16 or higher + npm
- PostgreSQL 12 or higher

Verify installations:
```bash
python --version     # Python 3.9+
node --version       # v16+
npm --version
psql --version       # PostgreSQL 12+
```

---

## 4. Get Your API Keys

You need three external services before you can run this app.

### 4.1 OpenAI API Key

This is required for AI quiz generation using GPT-4o.

**Steps:**
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Log in or create a free account
3. Click **"Create new secret key"**
4. Name it (e.g., `studyquizai`) and click **"Create secret key"**
5. Copy the key — it starts with `sk-` and looks like: `sk-proj-abc123...`
6. Store it safely — you cannot see it again after closing the dialog

> Note: OpenAI API usage is billed per request. GPT-4o costs ~$0.005 per quiz generation. Create a [spending limit](https://platform.openai.com/settings/organization/limits) to avoid unexpected charges.

### 4.2 Razorpay API Keys

Required for accepting payments. Razorpay supports India and 100+ international currencies.

**Steps:**
1. Go to [https://razorpay.com](https://razorpay.com) and create a free account
2. Complete KYC verification (required for live payments; **not required for testing**)
3. Navigate to **Dashboard → Settings → API Keys**
4. Click **"Generate Test Key"** (you'll get test keys to start)
5. You will see:
   - **Key ID** — looks like: `rzp_test_AbCdEfGhIj1234`
   - **Key Secret** — looks like: `abcdefghijklmnopqrstuvwx`
6. Copy both values

### 4.3 Razorpay Webhook Secret

Required for receiving real-time payment event notifications.

**Steps:**
1. In your Razorpay Dashboard, go to **Settings → Webhooks**
2. Click **"Add New Webhook"**
3. Set the **Webhook URL** to your backend endpoint:
   - Local testing: Use a tool like [ngrok](https://ngrok.com/) (see [Section 11](#11-razorpay-webhook-setup))
   - Production: `https://yourdomain.com/payment/webhook`
4. Under **"Active Events"**, enable:
   - `payment.captured`
   - `subscription.activated`
   - `subscription.cancelled`
5. Set a **Secret** (create a random string, e.g., `my-webhook-secret-2024`)
6. Click **"Create Webhook"**
7. Copy the secret you set

---

## 5. Project Structure

```
studyquizai/
├── backend/
│   ├── main.py               # FastAPI app — all routes
│   ├── database.py           # SQLAlchemy models (User, Quiz, Payment, etc.)
│   ├── auth.py               # JWT creation & verification
│   ├── pdf_parser.py         # PDF text extraction
│   ├── quiz_generator.py     # OpenAI GPT-4o integration
│   ├── init_db.py            # Manual DB initialization script
│   ├── requirements.txt      # Python dependencies
│   ├── Dockerfile            # Backend container
│   └── .env.example          # Backend env template
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main app with stage routing
│   │   ├── main.jsx          # React entry point
│   │   ├── index.css         # Global styles
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx    # Marketing homepage
│   │   │   └── PricingPage.jsx    # Subscription pricing
│   │   ├── components/
│   │   │   ├── UploadSection.jsx  # PDF upload with usage bar
│   │   │   ├── QuizSection.jsx    # Active quiz display
│   │   │   ├── QuizCard.jsx       # Individual question card
│   │   │   └── ResultsSummary.jsx # Score & analytics
│   │   └── hooks/
│   │       └── useRazorpay.jsx    # Razorpay checkout hook
│   ├── index.html
│   ├── vite.config.js        # Vite dev server with API proxy
│   ├── nginx.conf            # Production reverse proxy config
│   ├── package.json
│   ├── Dockerfile            # Multi-stage frontend build
│   └── .env.example          # Frontend env template
│
├── docker-compose.yml        # Orchestrates all 3 services
├── .env.example              # Root env template (single source of truth)
├── setup.sh                  # One-command automated setup
└── README.md                 # This file
```

---

## 6. Environment Variables Setup

All configuration lives in a single `.env` file at the project root.

**Step 1:** Copy the example file:
```bash
cp .env.example .env
```

**Step 2:** Open `.env` and fill in every value:
```bash
# ─────────────────────────────────────────
# StudyQuizAI — Environment Variables
# ─────────────────────────────────────────

# OpenAI API Key (required for quiz generation)
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-your-actual-key-here

# PostgreSQL Database Connection
# Docker: use the default below (matches docker-compose.yml)
# Local: change to your local PostgreSQL credentials
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/studyquizai

# JWT Authentication Secret
# IMPORTANT: Change this in production! Use a random 32+ character string.
# Generate one: python -c "import secrets; print(secrets.token_hex(32))"
SECRET_KEY=your-secret-key-change-in-production-min-32-chars

# Razorpay Payment Gateway
# Get from: https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here

# Frontend Configuration
# This is the URL of your backend API (used by Vite in dev, and by the frontend build)
VITE_API_URL=http://localhost:8000

# Razorpay Subscription Plan IDs
# These are generated AFTER running the app once — see Section 10
VITE_RAZORPAY_MONTHLY_PLAN_ID=plan_xxxxx
VITE_RAZORPAY_YEARLY_PLAN_ID=plan_yyyyy
```

> **Important:** Never commit your `.env` file to Git. It is already in `.gitignore`.

---

## 7. Option A — Docker Setup (Recommended)

This runs all three services (PostgreSQL, Backend, Frontend+Nginx) in containers. No need to install Python, Node.js, or PostgreSQL separately.

### Step 1: Clone the Repository

```bash
git clone https://github.com/paraspahwa/StudyQuizAI.git
cd StudyQuizAI
```

### Step 2: Create and Configure Environment File

```bash
cp .env.example .env
```

Edit `.env` with your keys (at minimum, fill in `OPENAI_API_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET`):

```bash
nano .env
# or: code .env  (VS Code)
# or: vim .env
```

For Docker, the `DATABASE_URL` should use the Docker service name `postgres` as host:
```
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/studyquizai
```

### Step 3: Build and Start All Services

```bash
docker compose up --build
```

This will:
1. Pull the PostgreSQL 15 image and start the database
2. Build the Python/FastAPI backend image and start it (auto-creates DB tables)
3. Build the React frontend with Nginx and start it

Wait until you see output like:
```
backend  | INFO:     Uvicorn running on http://0.0.0.0:8000
frontend | ...nginx: master process
```

### Step 4: Verify Services are Running

Open a new terminal:
```bash
# Check all containers are healthy
docker compose ps

# Test backend API
curl http://localhost:8000/health

# Should return: {"status":"healthy"}
```

### Step 5: Create Razorpay Subscription Plans (One-time)

This creates the Monthly and Yearly plans in your Razorpay account:

```bash
curl -X POST http://localhost:8000/payment/create-plan
```

You will get a response like:
```json
{
  "monthly_plan_id": "plan_AbCdEfGh1234",
  "yearly_plan_id": "plan_XyZaBcDe5678",
  "message": "Plans created successfully"
}
```

### Step 6: Update `.env` with Plan IDs

Copy the plan IDs from the previous step into your `.env`:

```
VITE_RAZORPAY_MONTHLY_PLAN_ID=plan_AbCdEfGh1234
VITE_RAZORPAY_YEARLY_PLAN_ID=plan_XyZaBcDe5678
```

### Step 7: Rebuild the Frontend with Plan IDs

Since the frontend bakes environment variables at build time, rebuild after updating `.env`:

```bash
docker compose up -d --build frontend
```

### Step 8: Access the App

Open your browser and visit:
- **App:** http://localhost:3000
- **API Docs (Swagger):** http://localhost:8000/docs
- **API Docs (Redoc):** http://localhost:8000/redoc

---

## 8. Option B — Local Development Setup

Use this if you want hot-reload development without Docker.

### Step 1: Clone the Repository

```bash
git clone https://github.com/paraspahwa/StudyQuizAI.git
cd StudyQuizAI
```

### Step 2: Install PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu / Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Windows:**
Download and run the installer from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)

### Step 3: Create the Database

```bash
# Connect as the postgres superuser
psql -U postgres

# Inside psql shell, run:
CREATE DATABASE studyquizai;
CREATE USER studyquizai_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE studyquizai TO studyquizai_user;
\q
```

Or simply:
```bash
createdb studyquizai
```

### Step 4: Set Up the Backend

```bash
# Navigate to backend directory
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate it
# macOS / Linux:
source venv/bin/activate
# Windows (Command Prompt):
venv\Scripts\activate.bat
# Windows (PowerShell):
venv\Scripts\Activate.ps1

# Install all Python dependencies
pip install -r requirements.txt
```

### Step 5: Configure Backend Environment

Go back to the project root and create your `.env`:

```bash
cd ..
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL` to point to your local PostgreSQL:

```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/studyquizai
```

Fill in all other required keys (OpenAI, Razorpay, SECRET_KEY).

### Step 6: Initialize the Database

The backend auto-creates tables on startup, but you can also run it manually:

```bash
cd backend
source venv/bin/activate  # activate virtual env if not already
python init_db.py
```

Expected output:
```
Database tables created successfully.
```

### Step 7: Start the Backend

```bash
cd backend
source venv/bin/activate  # if not already activated

# Start with hot-reload for development
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

### Step 8: Set Up the Frontend

Open a **new terminal** in the project root:

```bash
cd frontend

# Install Node.js dependencies
npm install

# Create frontend env file
cp .env.example .env
```

Edit `frontend/.env`:
```
VITE_API_URL=http://localhost:8000
VITE_RAZORPAY_MONTHLY_PLAN_ID=plan_xxxxx   # Add after Step 10
VITE_RAZORPAY_YEARLY_PLAN_ID=plan_yyyyy    # Add after Step 10
```

### Step 9: Start the Frontend Dev Server

```bash
npm run dev
```

The frontend runs at: http://localhost:5173
It automatically proxies API calls to the backend at port 8000.

---

## 9. Database Setup

### Schema Overview

The app uses four PostgreSQL tables, all auto-created by SQLAlchemy on startup:

#### `users` table
Stores user accounts and subscription status.

| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer (PK) | Auto-increment |
| `email` | String (unique) | User email |
| `password_hash` | String | bcrypt hash |
| `plan` | String | `free`, `monthly`, or `yearly` |
| `subscription_active` | Boolean | Whether subscription is active |
| `subscription_end_date` | DateTime | Subscription expiry date |
| `total_quizzes_generated` | Integer | Lifetime quiz count |
| `created_at` | DateTime | Account creation timestamp |
| `updated_at` | DateTime | Last update timestamp |

#### `quizzes` table
Stores generated quizzes linked to users.

| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer (PK) | Auto-increment |
| `user_id` | Integer (FK) | References `users.id` |
| `pdf_filename` | String | Original PDF filename |
| `pdf_text` | Text | Extracted PDF content |
| `quiz_data` | JSON | Full quiz with questions & options |
| `num_questions` | Integer | Number of questions generated |
| `created_at` | DateTime | Generation timestamp |

#### `quiz_results` table
Stores user attempts and scores.

| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer (PK) | Auto-increment |
| `user_id` | Integer (FK) | References `users.id` |
| `quiz_id` | Integer (FK) | References `quizzes.id` |
| `score` | Integer | Correct answers count |
| `total_questions` | Integer | Total questions in quiz |
| `percentage` | Float | Score percentage |
| `user_answers` | JSON | User's selected answers |
| `completed_at` | DateTime | Completion timestamp |
| `time_taken_seconds` | Integer | Time to complete |

#### `payments` table
Stores Razorpay payment and subscription records.

| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer (PK) | Auto-increment |
| `user_id` | Integer (FK) | References `users.id` |
| `razorpay_order_id` | String | Razorpay order ID |
| `razorpay_payment_id` | String | Razorpay payment ID |
| `razorpay_signature` | String | Payment signature |
| `plan` | String | `monthly` or `yearly` |
| `amount` | Integer | Amount in paise |
| `currency` | String | `INR` |
| `status` | String | `pending`, `success`, or `failed` |
| `created_at` | DateTime | Payment initiation timestamp |
| `updated_at` | DateTime | Last update timestamp |

### Manual Database Operations

Connect to the database directly:

```bash
# Docker:
docker exec -it studyquizai-postgres-1 psql -U postgres -d studyquizai

# Local:
psql -U postgres -d studyquizai
```

Useful queries:
```sql
-- List all users
SELECT id, email, plan, total_quizzes_generated FROM users;

-- List all payments
SELECT id, user_id, plan, status, amount FROM payments;

-- Check a user's subscription
SELECT email, plan, subscription_active, subscription_end_date FROM users WHERE email = 'user@example.com';

-- Reset a user to free plan (for testing)
UPDATE users SET plan = 'free', subscription_active = false, total_quizzes_generated = 0 WHERE email = 'user@example.com';
```

---

## 10. Razorpay Payment Setup

### Step 1: Verify Your Razorpay Keys

Make sure these are filled in your `.env`:
```
RAZORPAY_KEY_ID=rzp_test_AbCdEfGhIj1234
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

### Step 2: Create Subscription Plans

Run the following command **once** to create the Monthly and Yearly plans in Razorpay. This only needs to be done once per Razorpay account (test and live are separate):

```bash
curl -X POST http://localhost:8000/payment/create-plan
```

Response:
```json
{
  "monthly_plan_id": "plan_AbCdEfGh1234",
  "yearly_plan_id": "plan_XyZaBcDe5678",
  "message": "Plans created successfully"
}
```

> If you re-run this, it will create duplicate plans in Razorpay. To avoid that, only run it once and save the plan IDs.

### Step 3: Save Plan IDs to Environment

**Root `.env`:**
```
VITE_RAZORPAY_MONTHLY_PLAN_ID=plan_AbCdEfGh1234
VITE_RAZORPAY_YEARLY_PLAN_ID=plan_XyZaBcDe5678
```

**Frontend `frontend/.env`** (local dev only):
```
VITE_RAZORPAY_MONTHLY_PLAN_ID=plan_AbCdEfGh1234
VITE_RAZORPAY_YEARLY_PLAN_ID=plan_XyZaBcDe5678
```

### Step 4: Rebuild the Frontend (Docker Only)

Since Vite bakes environment variables at build time:

```bash
docker compose up -d --build frontend
```

### Payment Flow Explained

```
User clicks "Get Pro" on Pricing page
        │
        ▼
Frontend → POST /payment/create-subscription
        │  (sends plan_id and user token)
        │
        ▼
Backend → Razorpay API (creates subscription)
        │  Returns subscription_id
        │
        ▼
Razorpay Checkout popup opens in browser
(UPI / Card / Net Banking options)
        │
        ▼
User completes payment in Razorpay
        │
        ▼
Frontend → POST /payment/verify-subscription
        │  (sends razorpay_payment_id, subscription_id, signature)
        │
        ▼
Backend verifies HMAC-SHA256 signature
        │
        ▼
User plan updated to "monthly" or "yearly" in DB
Unlimited quiz access granted
```

### Razorpay Dashboard — Key Settings

After creating plans, verify in your Razorpay Dashboard:

1. Go to **Products → Subscriptions → Plans**
2. You should see "StudyQuizAI Monthly" and "StudyQuizAI Yearly" plans
3. Confirm plan amounts: ₹199/month and ₹1,499/year

---

## 11. Razorpay Webhook Setup

Webhooks allow Razorpay to notify your app when payments succeed, subscriptions activate or cancel — even if the user closes the browser tab.

### For Local Development — Using ngrok

**Step 1:** Install ngrok from [https://ngrok.com/download](https://ngrok.com/download)

**Step 2:** Start ngrok tunnel pointing to your backend:
```bash
ngrok http 8000
```

You'll see output like:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:8000
```

**Step 3:** Copy the `https://` URL (e.g., `https://abc123.ngrok-free.app`)

**Step 4:** In Razorpay Dashboard → Settings → Webhooks:
- URL: `https://abc123.ngrok-free.app/payment/webhook`
- Events: `payment.captured`, `subscription.activated`, `subscription.cancelled`
- Secret: your `RAZORPAY_WEBHOOK_SECRET` value

**Step 5:** Click **"Create Webhook"**

> Note: ngrok URLs change every time you restart ngrok (on free plan). Update the webhook URL in Razorpay each time.

### For Production

In Razorpay Dashboard → Settings → Webhooks:
- URL: `https://yourdomain.com/payment/webhook`
- Events: `payment.captured`, `subscription.activated`, `subscription.cancelled`
- Secret: your `RAZORPAY_WEBHOOK_SECRET` value

The backend endpoint `/payment/webhook` validates the Razorpay signature using HMAC-SHA256 and updates user plans automatically.

---

## 12. Running the Application

### Docker (after initial setup)

```bash
# Start all services (in foreground, shows logs)
docker compose up

# Start in background (detached mode)
docker compose up -d

# Stop all services
docker compose down

# Stop and remove volumes (DELETES the database — use carefully)
docker compose down -v

# View logs
docker compose logs -f           # all services
docker compose logs -f backend   # backend only
docker compose logs -f frontend  # frontend only
docker compose logs -f postgres  # database only

# Restart a specific service
docker compose restart backend

# Rebuild a specific service after code changes
docker compose up -d --build backend
docker compose up -d --build frontend
```

### Local Development

**Terminal 1 — Backend:**
```bash
cd backend
source venv/bin/activate   # macOS/Linux
# or: venv\Scripts\activate (Windows)
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

**Access:**
- App: http://localhost:5173 (dev) or http://localhost:3000 (Docker)
- API Docs: http://localhost:8000/docs

### Build Frontend for Production

```bash
cd frontend
npm run build
# Output is in frontend/dist/
```

---

## 13. Testing Payments

Use these test credentials to simulate payments without real money (test mode only).

### Test Card Details

| Field | Value |
|-------|-------|
| Card Number | `4111 1111 1111 1111` |
| Expiry | Any future date (e.g., `12/29`) |
| CVV | Any 3 digits (e.g., `123`) |
| Name | Any name |

### Test UPI

| Field | Value |
|-------|-------|
| UPI ID | `success@razorpay` |

### Test Net Banking

Select any bank — all auto-succeed in test mode.

### Test International Card

| Field | Value |
|-------|-------|
| Card Number | `4012 8888 8888 1881` |
| Expiry | Any future date |
| CVV | Any 3 digits |

### Simulating a Failed Payment

Use card number `4000 0000 0000 0002` to simulate a declined card.

### Verifying a Payment Worked

1. Check the Razorpay Dashboard → **Transactions** — the payment should appear
2. Check the database:
```sql
SELECT email, plan, subscription_active FROM users WHERE email = 'testuser@example.com';
```
3. The `plan` field should change from `free` to `monthly` or `yearly`

---

## 14. API Reference

### Authentication

All protected routes require the `Authorization: Bearer <token>` header.

**Register a new user:**
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepassword"}'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {"id": 1, "email": "user@example.com", "plan": "free"}
}
```

**Login:**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepassword"}'
```

**Get current user:**
```bash
curl http://localhost:8000/auth/me \
  -H "Authorization: Bearer <your_token>"
```

### Quiz Generation

**Upload PDF and generate quiz:**
```bash
curl -X POST http://localhost:8000/upload-and-generate \
  -H "Authorization: Bearer <your_token>" \
  -F "file=@/path/to/document.pdf" \
  -F "num_questions=10" \
  -F "difficulty=medium"
```

**Check usage status:**
```bash
curl http://localhost:8000/usage-status \
  -H "Authorization: Bearer <your_token>"
```

Response:
```json
{
  "plan": "free",
  "quizzes_generated": 0,
  "can_generate": true,
  "limit": 1
}
```

### Payments

**Create subscription:**
```bash
curl -X POST http://localhost:8000/payment/create-subscription \
  -H "Content-Type: application/json" \
  -d '{"plan_id": "plan_AbCdEfGh1234"}'
```

**Verify subscription:**
```bash
curl -X POST http://localhost:8000/payment/verify-subscription \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_payment_id": "pay_xxx",
    "razorpay_subscription_id": "sub_xxx",
    "razorpay_signature": "signature_here",
    "plan": "monthly"
  }'
```

### Health Check

```bash
curl http://localhost:8000/health
# Returns: {"status": "healthy"}
```

### Full Endpoints List

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login and get JWT |
| GET | `/auth/me` | Yes | Get current user info |
| POST | `/upload-and-generate` | Yes | Generate quiz from PDF |
| GET | `/usage-status` | Yes | Check quiz usage limits |
| GET | `/quiz/{id}/download` | Yes | Download quiz as PDF |
| GET | `/quiz/{id}/answers` | Yes | Download answer sheet PDF |
| POST | `/payment/create-order` | No | Create one-time payment order |
| POST | `/payment/verify-payment` | Yes | Verify and activate one-time payment |
| POST | `/payment/create-plan` | No | Create Razorpay plans (run once) |
| POST | `/payment/create-subscription` | No | Create subscription |
| POST | `/payment/verify-subscription` | Yes | Verify and activate subscription |
| POST | `/payment/webhook` | No | Razorpay webhook handler |
| GET | `/health` | No | API health check |

---

## 15. Going Live — Production Checklist

Before deploying to production, complete these steps in order:

### Security

- [ ] Generate a strong `SECRET_KEY`:
  ```bash
  python -c "import secrets; print(secrets.token_hex(32))"
  ```
  Update in your production `.env`
- [ ] Set `SECRET_KEY` to a 64-character random hex string (minimum 32 chars)
- [ ] Ensure `.env` is never committed to Git (already in `.gitignore`)
- [ ] Update CORS origins in `backend/main.py` to your production domain:
  ```python
  allow_origins=["https://yourdomain.com"]
  ```

### Razorpay Live Mode

- [ ] Complete Razorpay KYC verification in the Dashboard
- [ ] Switch from test keys to live keys in your production `.env`:
  ```
  RAZORPAY_KEY_ID=rzp_live_AbCdEfGhIj1234
  RAZORPAY_KEY_SECRET=your_live_secret_key
  ```
- [ ] Re-run `POST /payment/create-plan` with live keys to create live plans
- [ ] Update `VITE_RAZORPAY_MONTHLY_PLAN_ID` and `VITE_RAZORPAY_YEARLY_PLAN_ID` with live plan IDs
- [ ] Enable international payments in Razorpay Dashboard (if needed)
- [ ] Set live webhook URL: `https://yourdomain.com/payment/webhook`
- [ ] Update `RAZORPAY_WEBHOOK_SECRET` with the live webhook secret

### Database

- [ ] Use a managed database service (e.g., AWS RDS, Supabase, Neon, Railway PostgreSQL)
- [ ] Update `DATABASE_URL` with production credentials
- [ ] Set up automated daily database backups
- [ ] Test backup restoration process

### Frontend

- [ ] Update `VITE_API_URL` to your production backend URL
- [ ] Rebuild the Docker image after any `.env` changes
- [ ] Test the full flow (register → upload PDF → quiz → payment) on staging first

### Infrastructure

- [ ] Deploy with a process manager (Docker Compose, Kubernetes, or cloud platform)
- [ ] Set up SSL/TLS certificate (Let's Encrypt via Certbot or your cloud provider)
- [ ] Configure Nginx for HTTPS with redirect from HTTP
- [ ] Set up monitoring and error alerts (e.g., Sentry, Datadog)
- [ ] Configure log aggregation

### Deployment Options

| Platform | Notes |
|----------|-------|
| **Railway** | Deploy `docker-compose.yml` directly; managed PostgreSQL available |
| **Render** | Deploy backend as Web Service + frontend as Static Site |
| **AWS** | ECS/EKS for containers + RDS for PostgreSQL |
| **DigitalOcean** | App Platform supports Docker Compose |
| **Fly.io** | Good for small-to-medium apps with built-in Postgres |

---

## 16. Troubleshooting

### Docker Issues

**Problem:** `docker compose up` fails with "port already in use"
```bash
# Find what's using the port (e.g., 5432 for PostgreSQL)
sudo lsof -i :5432
sudo lsof -i :8000
sudo lsof -i :3000

# Kill the process or change the port in docker-compose.yml
```

**Problem:** Backend container exits immediately
```bash
# Check logs for the actual error
docker compose logs backend

# Common causes:
# - Missing or incorrect OPENAI_API_KEY
# - DATABASE_URL host is "localhost" instead of "postgres" (Docker hostname)
# - Syntax error in .env file
```

**Problem:** Frontend shows blank page or API errors
```bash
docker compose logs frontend

# Check that VITE_API_URL is set correctly
# In Docker: VITE_API_URL is not used at runtime — Nginx proxies to "backend:8000"
# In local dev: VITE_API_URL=http://localhost:8000
```

**Problem:** PostgreSQL container not ready
```bash
# The backend has a health check, but if DB is slow:
docker compose restart backend
# or wait 10-15 seconds and try again
```

### Backend Issues

**Problem:** `ModuleNotFoundError` when starting backend
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**Problem:** `sqlalchemy.exc.OperationalError: could not connect to server`
- Check that PostgreSQL is running: `brew services list` or `sudo systemctl status postgresql`
- Verify `DATABASE_URL` in `.env` has the correct host, port, username, and password

**Problem:** `openai.AuthenticationError: Incorrect API key`
- Verify `OPENAI_API_KEY` in `.env` starts with `sk-` and is correct
- Check you have billing set up at https://platform.openai.com/billing

**Problem:** `razorpay.errors.BadRequestError`
- Verify both `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are correctly set
- Make sure you are using test keys (`rzp_test_`) in test mode

### Payment Issues

**Problem:** Payment succeeds but user stays on free plan
- Check that the webhook is configured and receiving events
- Look at backend logs during payment: `docker compose logs -f backend`
- Verify `RAZORPAY_WEBHOOK_SECRET` matches what's set in Razorpay Dashboard

**Problem:** "Plan not found" error when subscribing
- You need to create plans first: `curl -X POST http://localhost:8000/payment/create-plan`
- Verify `VITE_RAZORPAY_MONTHLY_PLAN_ID` and `VITE_RAZORPAY_YEARLY_PLAN_ID` are set
- Rebuild frontend after updating plan IDs

**Problem:** Subscription created but verification fails
- Signature mismatch: Check that `RAZORPAY_KEY_SECRET` is correct
- Ensure you're passing `razorpay_payment_id`, `razorpay_subscription_id`, and `razorpay_signature` correctly

### Frontend Issues

**Problem:** Vite dev server can't reach backend
- Confirm backend is running on port 8000
- Check `frontend/vite.config.js` proxy settings
- Try `curl http://localhost:8000/health` to verify backend is up

**Problem:** Razorpay checkout popup does not open
- Check browser console for JavaScript errors
- Verify `VITE_RAZORPAY_MONTHLY_PLAN_ID` is set (not the placeholder `plan_xxxxx`)
- Ensure `RAZORPAY_KEY_ID` starts with `rzp_test_` (in test mode) or `rzp_live_` (in production)

---

## Quick Reference

### Ports

| Service | Port |
|---------|------|
| Frontend (Docker) | 3000 |
| Frontend (Local Dev) | 5173 |
| Backend API | 8000 |
| PostgreSQL | 5432 |

### Key URLs

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Main app (Docker) |
| http://localhost:5173 | Main app (Local dev) |
| http://localhost:8000/docs | Interactive API docs |
| http://localhost:8000/health | API health check |
| https://dashboard.razorpay.com | Razorpay Dashboard |
| https://platform.openai.com/usage | OpenAI usage & billing |

### Essential Commands

```bash
# Start everything (Docker)
docker compose up --build

# Stop everything (Docker)
docker compose down

# Create Razorpay plans (one-time)
curl -X POST http://localhost:8000/payment/create-plan

# Check backend logs
docker compose logs -f backend

# Connect to database
docker exec -it studyquizai-postgres-1 psql -U postgres -d studyquizai

# Run backend locally
cd backend && source venv/bin/activate && uvicorn main:app --reload

# Run frontend locally
cd frontend && npm run dev
```

---

## License

MIT — see [LICENSE](LICENSE) for details.
