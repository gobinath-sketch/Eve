# Deployment Guide

## Local Setup

1. Install PostgreSQL and PG Admin 4.
2. Create or use the `postgres` database.
3. Run `database/schema.sql` in PG Admin Query Tool.
4. Install dependencies from the project root:

```bash
npm install
```

5. Start development servers:

```bash
npm run dev
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:4000/api`

## Environment

Backend secrets are stored in `apps/backend/.env`.

Frontend public settings are stored in `apps/frontend/.env.local`.

Never move SMTP password, Razorpay secret, database URL, JWT secret, or admin password into frontend code.

## Production Build

```bash
npm run build
npm run start
```

## Production Notes

- Replace `JWT_SECRET` and `ADMIN_PASSWORD` before launch.
- Replace Razorpay test keys with live keys when ready.
- Use HTTPS.
- Set `FRONTEND_URL` to the production frontend URL.
- Keep `synchronize:false`; apply schema changes through SQL migrations.
- Use a managed PostgreSQL backup policy.
- Configure Gmail SMTP with an app password or a production transactional email provider.
