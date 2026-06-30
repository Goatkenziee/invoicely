"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FileText,
  Send,
  CreditCard,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Beautiful Invoices",
    desc: "Create stunning, professional invoices in seconds. Customize with your brand colors and logo.",
  },
  {
    icon: Send,
    title: "Instant Delivery",
    desc: "Email invoices directly to your clients with a click. They get a polished view and payment link.",
  },
  {
    icon: CreditCard,
    title: "Get Paid Faster",
    desc: "Accept credit card payments via Stripe right from the invoice. No more chasing checks.",
  },
  {
    icon: BarChart3,
    title: "Real-time Dashboard",
    desc: "See who's paid, who hasn't, and track your revenue at a glance with live analytics.",
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    desc: "Enterprise-grade security with Clerk auth and Stripe's PCI-compliant payment processing.",
  },
  {
    icon: Zap,
    title: "Automated Reminders",
    desc: "Set it and forget it. Automatic payment reminders keep your cash flow healthy.",
  },
];

const steps = [
  { num: "01", title: "Create an Invoice", desc: "Fill in client details, add line items, set your rate." },
  { num: "02", title: "Send to Client", desc: "Delivered as a beautiful branded page with a payment button." },
  { num: "03", title: "Get Paid", desc: "Client pays via Stripe. Funds land in your account within days." },
];

const stats = [
  { value: "$2.4B+", label: "Invoices Processed" },
  { value: "50K+", label: "Active Businesses" },
  { value: "98.7%", label: "Payment Success Rate" },
  { value: "4.8★", label: "Average Rating" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">Invoicely</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition hover:text-foreground">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground transition hover:text-foreground">How It Works</a>
            <a href="#pricing" className="text-sm text-muted-foreground transition hover:text-foreground">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-primary" />
            The smartest way to invoice your clients
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Invoicing that{" "}
            <span className="gradient-text">actually gets you paid</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Create, send, and collect payments on invoices — all in one place.
            No more PDF attachments, no more "the check is in the mail."
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button className="h-13 gap-2 px-8 text-base">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" className="h-13 px-8 text-base">
                See How It Works
              </Button>
            </Link>
          </div>
          <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-400" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-400" /> 14-day free trial</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-400" /> Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold gradient-text">{s.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold">Everything you need to get paid</h2>
            <p className="mt-4 text-muted-foreground">
              From creation to collection — Invoicely handles the whole workflow.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="group p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-y py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold">Three steps to get paid</h2>
            <p className="mt-4 text-muted-foreground">It&apos;s simpler than you think.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.num} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                  {s.num}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
            <p className="mt-4 text-muted-foreground">Start free. Upgrade when you grow.</p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            <Card className="p-8">
              <h3 className="text-xl font-bold">Starter</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {["Up to 5 invoices/month", "1 business profile", "Email delivery", "Stripe payments"].map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" /> {i}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up">
                <Button className="mt-8 w-full">Get Started Free</Button>
              </Link>
            </Card>
            <Card className="relative border-primary/50 p-8 glow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                Most Popular
              </div>
              <h3 className="text-xl font-bold">Pro</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {["Unlimited invoices", "Unlimited clients", "Auto-reminders", "Custom branding", "Priority support"].map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" /> {i}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up">
                <Button className="mt-8 w-full">Start 14-Day Trial</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-y py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-4xl font-bold">
            Ready to <span className="gradient-text">get paid</span>?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of businesses using Invoicely to streamline their billing.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button className="h-13 gap-2 px-8 text-base">
                Create Your First Invoice <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
          <p>© 2024 Invoicely. Built on YouMe.</p>
        </div>
      </footer>
    </div>
  );
}
