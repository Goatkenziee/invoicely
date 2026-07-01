import { InvoiceDashboard } from "@/components/InvoiceDashboard";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="gradient-text">Professional Invoicing</span>
              <br />
              for Modern Businesses
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Create, send, and track invoices in seconds. Get paid faster with
              a clean, modern workflow designed for freelancers and small teams.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/invoices/new"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 px-8 text-sm font-medium text-white shadow-lg transition hover:from-violet-500 hover:to-cyan-500"
              >
                Create Your First Invoice
              </Link>
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-lg border px-8 text-sm font-medium transition hover:bg-secondary"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500/10">
                <svg className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Smart Invoices</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Dynamic line items, auto-calculated totals, and tax rates. Create
                professional invoices in minutes.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10">
                <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Real-time Dashboard</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Track total invoiced, paid, outstanding, and overdue amounts at a
                glance with live stats.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500/10">
                <svg className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Status Tracking</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Move invoices through Draft → Sent → Paid lifecycle with
                color-coded status badges.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10">
                <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Client Management</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Store client details, track invoice history, and keep all your
                business relationships organized.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500/10">
                <svg className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Payment Ready</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Stripe integration ready. Connect your account to accept payments
                directly from invoices.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10">
                <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Auto Numbering</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Sequential invoice numbers (INV-001, INV-002) generated
                automatically so you never miss a beat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Your Invoices</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of all your invoices and their current status.
          </p>
        </div>
        <InvoiceDashboard />
      </section>
    </main>
  );
}
