"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Calculator } from "lucide-react";
import { LineItem, InvoiceStatus, calcSubtotal, calcTax, calcTotal, formatCurrency } from "@/lib/db";

interface FormData {
  client: { name: string; email: string; address: string; phone: string };
  lineItems: LineItem[];
  notes: string;
  taxRate: number;
  dueDate: string;
  status: InvoiceStatus;
}

const emptyItem = (): LineItem => ({
  id: crypto.randomUUID(),
  description: "",
  quantity: 1,
  unitPrice: 0,
});

export function InvoiceForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState<FormData>({
    client: { name: "", email: "", address: "", phone: "" },
    lineItems: [emptyItem()],
    notes: "",
    taxRate: 0.08,
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    status: "draft",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const subtotal = calcSubtotal(form.lineItems);
  const tax = calcTax(subtotal, form.taxRate);
  const total = calcTotal(subtotal, tax);

  function updateClient(field: string, value: string) {
    setForm((f) => ({ ...f, client: { ...f.client, [field]: value } }));
  }

  function updateItem(id: string, field: keyof LineItem, value: string | number) {
    setForm((f) => ({
      ...f,
      lineItems: f.lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function addItem() {
    setForm((f) => ({ ...f, lineItems: [...f.lineItems, emptyItem()] }));
  }

  function removeItem(id: string) {
    setForm((f) => ({
      ...f,
      lineItems: f.lineItems.filter((item) => item.id !== id),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!form.client.name.trim()) {
      setError("Client name is required");
      setSaving(false);
      return;
    }

    const validItems = form.lineItems.filter((i) => i.description.trim());
    if (validItems.length === 0) {
      setError("At least one line item with a description is required");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: form.client,
          lineItems: validItems,
          notes: form.notes,
          taxRate: form.taxRate,
          dueDate: new Date(form.dueDate).toISOString(),
          status: form.status,
        }),
      });

      if (!res.ok) throw new Error("Failed to create");
      onSuccess();
    } catch {
      setError("Failed to create invoice. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Client Section */}
      <Card className="space-y-4 p-6">
        <h3 className="text-sm font-semibold text-foreground">Client Details</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Client Name *</label>
            <Input
              placeholder="Acme Corp"
              value={form.client.name}
              onChange={(e) => updateClient("name", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Email</label>
            <Input
              type="email"
              placeholder="billing@acme.com"
              value={form.client.email}
              onChange={(e) => updateClient("email", e.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs text-muted-foreground">Address</label>
            <Input
              placeholder="123 Business St, City, State"
              value={form.client.address}
              onChange={(e) => updateClient("address", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Phone</label>
            <Input
              placeholder="+1 (555) 123-4567"
              value={form.client.phone}
              onChange={(e) => updateClient("phone", e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Line Items */}
      <Card className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Line Items</h3>
          <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5" onClick={addItem}>
            <Plus className="h-3.5 w-3.5" />
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {form.lineItems.map((item, i) => (
            <div key={item.id} className="flex items-start gap-3 rounded-lg border bg-background/50 p-3">
              <div className="flex-1 space-y-1.5">
                <label className="text-xs text-muted-foreground">Description</label>
                <Input
                  placeholder="Web development services"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                />
              </div>
              <div className="w-20 space-y-1.5">
                <label className="text-xs text-muted-foreground">Qty</label>
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="w-28 space-y-1.5">
                <label className="text-xs text-muted-foreground">Unit Price</label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="flex h-full items-end pb-1">
                {form.lineItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Settings & Totals */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="space-y-4 p-6">
          <h3 className="text-sm font-semibold text-foreground">Settings</h3>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Tax Rate</label>
              <Select
                options={[
                  { value: "0", label: "0% (No tax)" },
                  { value: "0.05", label: "5%" },
                  { value: "0.08", label: "8%" },
                  { value: "0.10", label: "10%" },
                  { value: "0.20", label: "20%" },
                ]}
                value={String(form.taxRate)}
                onChange={(v) => setForm((f) => ({ ...f, taxRate: parseFloat(v) }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Due Date</label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Status</label>
              <Select
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "sent", label: "Sent" },
                ]}
                value={form.status}
                onChange={(v) => setForm((f) => ({ ...f, status: v as InvoiceStatus }))}
              />
            </div>
          </div>
        </Card>

        <Card className="space-y-4 p-6">
          <h3 className="text-sm font-semibold text-foreground">Notes & Totals</h3>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Notes (optional)</label>
            <Textarea
              placeholder="Payment terms, thank you message..."
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax ({(form.taxRate * 100).toFixed(0)}%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-bold">
              <span>Total</span>
              <span className="gradient-text">{formatCurrency(total)}</span>
            </div>
          </div>
        </Card>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={saving} className="gap-2">
          <Calculator className="h-4 w-4" />
          {saving ? "Creating..." : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
}
