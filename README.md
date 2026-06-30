# InvoiceFlow — Modern Client Invoicing

Create, send, and track professional invoices for your clients with a modern dark UI.

## ✨ Features

- **Dashboard** — Overview of all invoices with stats (total, paid, outstanding, overdue)
- **Create Invoices** — Multi-step form with client info, line items, tax rate, and notes
- **Invoice Detail** — View full invoice with Stripe payment link integration
- **Status Tracking** — Draft → Sent → Paid lifecycle with visual badges
- **Search & Filter** — Find invoices by client name, status, or invoice number
- **Dark Theme** — Modern, premium dark UI built with Tailwind CSS

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

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | No | Clerk auth (optional for now) |
| `CLERK_SECRET_KEY` | No | Clerk auth secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Stripe publishable key |
| `STRIPE_SECRET_KEY` | No | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook secret |
| `DATABASE_URL` | No | Postgres connection string (for production) |

## Deploy

The app is ready to deploy on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Goatkenziee/invoicely)

## GitHub

Repository: [github.com/Goatkenziee/invoicely](https://github.com/Goatkenziee/invoicely)
