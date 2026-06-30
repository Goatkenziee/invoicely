"use client";

import { useState, useEffect, useCallback } from "react";
import { Invoice } from "@/lib/db";
import { InvoiceCard } from "@/components/InvoiceCard";
import { Button } from "@/components/ui/button";
import { Plus, FileText, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export function InvoiceDashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/invoices");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setInvoices(data);
      setError("");
    } catch {
      setError("Could not load invoices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this invoice?")) return;
    const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
    if (res.ok) setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  }

  async function handleMarkPaid(id: string) {
    const res = await fetch(`/api/invoices/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "pay" }),
    });
    if (res.ok) fetchInvoices();
  }

  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === "paid").length,
    sent: invoices.filter((i) => i.status === "sent").length,
    overdue: invoices.filter((i) => i.status === "overdue").length,
    draft: invoices.filter((i) => i.status === "draft").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Invoices</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track your client invoices
          </p>
        </div>
        <Link href="/invoices/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatCard label="Total" value={stats.total} color="text-foreground" />
        <StatCard label="Paid" value={stats.paid} color="text-green-400" />
        <StatCard label="Sent" value={stats.sent} color="text-blue-400" />
        <StatCard label="Draft" value={stats.draft} color="text-muted-foreground" />
        <StatCard
          label="Overdue"
          value={stats.overdue}
          color={stats.overdue > 0 ? "text-red-400" : "text-muted-foreground"}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" />
          {error}
          <Button variant="ghost" size="sm" className="ml-auto h-7 text-xs" onClick={fetchInvoices}>
            Retry
          </Button>
        </div>
      )}

      {/* Empty state */}
      {invoices.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">No invoices yet</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Create your first invoice to get started
          </p>
          <Link href="/invoices/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Invoice
            </Button>
          </Link>
        </div>
      )}

      {/* Invoice Grid */}
      {invoices.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {invoices.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              onDelete={handleDelete}
              onMarkPaid={handleMarkPaid}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border bg-card p-4 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
