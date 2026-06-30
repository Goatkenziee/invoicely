"use client";

import { Invoice, calcSubtotal, calcTax, calcTotal, formatCurrency } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

export function InvoicePreview({
  invoice,
  onMarkPaid,
}: {
  invoice: Invoice;
  onMarkPaid?: (id: string) => void;
}) {
  const subtotal = calcSubtotal(invoice.lineItems);
  const tax = calcTax(subtotal, invoice.taxRate);
  const total = calcTotal(subtotal, tax);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Action bar */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Invoices
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => window.print()}
          >
            <Printer className="h-3.5 w-3.5" />
            Print
          </Button>
          {invoice.status === "sent" && onMarkPaid && (
            <Button
              size="sm"
              className="h-8 gap-1.5"
              onClick={() => onMarkPaid(invoice.id)}
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Mark as Paid
            </Button>
          )}
        </div>
      </div>

      {/* Invoice */}
      <div className="rounded-xl border bg-card p-8 shadow-lg">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text">INVOICE</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              #{invoice.invoiceNumber}
            </p>
          </div>
          <Badge status={invoice.status} className="text-sm" />
        </div>

        {/* Dates */}
        <div className="mb-8 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Issue Date</p>
            <p className="font-medium">
              {new Date(invoice.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Due Date</p>
            <p className="font-medium">
              {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8 rounded-lg bg-background/50 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Bill To
          </p>
          <p className="text-base font-semibold">{invoice.client.name}</p>
          {invoice.client.email && (
            <p className="text-sm text-muted-foreground">{invoice.client.email}</p>
          )}
          {invoice.client.address && (
            <p className="text-sm text-muted-foreground">{invoice.client.address}</p>
          )}
          {invoice.client.phone && (
            <p className="text-sm text-muted-foreground">{invoice.client.phone}</p>
          )}
        </div>

        {/* Line Items Table */}
        <div className="mb-6 overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Description
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Qty
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Unit Price
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 text-foreground">{item.description}</td>
                  <td className="px-4 py-3 text-right text-foreground">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="ml-auto w-64 space-y-2 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Tax ({(invoice.taxRate * 100).toFixed(0)}%)
            </span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-lg font-bold">
            <span>Total</span>
            <span className="gradient-text">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-6 rounded-lg bg-muted/30 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Notes
            </p>
            <p className="text-sm text-muted-foreground">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
