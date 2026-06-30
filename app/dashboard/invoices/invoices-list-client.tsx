"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, ArrowUpDown } from "lucide-react";

type Invoice = {
  id: string;
  number: string;
  status: string;
  total: number;
  issueDate: string;
  dueDate: string;
  clientName: string;
};

export function InvoicesListClient({ invoices }: { invoices: Invoice[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortField, setSortField] = useState<"issueDate" | "total" | "number">("issueDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let list = [...invoices];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (inv) =>
          inv.number.toLowerCase().includes(q) ||
          inv.clientName.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "ALL") {
      list = list.filter((inv) => inv.status === statusFilter);
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === "issueDate") cmp = new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
      else if (sortField === "total") cmp = a.total - b.total;
      else cmp = a.number.localeCompare(b.number);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [invoices, search, statusFilter, sortField, sortDir]);

  const toggleSort = (field: "issueDate" | "total" | "number") => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground mt-1">
            Manage your invoices and payments
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/invoices/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          className="border rounded-md px-3 py-2 text-sm bg-background"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="OVERDUE">Overdue</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  className="flex items-center gap-1 font-medium"
                  onClick={() => toggleSort("number")}
                >
                  Invoice
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1 font-medium"
                  onClick={() => toggleSort("issueDate")}
                >
                  Date
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  className="flex items-center gap-1 font-medium ml-auto"
                  onClick={() => toggleSort("total")}
                >
                  Amount
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  No invoices found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((inv) => (
                <TableRow
                  key={inv.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/dashboard/invoices/${inv.id}`)}
                >
                  <TableCell className="font-medium">{inv.number}</TableCell>
                  <TableCell>{inv.clientName}</TableCell>
                  <TableCell>
                    <Badge variant={inv.status.toLowerCase()}>{inv.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(inv.issueDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(inv.total)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
