CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug varchar UNIQUE NOT NULL,
  name varchar NOT NULL,
  mode varchar NOT NULL DEFAULT 'offline',
  fee_amount integer NOT NULL DEFAULT 20000,
  currency varchar NOT NULL DEFAULT 'INR',
  venue varchar,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name varchar NOT NULL,
  gender varchar NOT NULL,
  date_of_birth date NOT NULL,
  age integer NOT NULL,
  email varchar NOT NULL,
  mobile_number varchar NOT NULL,
  whatsapp_number varchar NOT NULL,
  country varchar NOT NULL,
  state varchar NOT NULL,
  city varchar NOT NULL,
  address varchar NOT NULL,
  pincode varchar NOT NULL,
  qualification varchar NOT NULL,
  college varchar NOT NULL,
  department varchar NOT NULL,
  graduation_year integer NOT NULL,
  current_status varchar NOT NULL,
  company varchar NOT NULL,
  designation varchar NOT NULL,
  experience varchar NOT NULL,
  linked_in_url varchar,
  github_url varchar,
  portfolio_url varchar,
  emergency_contact_name varchar NOT NULL,
  emergency_contact_relationship varchar NOT NULL,
  emergency_contact_phone varchar NOT NULL,
  browser_info jsonb NOT NULL DEFAULT '{}',
  ip_address varchar,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_code varchar UNIQUE NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id),
  event_id uuid REFERENCES events(id),
  attending_reason text NOT NULL,
  expectations text NOT NULL,
  ai_experience_level varchar NOT NULL,
  status varchar NOT NULL DEFAULT 'draft',
  terms_accepted boolean NOT NULL DEFAULT false,
  privacy_accepted boolean NOT NULL DEFAULT false,
  paid_at timestamptz,
  ip_address varchar,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id uuid NOT NULL REFERENCES registrations(id),
  amount integer NOT NULL,
  currency varchar NOT NULL DEFAULT 'INR',
  razorpay_order_id varchar,
  razorpay_payment_id varchar,
  razorpay_signature varchar,
  transaction_id varchar,
  status varchar NOT NULL DEFAULT 'created',
  raw_payload jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS event_passes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id uuid UNIQUE NOT NULL REFERENCES registrations(id),
  pass_code varchar UNIQUE NOT NULL,
  status varchar NOT NULL DEFAULT 'active',
  pass_data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient varchar NOT NULL,
  subject varchar NOT NULL,
  template varchar NOT NULL,
  status varchar NOT NULL DEFAULT 'queued',
  provider_message_id varchar,
  error text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar NOT NULL,
  email varchar NOT NULL,
  phone varchar NOT NULL,
  message text NOT NULL,
  status varchar NOT NULL DEFAULT 'new',
  ip_address varchar,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email varchar UNIQUE NOT NULL,
  password_hash varchar NOT NULL,
  role varchar NOT NULL DEFAULT 'admin',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_type varchar NOT NULL,
  actor_id varchar,
  action varchar NOT NULL,
  entity_type varchar NOT NULL,
  entity_id varchar,
  metadata jsonb NOT NULL DEFAULT '{}',
  ip_address varchar,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS login_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email varchar NOT NULL,
  success boolean NOT NULL DEFAULT false,
  ip_address varchar,
  browser_info jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key varchar UNIQUE NOT NULL,
  value jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id uuid NOT NULL REFERENCES registrations(id),
  status varchar NOT NULL DEFAULT 'not_checked_in',
  checked_in_at timestamptz,
  checked_in_by varchar,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO events (slug, name, mode, fee_amount, currency)
VALUES ('zenovate-ai-builders-summit', 'Zenovate AI Builders Summit', 'offline', 20000, 'INR')
ON CONFLICT (slug) DO NOTHING;
