# 🛡️ HACKFORGE by Chrishem
### *The Production-Ready Offensive Security & Ethical Hacking Education Platform*

> ⚠️ **Authorized Training Environment Only** — Never test systems you do not own or have written permission to test.

---

## ⚡ Architecture Overview

HACKFORGE is a full-stack, hands-on offensive security platform engineered from scratch. Every lesson pairs conceptual theory, verified video briefings, real copy-paste commands (Kali/Parrot), a live browser-based lab terminal (powered by `@xterm/xterm` and isolated container sandboxes), and a mandatory 5-question MCQ knowledge gate before completion is granted.

```
                    ┌───────────────────────────┐
                    │     React + Vite Client   │
                    │   (@xterm/xterm, Tailwind)│
                    └─────────────┬─────────────┘
                                  │
                   HTTPS / REST   │   WebSocket (ttyd)
                                  ▼
                    ┌───────────────────────────┐
                    │     FastAPI / Node API    │
                    │   (JWT, PostgreSQL async) │
                    └─────────────┬─────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          ▼                       ▼                       ▼
┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
│ PostgreSQL (Neon) │   │ Docker Lab Engine │   │ Gemini AI Mentor  │
│ asyncpg / models  │   │ 512MB RAM, 60m TTL│   │ Server-side SDK   │
└───────────────────┘   └───────────────────┘   └───────────────────┘
```

---

## 🚀 Quickstart: Local Development with Docker Compose

Run the entire platform (PostgreSQL + FastAPI Backend + React Web Client) with a single command:

```bash
cp .env.example .env
# Edit .env and replace every REPLACE_* value with unique local secrets before starting services.
docker compose up --build
```

- **Frontend Application:** http://localhost:3000
- **FastAPI Documentation:** http://localhost:8000/docs
- **PostgreSQL Database:** localhost:5432 (bound to loopback for local development; credentials are private values in `.env`).

---

## 🧪 Seeding the Curriculum Database

The database seed script reads `content/curriculum.json` and parses markdown frontmatter, lessons, and 5-question quizzes idempotently:

```bash
# Run seed script inside backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed.py
```

---

## 📦 Building the 3 Lab Docker Sandbox Images

HACKFORGE orchestrates isolated Docker containers with strict resource quotas (512MB RAM, 0.5 CPU, internal network, 60-min TTL):

### 1. `hackforge/dvwa` (Damn Vulnerable Web App)
```dockerfile
# labs/dvwa/Dockerfile
FROM vulnerables/web-dvwa:latest
EXPOSE 80
CMD ["/main.sh"]
```
Build command:
```bash
docker build -t hackforge/dvwa labs/dvwa/
```

### 2. `hackforge/metasploitable2`
```dockerfile
# labs/metasploitable2/Dockerfile
FROM tleemcjr/metasploitable2:latest
EXPOSE 21 22 23 25 80 139 445 3306
CMD ["/bin/bash"]
```
Build command:
```bash
docker build -t hackforge/metasploitable2 labs/metasploitable2/
```

### 3. `hackforge/juice-shop` (OWASP Modern Single-Page App Vulns)
```dockerfile
# labs/juice-shop/Dockerfile
FROM bkimminich/juice-shop:latest
EXPOSE 3000
```
Build command:
```bash
docker build -t hackforge/juice-shop labs/juice-shop/
```

---

## 💳 Lemon Squeezy Webhook Integration

HACKFORGE gates Parts 3 and 4 (`is_pro = true`). When a user purchases a Pro pass on Lemon Squeezy, the webhook automatically activates their account:

### Webhook Endpoint: `POST /api/v1/auth/webhook/lemonsqueezy`

```python
import hmac
import hashlib
from fastapi import APIRouter, Request, Header, HTTPException

router = APIRouter()

@router.post("/webhook/lemonsqueezy")
async def lemon_squeezy_webhook(
    request: Request,
    x_signature: str = Header(None)
):
    body = await request.body()
    secret = "YOUR_LEMON_SQUEEZY_WEBHOOK_SECRET".encode("utf-8")
    expected_sig = hmac.new(secret, body, hashlib.sha256).hexdigest()
    
    if not hmac.compare_digest(expected_sig, x_signature or ""):
        raise HTTPException(status_code=400, detail="Invalid signature")
        
    data = await request.json()
    event_name = data.get("meta", {}).get("event_name")
    
    if event_name in ("order_created", "subscription_created"):
        user_email = data["data"]["attributes"]["user_email"]
        # Upgrade user in DB:
        # await db.execute(update(User).where(User.email == user_email).values(is_pro=True))
        
    return {"status": "success"}
```

---

## ☁️ Deployment Guide

### 1. Database (Neon Serverless PostgreSQL)
1. Create a PostgreSQL project on [Neon.tech](https://neon.tech).
2. Copy the pooled connection string (`postgresql://user:pass@ep-...neon.tech/neondb?sslmode=require`).
3. Set `DATABASE_URL` in Railway / server environment variables (change protocol prefix to `postgresql+asyncpg://`).

### 2. Backend API (Railway)
1. Connect GitHub repository to [Railway.app](https://railway.app).
2. Set Root Directory to `/backend`.
3. Configure environment variables:
   - `DATABASE_URL`: Your Neon PostgreSQL async URL
   - `SECRET_KEY`: A secure 32+ character string
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: `60`
   - `GEMINI_API_KEY`: Google AI Studio Gemini API Key
4. Deploy!

### 3. Frontend (Vercel)
1. Import repository on [Vercel](https://vercel.com).
2. Set Build Command to `npm run build` and Output Directory to `dist`.
3. Set environment variable:
   - `VITE_API_URL`: Your Railway production backend URL (e.g. `https://api.hackforge.dev`).

### 4. Lab Containers (Hetzner VPS)
1. Deploy a Hetzner CPX31 (4 vCPU, 8GB RAM, ~$15/mo) running Ubuntu 24.04 LTS.
2. Install Docker & Nginx.
3. Proxy WebSocket connections to ttyd instances on `wss://labs.hackforge.dev/ws/{lesson_slug}`.

---

## ⏱️ The 10-Step "First Hour After Clone" Runbook

Follow this exact sequence immediately after cloning the repository to get the platform 100% operational:

1. **Clone & Enter Repo:**
   ```bash
   git clone https://github.com/chrishem/hackforge.git && cd hackforge
   ```
2. **Copy Environment Template:**
   ```bash
   cp .env.example .env
   ```
3. **Launch Infrastructure via Docker Compose:**
   ```bash
   docker compose up -d postgres
   ```
4. **Create Python Virtualenv for Backend:**
   ```bash
   cd backend && python3 -m venv venv && source venv/bin/activate
   ```
5. **Install Backend Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
6. **Execute Idempotent Database Seeding:**
   ```bash
   python seed.py
   ```
7. **Install Frontend Dependencies:**
   ```bash
   cd ../ && npm install
   ```
8. **Start Full Development Server:**
   ```bash
   npm run dev
   ```
9. **Create a local account:**
    - URL: http://localhost:3000
    - Register with a unique password or use the configured administrator bootstrap flow.
    - No shared seeded account is provided; never deploy demo credentials.
10. **Test Live Terminal & AI Mentor:**
    - Open **Module 7: Nmap Deep Dive**, launch the Lab Terminal, and run `nmap -sC -sV 192.168.56.102`.
    - Open the AI Mentor and ask: *"Explain how Kerberoasting extracts service tickets"*.
    - Complete the 5-question quiz to verify that the 80% passing gate unlocks completion!
