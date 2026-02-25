# ⚡ StudyQuizAI

> Upload any PDF → Get an AI-powered quiz with per-option explanations → Pay with Razorpay (India + International)

**Rebranded and upgraded from [QuizAPP](https://github.com/paraspahwa/QuizAPP)** with a polished landing page, Razorpay payments (one-time + subscriptions), and free-tier usage limits.

---

## What's New (vs QuizAPP)

| Feature | QuizAPP | StudyQuizAI |
|---------|---------|-------------|
| Branding | Generic | ⚡ StudyQuizAI with landing page |
| Payments | ❌ None | ✅ Razorpay (UPI, cards, international) |
| Plans | — | Monthly (₹199) / Yearly (₹1,499) |
| Usage Limits | Unlimited | Free: 1/User · Pro: Unlimited |
| Landing Page | ❌ | ✅ Full marketing page |
| Pricing Page | ❌ | ✅ With plan comparison |
| Quiz Features | ✅ All preserved | ✅ All preserved + usage bar |

---

## Project Structure

```
StudyQuizAI/
├── backend/
│   ├── main.py               # FastAPI routes (quiz + payments + usage limits)
│   ├── pdf_parser.py          # PDF text extraction + chunking
│   ├── quiz_generator.py      # OpenAI GPT-4o quiz generation
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Stage manager (landing → upload → quiz → results)
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── hooks/
│   │   │   └── useRazorpay.js # Razorpay checkout hook
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   └── PricingPage.jsx
│   │   └── components/
│   │       ├── UploadSection.jsx   # PDF upload + usage bar
│   │       ├── QuizSection.jsx     # Quiz renderer
│   │       ├── QuizCard.jsx        # Per-question card
│   │       └── ResultsSummary.jsx  # Score screen
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── nginx.conf
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## Quick Start

### 1. Clone & configure

```bash
git clone https://github.com/paraspahwa/StudyQuizAI.git
cd StudyQuizAI
cp .env.example .env
```

Edit `.env` and add your keys:
- `OPENAI_API_KEY` — from [OpenAI](https://platform.openai.com/api-keys)
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — from [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)

### 2. Run with Docker

```bash
docker compose up --build
```

Visit: **http://localhost:3000**

### 3. Create subscription plans (one-time)

```bash
curl -X POST http://localhost:8000/payment/create-plan
```

Copy the returned plan IDs into your `.env`:
```
VITE_RAZORPAY_MONTHLY_PLAN_ID=plan_xxxxx
VITE_RAZORPAY_YEARLY_PLAN_ID=plan_yyyyy
```

---

## Local Development (without Docker)

### Prerequisites

- PostgreSQL 12+ installed locally
- Python 3.9+
- Node.js 16+

### Backend Setup

```bash
# 1. Create PostgreSQL database
createdb studyquizai

# 2. Setup Python environment
cd backend
python -m venv venv && source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp ../.env.example ../.env
# Edit .env with your OpenAI & Razorpay keys
# DATABASE_URL should be: postgresql://your_user:your_password@localhost/studyquizai

# 5. Run backend
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Payment Flow

```
User clicks "Get Pro"
    ↓
Frontend → POST /payment/create-order → Razorpay API
    ↓
Razorpay Checkout popup opens (UPI / Card / Net Banking)
    ↓
User pays → Razorpay returns payment details
    ↓
Frontend → POST /payment/verify-payment → Backend verifies signature
    ↓
✅ User marked as Pro → Unlimited quizzes
```

---

## Testing Payments

| Method | Test Credentials |
|--------|-----------------|
| Card | `4111 1111 1111 1111`, any future expiry, any CVV |
| UPI | `success@razorpay` |
| Net Banking | Any bank (auto-succeeds in test mode) |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create new user account |
| POST | `/auth/login` | Login and get JWT token |
| GET | `/auth/me` | Get current user info |

### Quiz Generation
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload-and-generate` | Generate quiz from PDF (requires auth) |
| GET | `/usage-status` | Check daily/subscription usage (requires auth) |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payment/create-order` | Create one-time payment |
| POST | `/payment/verify-payment` | Verify payment (requires auth) |
| POST | `/payment/create-plan` | Create subscription plans |
| POST | `/payment/create-subscription` | Start subscription |
| POST | `/payment/verify-subscription` | Verify subscription |

---

## Database Setup

StudyQuizAI uses **PostgreSQL** for production-grade data persistence:
- ✅ User authentication (registration & login with JWT)
- ✅ Quiz history tracking
- ✅ Usage limit tracking (daily limits for free users)
- ✅ Payment records and subscriptions

### Database Tables

1. **users** — User accounts with subscription status & daily quotas
2. **quizzes** — Generated quizzes from PDFs
3. **quiz_results** — User quiz attempts and scores
4. **payments** — Payment and subscription records

### Database Configuration

**With Docker (Recommended):**
```bash
docker compose up --build
# Automatic: PostgreSQL starts and tables are created
```

**Local Development:**
```bash
# 1. Install PostgreSQL (if not already installed)
# macOS: brew install postgresql
# Ubuntu: sudo apt install postgresql postgresql-contrib

# 2. Create database
createdb studyquizai

# 3. Update .env with your connection
DATABASE_URL=postgresql://your_user:your_password@localhost/studyquizai

# 4. Run backend (auto-initializes tables)
cd backend && uvicorn main:app --reload
```

### Initialize Database

The database is automatically initialized when the app starts. To manually initialize:

```bash
cd backend
python init_db.py
```

### Authentication Flow

```
1. User registers: POST /auth/register
   → Creates user account, hashes password
   → Returns JWT access token

2. User login: POST /auth/login
   → Validates credentials
   → Returns JWT access token

3. All quiz endpoints require:
   → Authorization: Bearer <token> header
```

### Usage in Frontend

Add JWT token to request headers:

```javascript
const token = localStorage.getItem('authToken');
const response = await fetch('/upload-and-generate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});
```

---

## Going Live Checklist

- [ ] Replace `rzp_test_` keys with `rzp_live_` keys
- [ ] Enable international payments in Razorpay Dashboard
- [ ] Set webhook URL: `https://yourdomain.com/payment/webhook`
- [ ] Set up database backups for PostgreSQL
- [ ] Add user authentication tests
- [ ] Update CORS origins in `main.py`
- [ ] Deploy backend + frontend (Railway / Render / AWS)
- [ ] Use strong `SECRET_KEY` in production (min 32 chars)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite |
| Backend | Python 3.11, FastAPI |
| AI | OpenAI GPT-4o |
| Payments | Razorpay |
| PDF Parsing | pdfplumber |
| Containerization | Docker, Docker Compose |
| Reverse Proxy | nginx |

---

## License

MIT
