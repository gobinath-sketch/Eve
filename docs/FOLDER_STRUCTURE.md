# Folder Structure

```text
apps/
  frontend/
    app/              Next.js App Router pages
    components/       Shared UI components
    lib/              API client, constants, validation
  backend/
    src/
      admin/          Dashboard, login, exports
      auth/           JWT strategy and guard
      contact/        Contact message API
      database/       TypeORM entities
      email/          Nodemailer service and email logs
      payments/       Razorpay order and verification
      registrations/  Draft registration and success APIs
database/
  schema.sql          PostgreSQL schema for PG Admin
docs/
  API.md
  DEPLOYMENT.md
  FOLDER_STRUCTURE.md
```
