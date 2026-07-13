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

## Supabase Setup

Run all migrations in `supabase/migrations/` against your Supabase project, then promote an admin user:

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
