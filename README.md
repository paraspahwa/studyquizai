# ReelForge AI — Complete Setup Guide

> AI-powered short video creation platform. Enter any topic → Get a viral-ready script, voiceover, visuals, and captions — all automated. Inspired by SwipeStory.click.

---

## What This App Does

**ReelForge AI** is a full-stack SaaS platform that lets creators generate faceless short-form videos for TikTok, YouTube Shorts, and Instagram Reels using AI:

- Enter any topic and choose your niche
- AI generates a viral-optimized script (OpenAI GPT-4o or template fallback)
- Voiceover, captions, visuals, and background music are automatically applied
- Download in HD or publish directly to social media
- **Free tier:** 5 videos/month · **Pro:** $19/mo unlimited · **Business:** $49/mo

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5 |
| Backend | Python 3.11, FastAPI, Uvicorn |
| AI | OpenAI GPT-4o (+ template fallback) |
| Payments | Razorpay (cards, UPI, net banking) |
| Database | PostgreSQL 15 |
| ORM | SQLAlchemy |
| Authentication | JWT (PyJWT) |
| Reverse Proxy | Nginx |
| Containerization | Docker, Docker Compose |

---

## Project Structure

```
studyquizai/
├── backend/
│   ├── main.py               # FastAPI app — all routes (auth, videos, payments)
│   ├── video_generator.py    # AI script generation (OpenAI + templates)
│   ├── database.py           # SQLAlchemy models
│   ├── auth.py               # JWT auth
│   ├── pdf_parser.py         # PDF text extraction (legacy)
│   ├── quiz_generator.py     # Quiz generation (legacy)
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Stage router: landing → auth → pricing → dashboard
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Full marketing homepage
│   │   │   ├── AuthPage.jsx      # Login / signup
│   │   │   ├── DashboardPage.jsx # Video creation + gallery + analytics
│   │   │   └── PricingPage.jsx   # Pricing + feature comparison
│   │   └── index.css             # Dark theme design system
│   ├── index.html
│   ├── package.json
│   ├── nginx.conf
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Quick Start

### Option A — Docker (Recommended)

```bash
# 1. Clone
git clone <your-repo-url>
cd studyquizai

# 2. Configure environment
cp .env.example .env
# Edit .env — fill in OPENAI_API_KEY, SECRET_KEY, and optionally Razorpay keys

# 3. Start everything
docker compose up --build

# 4. Open the app
# Frontend: http://localhost:3000
# API docs: http://localhost:8000/docs
```

### Option B — Local Development

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp ../.env.example ../.env  # fill in values
uvicorn main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env  # set VITE_API_URL=http://localhost:8000
npm run dev
# Open: http://localhost:5173
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI key for AI script generation |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SECRET_KEY` | Yes | JWT signing secret (32+ chars) |
| `RAZORPAY_KEY_ID` | No | Razorpay key ID (for payments) |
| `RAZORPAY_KEY_SECRET` | No | Razorpay secret |
| `VITE_API_URL` | Yes | Backend URL (default: `http://localhost:8000`) |

> Without `OPENAI_API_KEY`, the app still works using template-based script generation.

---

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and get JWT |
| GET | `/auth/me` | Get current user |

### Videos (protected — require `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/videos/generate-script` | Generate AI script for a topic |
| POST | `/videos/create` | Create a video job |
| GET | `/videos` | List user's videos |
| GET | `/videos/{id}` | Get specific video |
| DELETE | `/videos/{id}` | Delete a video |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payment/create-order` | Create Razorpay order |
| POST | `/payment/verify-payment` | Verify and activate plan |
| POST | `/payment/create-subscription` | Create subscription |
| POST | `/payment/verify-subscription` | Verify subscription |
| POST | `/payment/webhook` | Razorpay webhook handler |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |

---

## Key Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` (landing stage) | Full marketing page with hero, features, pricing, testimonials, FAQ |
| Auth | `/` (auth stage) | Login / signup with JWT |
| Dashboard | `/` (dashboard stage) | Create videos, gallery, analytics |
| Pricing | `/` (pricing stage) | Detailed pricing with feature comparison |

---

## Pricing Plans

| Plan | Price | Videos/mo | Quality | Voices |
|------|-------|-----------|---------|--------|
| Free | $0 | 5 | 720p + watermark | 5 basic |
| Pro | $19/mo | Unlimited | 1080p HD | 30+ premium |
| Business | $49/mo | Unlimited | 1080p HD | 30+ + custom |

---

## Production Checklist

- [ ] Set a strong random `SECRET_KEY`
- [ ] Update CORS origins in `backend/main.py`
- [ ] Switch to Razorpay live keys
- [ ] Set up SSL/TLS
- [ ] Configure production database
- [ ] Set up monitoring (Sentry, etc.)

---

## License

MIT
