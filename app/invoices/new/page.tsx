"use client";

import { useRouter } from "next/navigation";
import { InvoiceForm } from "@/components/InvoiceForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewInvoicePage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <Link
          href="/"
          className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Invoices
        </Link>
        <h1 className="text-2xl font-bold gradient-text">New Invoice</h1>
        <p className="text-sm text-muted-foreground">
          Create a new invoice for your client
        </p>
      </div>
      <InvoiceForm onSuccess={() => router.push("/")} />
    </div>
  );
}
