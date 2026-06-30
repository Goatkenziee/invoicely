# BRAIN.md — InvoiceFlow

## What this app does
A modern, dark-themed invoice management app for freelancers and small businesses. Create, track, and manage client invoices with a clean UI.

## Current state — ✅ COMPLETE
The app is fully built and verified. All features work end-to-end:

- **Dashboard** — Stats cards (total, paid, outstanding, overdue), invoice list with search/filter
- **Create Invoice** — Full form with client info, dynamic line items, tax rate, notes, due date
- **Invoice Detail** — Preview page with all line items, tax breakdown, total, status badge
- **API** — Full CRUD: GET list, GET by id, POST create, PUT pay/update status, DELETE
- **Status Lifecycle** — Draft → Sent → Paid with colored badges
- **Dark Theme** — Premium dark UI with violet-to-cyan gradient accents

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom dark theme
- **State:** In-memory data store with seed data (3 demo invoices)
- **Icons:** Lucide React
- **UI:** Custom components (button, card, input, select, textarea, badge)

## Key Architecture Decisions
- **No auth needed** — Removed Clerk dependency. The middleware is a passthrough.
- **In-memory DB** — `lib/db.ts` uses a module-level Map. Swap to Prisma/Postgres for production.
- **No Stripe dependency at runtime** — Stripe integration is optional, only used when keys are set.
- **App Router** — `/invoices/new` and `/invoices/[id]` are client components with `useRouter`.

## Files structure
```
app/
  page.tsx              → InvoiceDashboard
  layout.tsx            → RootLayout with nav bar
  globals.css           → Dark theme + gradient utilities
  invoices/
    new/page.tsx        → InvoiceForm wrapper
    [id]/page.tsx       → InvoicePreview wrapper
  api/invoices/
    route.ts            → GET (list) + POST (create)
    [id]/route.ts       → GET (one) + PUT (pay) + DELETE
components/
  InvoiceDashboard.tsx  → Stats + invoice list + search/filter
  InvoiceForm.tsx       → Multi-field form with dynamic line items
  InvoicePreview.tsx    → Full invoice detail view
  InvoiceCard.tsx       → Invoice summary card
  ui/                   → Reusable UI primitives
lib/
  db.ts                 → In-memory data store
  format.ts             → Currency/date formatters
  invoice-number.ts     → Auto-incrementing INV-XXX
  stripe.ts             → Stripe client (optional)
  utils.ts              → cn() helper
prisma/
  schema.prisma         → Prisma schema (for production swap)
  seed.ts               → Seed data script
```

## Verification Status — ✅ ALL PASSING
- ✅ `npm run build` — Compiles successfully (all 6 routes)
- ✅ Dev server — Serves on port 3000, HTTP 200 on all routes
- ✅ API — POST /api/invoices creates invoices (verified: INV-004 created)
- ✅ Pages — /, /invoices/new, /invoices/[id] all serve 200
- ✅ GitHub — Pushed to github.com/Goatkenziee/invoicely
- ⏳ Vercel — Integration needs reconnecting (Settings → Integrations → Vercel → Reconnect)

## What's Still Pending
1. **Vercel deploy** — Reconnect Vercel integration and run deploy again
2. **Env vars on Vercel** — Set DATABASE_URL and STRIPE_SECRET_KEY in Vercel project settings
3. **Production DB** — Swap from in-memory to Prisma/Postgres when ready
