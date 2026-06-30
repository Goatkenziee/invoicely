"use client";

import { Invoice, calcSubtotal, calcTax, calcTotal, formatCurrency } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export function InvoiceCard({
  invoice,
  onDelete,
  onMarkPaid,
}: {
  invoice: Invoice;
  onDelete: (id: string) => void;
  onMarkPaid: (id: string) => void;
}) {
  const subtotal = calcSubtotal(invoice.lineItems);
  const tax = calcTax(subtotal, invoice.taxRate);
  const total = calcTotal(subtotal, tax);

  return (
    <Card className="group flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Invoice #{invoice.invoiceNumber}
            </p>
            <p className="text-xs text-muted-foreground">{invoice.client.name}</p>
          </div>
        </div>
        <Badge status={invoice.status} />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {new Date(invoice.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span className="font-semibold text-foreground">{formatCurrency(total)}</span>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Link href={`/invoices/${invoice.id}`}>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <ExternalLink className="h-3.5 w-3.5" />
            View
          </Button>
        </Link>
        {invoice.status === "sent" && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs text-green-400"
            onClick={() => onMarkPaid(invoice.id)}
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Pay
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto h-8 gap-1.5 text-xs text-red-400"
          onClick={() => onDelete(invoice.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>
    </Card>
  );
}
