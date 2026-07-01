"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Invoice } from "@/lib/db";
import { InvoicePreview } from "@/components/InvoicePreview";
import { RefreshCw } from "lucide-react";

export default function InvoiceDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold">Invoice not found</p>
        <p className="text-sm text-muted-foreground">No invoice ID provided.</p>
      </div>
    );
  }

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/invoices?id=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setInvoice(data))
      .catch(() => setInvoice(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleMarkPaid(invoiceId: string) {
    const res = await fetch(`/api/invoices`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: invoiceId, action: "pay" }),
    });
    if (res.ok) {
      const updated = await res.json();
      setInvoice(updated);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold">Invoice not found</p>
        <p className="text-sm text-muted-foreground">This invoice doesn't exist or was deleted.</p>
      </div>
    );
  }

  return <InvoicePreview invoice={invoice} onMarkPaid={handleMarkPaid} />;
}
