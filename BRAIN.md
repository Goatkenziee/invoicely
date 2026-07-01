# BRAIN.md

## What this app does
BUILD ME A APP FOR INVOCING CLEINTS MODERN TOCUH

## Current state
All three build issues from the last run have been fixed:
1. ✅ STRIPE_SECRET_KEY warning — set as an app secret via set_app_secret
2. ✅ TypeScript TS18047 error — fixed with optional chaining (`params?.id`) + early return guard in app/invoices/[id]/page.tsx
3. ✅ Stripe API version mismatch — updated to "2026-06-24.dahlia" matching the installed SDK v22.3.0
4. ✅ Empty middleware.ts deleted (not needed for this app)
Build verification pending sandbox availability.

## Tech stack and why
Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma (SQLite), Stripe SDK v22

## What has been built
- Full invoicing app: dashboard, create invoice, view invoice details, CRUD API
- Components: InvoiceDashboard, InvoiceForm, InvoicePreview, InvoiceCard, UI primitives
- Database layer with Prisma + SQLite
- Stripe integration (conditional on STRIPE_SECRET_KEY)
- All 37 files originally created, minus deleted middleware.ts (36 files)

## What's pending
- Sandbox build verification (sandbox currently unavailable)
- Production deployment to Vercel

## Fixes applied (this run)
1. app/invoices/[id]/page.tsx: Changed `params.id as string` to `params?.id as string | undefined` with `if (!id) return <NotFound />` guard — fixes TS18047
2. lib/stripe.ts: Updated apiVersion from "2024-06-20" to "2026-06-24.dahlia" — matches installed Stripe SDK v22.3.0
3. Set STRIPE_SECRET_KEY as managed app secret — resolves Vercel env var warning
4. Deleted empty middleware.ts — not needed for this app

## Run notes
- Last updated: 2026-07-01T04:55:00.000Z
- Autonomous iteration: 1
