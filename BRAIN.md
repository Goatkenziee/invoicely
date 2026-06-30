# Invoicely — Architecture & Plan

## Stack
- Next.js 14 App Router + TypeScript
- Clerk for authentication
- Prisma + Neon Postgres for data
- Stripe for payments
- Tailwind CSS for styling

## Database Models
- **Business** — one per user, stores company info
- **Client** — belongs to a business, has name/email/address
- **Invoice** — belongs to business + client, has items, status, totals
- **InvoiceItem** — line items on an invoice
- **Payment** — payment records linked to invoices

## Route Structure
- `/` — Landing page (public)
- `/sign-in`, `/sign-up` — Auth (Clerk)
- `/dashboard` — Main app (protected)
- `/dashboard/invoices` — Invoice list
- `/dashboard/invoices/new` — Create invoice
- `/dashboard/invoices/[id]` — Invoice detail
- `/invoice/[id]` — Public client view

## API Routes
- `POST /api/client` — Create client
- `GET/PUT/DELETE /api/invoice/[id]` — Invoice CRUD
- `POST /api/invoice` — Create invoice
- `POST /api/invoice/[id]/send` — Mark as sent
- `POST /api/invoice/[id]/mark-paid` — Mark as paid
- `POST /api/stripe/create-checkout` — Stripe checkout
