# InvoiceFlow — Modern Client Invoicing

Create, send, and track professional invoices for your clients with a modern dark UI.

## ✨ Features

- **Dashboard** — Overview of all invoices with stats (total, paid, outstanding, overdue) and search/filter
- **Create Invoices** — Full form with client info, dynamic line items, tax rate, due date, and notes
- **Invoice Detail** — View full invoice with line-item breakdown, tax calculation, and status badge
- **Status Tracking** — Draft → Sent → Paid lifecycle with color-coded badges
- **Search & Filter** — Find invoices by client name, status, or invoice number
- **Dark Theme** — Modern, premium dark UI with violet-to-cyan gradient accents

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom dark theme
- **State:** In-memory data store (swap to Prisma/Postgres for production)
- **Payments:** Stripe Checkout (configure via env vars)
- **Icons:** Lucide React

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in (all optional for local dev):

| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string (for production) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |

## Live Preview

The app is running at:
**https://3000-ibx7rki8278dy5lfpx5a4.e2b.app**

## GitHub

Repository: [github.com/Goatkenziee/invoicely](https://github.com/Goatkenziee/invoicely)

## Deploy to Vercel

1. Go to **Settings → Integrations → Vercel** and reconnect your Vercel account
2. Run the deploy command again, or connect the GitHub repo manually in Vercel
3. Set `DATABASE_URL` and `STRIPE_SECRET_KEY` in Vercel environment variables
