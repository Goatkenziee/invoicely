// In-memory data store for the invoicing app
// In production this would be replaced with Prisma + Postgres

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface ClientInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  client: ClientInfo;
  lineItems: LineItem[];
  taxRate: number;
  notes: string;
  dueDate: string;
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
}

// In-memory store
let invoices: Invoice[] = [];

// Seed some demo data
const seedInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    client: { name: "Acme Corp", email: "billing@acme.com", address: "123 Business St", phone: "+1 (555) 123-4567" },
    lineItems: [
      { id: "li-1", description: "Website Design", quantity: 1, unitPrice: 2500 },
      { id: "li-2", description: "Logo Package", quantity: 1, unitPrice: 500 },
    ],
    taxRate: 0.08,
    notes: "Payment due within 30 days.",
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    status: "paid",
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    client: { name: "TechStart Inc", email: "accounts@techstart.io", address: "789 Innovation Dr", phone: "+1 (555) 987-6543" },
    lineItems: [
      { id: "li-3", description: "API Development (40hrs)", quantity: 40, unitPrice: 95 },
      { id: "li-4", description: "Database Setup", quantity: 1, unitPrice: 1000 },
    ],
    taxRate: 0.08,
    notes: "Net 30 terms.",
    dueDate: new Date(Date.now() + 16 * 86400000).toISOString(),
    status: "sent",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: "3",
    invoiceNumber: "INV-003",
    client: { name: "Maria Garcia Design", email: "maria@mgdesign.co", address: "321 Creative Ln", phone: "+1 (555) 555-0000" },
    lineItems: [
      { id: "li-5", description: "Brand Identity Package", quantity: 1, unitPrice: 1500 },
      { id: "li-6", description: "Social Media Kit", quantity: 1, unitPrice: 300 },
    ],
    taxRate: 0.08,
    notes: "",
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

invoices = [...seedInvoices];

// Calculation helpers
export function calcSubtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export function calcTax(subtotal: number, taxRate: number): number {
  return subtotal * taxRate;
}

export function calcTotal(subtotal: number, tax: number): number {
  return subtotal + tax;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// CRUD operations
export function getInvoices(): Invoice[] {
  return [...invoices].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getInvoice(id: string): Invoice | undefined {
  return invoices.find((inv) => inv.id === id);
}

export function createInvoice(data: {
  client: ClientInfo;
  lineItems: LineItem[];
  taxRate: number;
  notes: string;
  dueDate: string;
  status: InvoiceStatus;
}): Invoice {
  const nextNum = invoices.length + 1;
  const invoice: Invoice = {
    id: crypto.randomUUID(),
    invoiceNumber: `INV-${String(nextNum).padStart(3, "0")}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  invoices.push(invoice);
  return invoice;
}

export function updateInvoiceStatus(
  id: string,
  status: InvoiceStatus
): Invoice | undefined {
  const invoice = invoices.find((inv) => inv.id === id);
  if (!invoice) return undefined;
  invoice.status = status;
  invoice.updatedAt = new Date().toISOString();
  return invoice;
}

export function deleteInvoice(id: string): boolean {
  const idx = invoices.findIndex((inv) => inv.id === id);
  if (idx === -1) return false;
  invoices.splice(idx, 1);
  return true;
}
