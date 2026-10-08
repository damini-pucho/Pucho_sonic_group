-- db/schema.sql — GENERATED from os.yaml by pucho-os (2026-10-08). Idempotent: apply, then apply again.
-- Entity tables are named after os.yaml entities; columns are the declared names in lower case.

-- db/base.sql — the tables every Pucho OS has, whatever os.yaml says: people, sessions, one-time codes, files, jobs.
-- Idempotent (standards §5): safe to apply twice. Entity tables follow in db/schema.sql, generated from os.yaml.
-- Roles (§19.1 least privilege) are created by scripts/db.mjs migrate when the connected user may create roles —
-- `app` (DML on every table), `studio_reader` (SELECT on entity tables only — never users, sessions, otp_codes, files).

CREATE TABLE IF NOT EXISTS users (
  id              text PRIMARY KEY,
  email           text NOT NULL UNIQUE,
  name            text NOT NULL,
  role            text NOT NULL,
  password_hash   text,                       -- $argon2id$… or NULL until the person sets one (one-time code sign-in still works)
  must_change_password boolean NOT NULL DEFAULT false,
  is_active       boolean NOT NULL DEFAULT true,
  deactivated_at  timestamptz,
  deactivated_by  text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash      text PRIMARY KEY,           -- SHA-256 of the opaque cookie token; the token itself is never stored
  user_id         text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at      timestamptz NOT NULL DEFAULT now(),
  last_seen_at    timestamptz NOT NULL DEFAULT now(),
  expires_at      timestamptz NOT NULL,
  user_agent      text
);
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);

CREATE TABLE IF NOT EXISTS otp_codes (
  email           text NOT NULL,
  code_hash       text NOT NULL,              -- HMAC-SHA256(code, AUTH_PEPPER)
  expires_at      timestamptz NOT NULL,
  attempts        integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (email)
);

CREATE TABLE IF NOT EXISTS files (                -- uploads live in the database (D6), under the plan's storage cap
  id              text PRIMARY KEY,
  name            text NOT NULL,
  mime            text NOT NULL,
  size            bigint NOT NULL,
  data            bytea NOT NULL,
  entity          text,
  record_id       text,
  uploaded_by     text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS jobs (                 -- a flow that runs longer than the sync window (async: true) is tracked here
  id              text PRIMARY KEY,
  flow            text NOT NULL,
  action          text NOT NULL,
  status          text NOT NULL DEFAULT 'queued', -- queued · done · failed
  payload         jsonb,
  result          jsonb,
  requested_by    text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  finished_at     timestamptz
);

CREATE TABLE IF NOT EXISTS signin_attempts (      -- sign-in rate limit per account and per address (§19.2)
  key             text PRIMARY KEY,
  count           integer NOT NULL DEFAULT 0,
  window_start    timestamptz NOT NULL DEFAULT now()
);

-- ALTERs below every CREATE (§5): a column added after the first release lands here, never above its table.


CREATE TABLE IF NOT EXISTS "bills" (
  "bill_id" text PRIMARY KEY,
  "uploaded_at" timestamptz,
  "centre" text,
  "centre_coordinator" text,
  "bill_photo" text,
  "vendor_name" text,
  "vendor_gstin" text,
  "bill_no" text,
  "bill_date" date,
  "taxable_value" numeric,
  "gst_rate" numeric,
  "cgst" numeric,
  "sgst" numeric,
  "igst" numeric,
  "total_amount" numeric,
  "narration" text,
  "tally_ledger" text,
  "expense_head" text,
  "ai_confidence" numeric,
  "status" text,
  "query_from" text,
  "query_remarks" text,
  "query_reply" text,
  "accounts_remarks" text,
  "exported_at" timestamptz,
  _seq bigserial
);
CREATE INDEX IF NOT EXISTS "bills_status_idx" ON "bills" ("status");
CREATE INDEX IF NOT EXISTS "bills_uploaded_at_idx" ON "bills" ("uploaded_at");

CREATE TABLE IF NOT EXISTS "vendor_ledgers" (
  "map_id" text PRIMARY KEY,
  "vendor_name" text,
  "vendor_gstin" text,
  "city" text,
  "tally_ledger" text,
  "expense_head" text,
  "status" text,
  _seq bigserial
);
CREATE INDEX IF NOT EXISTS "vendor_ledgers_status_idx" ON "vendor_ledgers" ("status");

CREATE TABLE IF NOT EXISTS "centres" (
  "centre_id" text PRIMARY KEY,
  "centre_name" text,
  "city" text,
  "state" text,
  "coordinator" text,
  "phone" text,
  "status" text,
  _seq bigserial
);
CREATE INDEX IF NOT EXISTS "centres_status_idx" ON "centres" ("status");

CREATE TABLE IF NOT EXISTS "agreements" (
  "agreement_id" text PRIMARY KEY,
  "created_at" timestamptz,
  "tenant_name" text,
  "tenant_gstin" text,
  "tenant_state" text,
  "centre" text,
  "unit" text,
  "agreement_type" text,
  "start_date" date,
  "end_date" date,
  "monthly_amount" numeric,
  "gst_rate" numeric,
  "gst_amount" numeric,
  "monthly_total" numeric,
  "due_day" numeric,
  "next_due_date" date,
  "tenant_ledger" text,
  "income_head" text,
  "invoice_status" text,
  "status" text,
  _seq bigserial
);
CREATE INDEX IF NOT EXISTS "agreements_status_idx" ON "agreements" ("status");
CREATE INDEX IF NOT EXISTS "agreements_created_at_idx" ON "agreements" ("created_at");

CREATE TABLE IF NOT EXISTS "sales_invoices" (
  "invoice_id" text PRIMARY KEY,
  "prepared_at" timestamptz,
  "agreement_id" text,
  "tenant_name" text,
  "tenant_state" text,
  "centre" text,
  "period" text,
  "due_date" date,
  "taxable_value" numeric,
  "gst_rate" numeric,
  "gst_amount" numeric,
  "total_amount" numeric,
  "tenant_ledger" text,
  "income_head" text,
  "narration" text,
  "status" text,
  "exported_at" timestamptz,
  _seq bigserial
);
CREATE INDEX IF NOT EXISTS "sales_invoices_status_idx" ON "sales_invoices" ("status");
CREATE INDEX IF NOT EXISTS "sales_invoices_prepared_at_idx" ON "sales_invoices" ("prepared_at");

CREATE TABLE IF NOT EXISTS "audit_log" (
  "audit_id" text PRIMARY KEY,
  "at" timestamptz,
  "who" text,
  "flow" text,
  "action" text,
  "entity" text,
  "record_id" text,
  "summary" text,
  _seq bigserial
);
CREATE INDEX IF NOT EXISTS "audit_log_at_idx" ON "audit_log" ("at");

-- ── migrations: every ALTER below every CREATE (§5). A column added to os.yaml after go-live is added here on re-apply;
-- a renamed or removed column is a docs/migrations/<date>.md step (diff_os.py), never done silently.
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "uploaded_at" timestamptz;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "centre" text;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "centre_coordinator" text;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "bill_photo" text;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "vendor_name" text;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "vendor_gstin" text;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "bill_no" text;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "bill_date" date;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "taxable_value" numeric;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "gst_rate" numeric;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "cgst" numeric;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "sgst" numeric;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "igst" numeric;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "total_amount" numeric;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "narration" text;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "tally_ledger" text;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "expense_head" text;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "ai_confidence" numeric;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "status" text;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "query_from" text;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "query_remarks" text;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "query_reply" text;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "accounts_remarks" text;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS "exported_at" timestamptz;
ALTER TABLE "bills" ADD COLUMN IF NOT EXISTS _seq bigserial;
ALTER TABLE "vendor_ledgers" ADD COLUMN IF NOT EXISTS "vendor_name" text;
ALTER TABLE "vendor_ledgers" ADD COLUMN IF NOT EXISTS "vendor_gstin" text;
ALTER TABLE "vendor_ledgers" ADD COLUMN IF NOT EXISTS "city" text;
ALTER TABLE "vendor_ledgers" ADD COLUMN IF NOT EXISTS "tally_ledger" text;
ALTER TABLE "vendor_ledgers" ADD COLUMN IF NOT EXISTS "expense_head" text;
ALTER TABLE "vendor_ledgers" ADD COLUMN IF NOT EXISTS "status" text;
ALTER TABLE "vendor_ledgers" ADD COLUMN IF NOT EXISTS _seq bigserial;
ALTER TABLE "centres" ADD COLUMN IF NOT EXISTS "centre_name" text;
ALTER TABLE "centres" ADD COLUMN IF NOT EXISTS "city" text;
ALTER TABLE "centres" ADD COLUMN IF NOT EXISTS "state" text;
ALTER TABLE "centres" ADD COLUMN IF NOT EXISTS "coordinator" text;
ALTER TABLE "centres" ADD COLUMN IF NOT EXISTS "phone" text;
ALTER TABLE "centres" ADD COLUMN IF NOT EXISTS "status" text;
ALTER TABLE "centres" ADD COLUMN IF NOT EXISTS _seq bigserial;
ALTER TABLE "agreements" ADD COLUMN IF NOT EXISTS "created_at" timestamptz;
ALTER TABLE "agreements" ADD COLUMN IF NOT EXISTS "tenant_name" text;
ALTER TABLE "agreements" ADD COLUMN IF NOT EXISTS "tenant_gstin" text;
ALTER TABLE "agreements" ADD COLUMN IF NOT EXISTS "tenant_state" text;
ALTER TABLE "agreements" ADD COLUMN IF NOT EXISTS "centre" text;
ALTER TABLE "agreements" ADD COLUMN IF NOT EXISTS "unit" text;
ALTER TABLE "agreements" ADD COLUMN IF NOT EXISTS "agreement_type" text;
ALTER TABLE "agreements" ADD COLUMN IF NOT EXISTS "start_date" date;
ALTER TABLE "agreements" ADD COLUMN IF NOT EXISTS "end_date" date;
ALTER TABLE "agreements" ADD COLUMN IF NOT EXISTS "monthly_amount" numeric;
ALTER TABLE "agreements" ADD COLUMN IF NOT EXISTS "gst_rate" numeric;
ALTER TABLE "agreements" ADD COLUMN IF NOT EXISTS "gst_amount" numeric;
ALTER TABLE "agreements" ADD COLUMN IF NOT EXISTS "monthly_total" numeric;
ALTER TABLE "agreements" ADD COLUMN IF NOT EXISTS "due_day" numeric;
ALTER TABLE "agreements" ADD COLUMN IF NOT EXISTS "next_due_date" date;
ALTER TABLE "agreements" ADD COLUMN IF NOT EXISTS "tenant_ledger" text;
ALTER TABLE "agreements" ADD COLUMN IF NOT EXISTS "income_head" text;
ALTER TABLE "agreements" ADD COLUMN IF NOT EXISTS "invoice_status" text;
ALTER TABLE "agreements" ADD COLUMN IF NOT EXISTS "status" text;
ALTER TABLE "agreements" ADD COLUMN IF NOT EXISTS _seq bigserial;
ALTER TABLE "sales_invoices" ADD COLUMN IF NOT EXISTS "prepared_at" timestamptz;
ALTER TABLE "sales_invoices" ADD COLUMN IF NOT EXISTS "agreement_id" text;
ALTER TABLE "sales_invoices" ADD COLUMN IF NOT EXISTS "tenant_name" text;
ALTER TABLE "sales_invoices" ADD COLUMN IF NOT EXISTS "tenant_state" text;
ALTER TABLE "sales_invoices" ADD COLUMN IF NOT EXISTS "centre" text;
ALTER TABLE "sales_invoices" ADD COLUMN IF NOT EXISTS "period" text;
ALTER TABLE "sales_invoices" ADD COLUMN IF NOT EXISTS "due_date" date;
ALTER TABLE "sales_invoices" ADD COLUMN IF NOT EXISTS "taxable_value" numeric;
ALTER TABLE "sales_invoices" ADD COLUMN IF NOT EXISTS "gst_rate" numeric;
ALTER TABLE "sales_invoices" ADD COLUMN IF NOT EXISTS "gst_amount" numeric;
ALTER TABLE "sales_invoices" ADD COLUMN IF NOT EXISTS "total_amount" numeric;
ALTER TABLE "sales_invoices" ADD COLUMN IF NOT EXISTS "tenant_ledger" text;
ALTER TABLE "sales_invoices" ADD COLUMN IF NOT EXISTS "income_head" text;
ALTER TABLE "sales_invoices" ADD COLUMN IF NOT EXISTS "narration" text;
ALTER TABLE "sales_invoices" ADD COLUMN IF NOT EXISTS "status" text;
ALTER TABLE "sales_invoices" ADD COLUMN IF NOT EXISTS "exported_at" timestamptz;
ALTER TABLE "sales_invoices" ADD COLUMN IF NOT EXISTS _seq bigserial;
ALTER TABLE "audit_log" ADD COLUMN IF NOT EXISTS "at" timestamptz;
ALTER TABLE "audit_log" ADD COLUMN IF NOT EXISTS "who" text;
ALTER TABLE "audit_log" ADD COLUMN IF NOT EXISTS "flow" text;
ALTER TABLE "audit_log" ADD COLUMN IF NOT EXISTS "action" text;
ALTER TABLE "audit_log" ADD COLUMN IF NOT EXISTS "entity" text;
ALTER TABLE "audit_log" ADD COLUMN IF NOT EXISTS "record_id" text;
ALTER TABLE "audit_log" ADD COLUMN IF NOT EXISTS "summary" text;
ALTER TABLE "audit_log" ADD COLUMN IF NOT EXISTS _seq bigserial;
