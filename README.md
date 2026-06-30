# Invoicely — Smart Invoicing

Create, send, and collect payments on invoices — all in one place.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Auth:** Clerk
- **Database:** Neon Postgres + Prisma
- **Payments:** Stripe
- **Styling:** Tailwind CSS

## Getting Started

```bash
npm install
cp .env.example .env.local
# Fill in Clerk, Stripe, and DATABASE_URL
npm run db:push
npm run dev
```
