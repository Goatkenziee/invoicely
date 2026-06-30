import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "InvoiceFlow — Modern Client Invoicing",
  description: "Create, send, and track professional invoices for your clients",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ ["--font-sans" as string]: "Inter, system-ui, sans-serif" }}>
      <body className="min-h-screen">
        <nav className="border-b">
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-lg font-bold gradient-text">
              InvoiceFlow
            </Link>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/" className="transition hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/invoices/new" className="transition hover:text-foreground">
                New Invoice
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
