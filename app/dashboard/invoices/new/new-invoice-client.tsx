"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type ClientOption = {
  id: string;
  name: string;
  email: string;
};

type LineItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

type Props = {
  businessId: string;
  nextNumber: string;
  clients: ClientOption[];
};

export function NewInvoiceClient({ businessId, nextNumber, clients }: Props) {
  const router = useRouter();
  const [clientId, setClientId] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (idx: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, field: keyof LineItem, value: string | number) => {
    const updated = items.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      toast.error("Please select a client");
      return;
    }
    if (items.some((item) => !item.description)) {
      toast.error("All line items need a description");
      return;
    }
    if (items.some((item) => item.quantity <= 0 || item.unitPrice <= 0)) {
      toast.error("Quantity and unit price must be greater than 0");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          issueDate: new Date(issueDate).toISOString(),
          dueDate: new Date(dueDate).toISOString(),
          taxRate: taxRate / 100,
          notes: notes || undefined,
          items: items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create invoice");
      toast.success(`Invoice ${data.number} created!`);
      router.push(`/dashboard/invoices/${data.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create invoice");
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/dashboard/invoices")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Invoice</h1>
          <p className="text-sm text-muted-foreground">{nextNumber}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Client & Dates */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Client</label>
              <select
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              >
                <option value="">Select a client...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            </div>
            <div />
            <div>
              <label className="text-sm font-medium mb-1 block">Issue Date</label>
              <Input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Due Date</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Tax Rate (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </Card>

        {/* Line Items */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Line Items</h2>
            <Button type="button" variant="outline" onClick={addItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="flex-1">
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(idx, "description", e.target.value)}
                  />
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, "quantity", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Unit price"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(idx, "unitPrice", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="w-24 pt-2 text-right text-sm font-medium">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(idx)}
                  className="mt-1"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-border mt-4 pt-4 space-y-1 text-right">
            <p className="text-sm text-muted-foreground">
              Subtotal: {formatCurrency(subtotal)}
            </p>
            {taxRate > 0 && (
              <p className="text-sm text-muted-foreground">
                Tax ({taxRate}%): {formatCurrency(taxAmount)}
              </p>
            )}
            <p className="text-xl font-bold">Total: {formatCurrency(total)}</p>
          </div>
        </Card>

        {/* Notes */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Notes</h2>
          <Textarea
            placeholder="Payment terms, additional notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/invoices")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : `Create Invoice ${nextNumber}`}
          </Button>
        </div>
      </form>
    </div>
  );
}
