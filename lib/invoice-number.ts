import { getInvoices } from "./db";

export async function generateInvoiceNumber(): Promise<string> {
  const invoices = getInvoices();
  const next = invoices.length + 1;
  return `INV-${String(next).padStart(3, "0")}`;
}
