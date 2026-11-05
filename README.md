# Lauture Global LTD

**Visit • Relocate • Invest • Thrive**

Official website for Lauture Global LTD — a premium exploration, relocation, and investment consulting company based in Kigali, Rwanda.

## Tech Stack

- **Framework:** Vite + React + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database & Auth:** Supabase (your own project)
- **Booking:** Cal.com (client dashboard only)
- **Deployment:** Vercel

## Client Journey

1. Browse packages on the website and complete the intake form
2. Create a client portal account with the same email
3. Book consultations and track progress from `/dashboard`

## Getting Started

```bash
npm install
cp .env.example .env   # add your Supabase credentials
npm run dev            # http://localhost:8080
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon/public key |
| `VITE_CAL_ORIGIN` | No | Cal.com origin (default: `https://cal.com`) |
| `VITE_CAL_EMBED_JS_URL` | No | Embed script URL |

### Payments (Pesapal) — server-only, set in Vercel

| Variable | Required | Description |
|----------|----------|-------------|
| `PESAPAL_ENV` | Yes | `sandbox` or `live` |
| `PESAPAL_CONSUMER_KEY` / `PESAPAL_CONSUMER_SECRET` | Yes | Pesapal API 3.0 credentials |
| `PESAPAL_IPN_ID` | Yes | IPN ID registered with Pesapal for `https://<your-site>/api/pesapal-ipn` |
| `SITE_URL` | Yes | Public site URL, used for Pesapal callback/cancel URLs |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Yes | Used by `/api` to record transactions (never expose to the browser) |
| `RESEND_API_KEY` / `RESEND_FROM` / `RESEND_REPLY_TO` | For email | Automated emails (see below) |
| `TEAM_NOTIFY_EMAIL` | For email | Inbox for new-enquiry and payment alerts (default `info@lautureglobal.com`) |
| `NOTIFY_WEBHOOK_SECRET` | For email | Shared secret for the Supabase webhooks that call `/api/notify` |

Payment flow: `/api/pesapal-create-order` records a pending transaction and redirects to Pesapal; Pesapal calls `/api/pesapal-ipn`, and `/payment-success` polls `/api/pesapal-status`. Both re-check the status with Pesapal before updating `public.transactions`.

## Automated Emails

| Email | To | Trigger |
|-------|----|---------|
| Request received + next steps | Client | Intake form submitted (`clients` INSERT webhook) |
| New enquiry alert | Team | Intake form submitted (`clients` INSERT webhook) |
| New document in portal | Client | Admin uploads a document (`documents` INSERT webhook) |
| Payment confirmed | Client + team | Pesapal confirms payment (`server/pesapal.ts`) |

Booking confirmations and reminders are sent by Cal.com (enable reminders in Cal.com Workflows).
Templates live in `server/email.ts`; every attempt is logged in **Admin → Notifications** as sent, failed or skipped.

**Setup**
1. **Resend:** add and verify the `lautureglobal.com` domain (add the SPF/DKIM DNS records Resend shows, plus a DMARC record such as `v=DMARC1; p=none; rua=mailto:info@lautureglobal.com`). Create an API key.
2. **Vercel env vars:** `RESEND_API_KEY`, `RESEND_FROM` (an address on the verified domain), `RESEND_REPLY_TO`, `TEAM_NOTIFY_EMAIL`, `NOTIFY_WEBHOOK_SECRET` (generate a long random string), then redeploy.
3. **Supabase → Database → Webhooks:** create two webhooks, both *HTTP Request*, method `POST`, URL `https://www.lautureglobal.com/api/notify`, with HTTP header `x-webhook-secret: <NOTIFY_WEBHOOK_SECRET>`:
   - table `clients`, event **Insert**
   - table `documents`, event **Insert**
4. **Test:** submit the intake form with your own email, then check your inbox and Admin → Notifications.

## Supabase Setup

Run all migrations in `supabase/migrations/` against your Supabase project. New sign-ups are always created as `client`; promote staff to admin by hand (and again after applying `20261105120000_fix_admin_escalation_and_transactions_rls.sql`, which demotes all existing admins):

```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Run tests |
| `npm run lint` | ESLint |
