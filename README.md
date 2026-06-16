# Code with Zen — Event Registration Platform

Full-stack event registration platform for offline AI events. Built with **Next.js 15**, **NestJS**, **PostgreSQL**, **Razorpay**, and **Nodemailer**.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Framer Motion, React Hook Form, Zod |
| Backend | NestJS, TypeORM, JWT, Nodemailer, Razorpay |
| Database | PostgreSQL (pgAdmin 4) |

## Prerequisites

- Node.js 18+
- PostgreSQL running locally
- pgAdmin 4 (optional, for DB management)
- Razorpay test/live keys
- Gmail SMTP app password

## Database Setup

1. Open pgAdmin 4 and create a database named `learnai`
2. Or run: `CREATE DATABASE learnai;`

## Environment Setup

### Backend (`backend/.env`)

Copy from `backend/.env.example` and fill in your values:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/learnai
PORT=4000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
REGISTRATION_FEE_PAISE=20000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
ADMIN_EMAIL=admin@codewithzen.com
ADMIN_PASSWORD=Admin@123456
```

### Frontend (`frontend/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
NEXT_PUBLIC_EVENT_NAME=Code with Zen
```

## Running Locally

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run seed        # Seed admin + default event
npm run start:dev   # http://localhost:4000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev         # http://localhost:3000
```

## API Documentation

Swagger docs available at: **http://localhost:4000/api/docs**

## Admin Panel

- URL: http://localhost:3000/admin
- Default credentials (after seed): `admin@codewithzen.com` / `Admin@123456`

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, topics, register CTA |
| `/about` | What you'll learn |
| `/agenda` | Event schedule |
| `/speakers` | Speaker profiles |
| `/contact` | Contact form + social links |
| `/register` | 6-step registration wizard + Razorpay |
| `/register/success` | Confirmation + downloadable event pass |
| `/privacy` | Privacy policy |
| `/terms` | Terms & conditions |
| `/refund` | Refund policy (no refunds) |
| `/admin` | Admin login + dashboard |

## Registration Flow

1. User completes 6-step wizard (all fields required before payment)
2. Draft registration saved to PostgreSQL
3. Razorpay order created (₹200 / 20000 paise)
4. Payment verified server-side via HMAC signature
5. Event pass generated with QR code
6. Confirmation email sent via Nodemailer

## Production Build

```bash
# Backend
cd backend
npm run build
NODE_ENV=production npm run start:prod

# Frontend
cd frontend
npm run build
npm start
```

## Security Notes

- Never commit `.env` files
- Razorpay secret key stays on backend only
- SMTP credentials backend only
- Rotate JWT secret and admin password before production
- Set `NODE_ENV=production` to disable TypeORM synchronize

## Project Structure

```
learnai/
├── frontend/     # Next.js App Router
├── backend/      # NestJS API
├── .gitignore
└── README.md
```
