# API Documentation

Base URL: `http://localhost:4000/api`

## Public

`POST /registrations/draft`

Creates a draft registration after validating all personal, location, education, professional, social, event, emergency, and consent fields.

`POST /payments/order`

Body: `{ "registrationId": "uuid" }`

Creates a Razorpay order for exactly `20000` paise.

`POST /payments/verify`

Body: `{ "registrationId": "...", "razorpayOrderId": "...", "razorpayPaymentId": "...", "razorpaySignature": "..." }`

Verifies Razorpay HMAC signature, stores payment, confirms registration, generates event pass, and sends email.

`GET /registrations/:id/success`

Returns the event pass success data.

`POST /contact`

Stores contact form messages.

## Admin

`POST /admin/login`

Returns a JWT bearer token.

`GET /admin/dashboard`

Returns registration count, paid payment count, revenue, and attendance summary.

`GET /admin/registrations`

Returns registrations with user and payment status.

`GET /admin/export/csv`

Exports registration rows as CSV.
