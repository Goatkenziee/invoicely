"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DollarSign, FileText, CheckCircle, AlertCircle, TrendingUp, ArrowRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";

interface DashboardProps {
  businessName: string;
  stats: {
    totalInvoices: number;
    paidInvoices: number;
    overdueInvoices: number;
    totalRevenue: number;
    pendingRevenue: number;
  };
  recentInvoices: Array<{
    id: string;
    number: string;
    status: string;
    total: number;
    clientName: string;
    dueDate: string;
  }>;
}

const statusBadge = (status: string) => {
  const map: Record<string, { variant: string; label: string }> = {
    DRAFT: { variant: "draft", label: "Draft" },
    SENT: { variant: "sent", label: "Sent" },
    PAID: { variant: "paid", label: "Paid" },
    OVERDUE: { variant: "overdue", label: "Overdue" },
    CANCELLED: { variant: "cancelled", label: "Cancelled" },
  };
  const m = map[status] || { variant: "default", label: status };
  return <Badge variant={m.variant}>{m.label}</Badge>;
};

export function DashboardClient({ businessName, stats, recentInvoices }: DashboardProps) {
  const statCards = [
    { icon: FileText, label: "Total Invoices", value: stats.totalInvoices.toString(), color: "text-blue-400" },
    { icon: CheckCircle, label: "Paid", value: stats.paidInvoices.toString(), color: "text-green-400" },
    { icon: AlertCircle, label: "Overdue", value: stats.overdueInvoices.toString(), color: "text-red-400" },
    { icon: DollarSign, label: "Revenue", value: formatCurrency(stats.totalRevenue), color: "text-primary" },
  ];

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-1 text-muted-foreground">{businessName}</p>
        </div>
        <Link href="/dashboard/invoices/new">
          <Button className="gap-2">
            <TrendingUp className="h-4 w-4" /> New Invoice
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label} className="p-6">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="text-2xl font-bold">{s.value}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Invoices */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Invoices</h2>
          <Link href="/dashboard/invoices">
            <Button variant="ghost" size="sm" className="gap-1 text-sm">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        {recentInvoices.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <FileText className="mx-auto mb-3 h-10 w-10 opacity-50" />
            <p>No invoices yet. Create your first one!</p>
            <Link href="/dashboard/invoices/new">
              <Button className="mt-4" size="sm">Create Invoice</Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentInvoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.number}</TableCell>
                  <TableCell>{inv.clientName}</TableCell>
                  <TableCell>{statusBadge(inv.status)}</TableCell>
                  <TableCell>{formatDate(inv.dueDate)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(inv.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
