"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Send, CreditCard } from "lucide-react";
import { toast } from "sonner";

type Payment = {
  id: string;
  amount: number;
  status: string;
  stripePaymentIntentId: string | null;
  createdAt: string;
};

type InvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

type Invoice = {
  id: string;
  number: string;
  status: string;
  total: number;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  notes: string | null;
  issueDate: string;
  dueDate: string;
  createdAt: string;
  client: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  business: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  items: InvoiceItem[];
  payments: Payment[];
};

export function InvoiceDetailClient({ invoice }: { invoice: Invoice }) {
  const router = useRouter();

  const handleSend = async () => {
    try {
      const res = await fetch(`/api/invoice/${invoice.id}/send`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to send");
      toast.success("Invoice sent to client!");
      router.refresh();
    } catch {
      toast.error("Failed to send invoice");
    }
  };

  const handleMarkPaid = async () => {
    try {
      const res = await fetch(`/api/invoice/${invoice.id}/mark-paid`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to mark paid");
      toast.success("Invoice marked as paid!");
      router.refresh();
    } catch {
      toast.error("Failed to mark paid");
    }
  };

  const handleCreatePaymentLink = async () => {
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: invoice.id, amount: invoice.total }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create payment link");
      window.open(data.url, "_blank");
      toast.success("Payment link created!");
    } catch {
      toast.error("Failed to create payment link");
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/dashboard/invoices")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">{invoice.number}</h1>
          <Badge variant={invoice.status.toLowerCase()}>{invoice.status}</Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleSend}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
          <Button variant="outline" onClick={handleCreatePaymentLink}>
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Link
          </Button>
          {invoice.status !== "PAID" && (
            <Button onClick={handleMarkPaid}>
              Mark as Paid
            </Button>
          )}
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Business & Client Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">From</h3>
          <p className="font-semibold">{invoice.business.name}</p>
          <p className="text-sm text-muted-foreground">{invoice.business.email}</p>
          {invoice.business.address && <p className="text-sm text-muted-foreground">{invoice.business.address}</p>}
          {invoice.business.phone && <p className="text-sm text-muted-foreground">{invoice.business.phone}</p>}
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">To</h3>
          <p className="font-semibold">{invoice.client.name}</p>
          <p className="text-sm text-muted-foreground">{invoice.client.email}</p>
          {invoice.client.address && <p className="text-sm text-muted-foreground">{invoice.client.address}</p>}
          {invoice.client.phone && <p className="text-sm text-muted-foreground">{invoice.client.phone}</p>}
        </Card>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-muted-foreground">Issue Date</p>
          <p className="font-semibold">{formatDate(invoice.issueDate)}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Due Date</p>
          <p className="font-semibold">{formatDate(invoice.dueDate)}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="font-semibold text-lg">{formatCurrency(invoice.total)}</p>
        </Card>
      </div>

      {/* Line Items */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Line Items</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Description</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.items.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="border-t mt-4 pt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax ({(invoice.taxRate * 100).toFixed(0)}%)</span>
            <span>{formatCurrency(invoice.taxAmount)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-2 border-t">
            <span>Total</span>
            <span>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </Card>

      {/* Notes */}
      {invoice.notes && (
        <Card>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
          <p className="whitespace-pre-wrap">{invoice.notes}</p>
        </Card>
      )}

      {/* Payments */}
      {invoice.payments.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Payments</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{formatDate(payment.createdAt)}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={payment.status.toLowerCase()}>{payment.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    {payment.stripePaymentIntentId || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
