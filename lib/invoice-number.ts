import { prisma } from "./db";

export async function generateInvoiceNumber(businessId: string): Promise<string> {
  const count = await prisma.invoice.count({
    where: { businessId },
  });
  const next = count + 1;
  return `INV-${String(next).padStart(3, "0")}`;
}
