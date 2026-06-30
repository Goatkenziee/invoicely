import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { NewInvoiceClient } from "./new-invoice-client";

export default async function NewInvoicePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const business = await prisma.business.findFirst({
    where: { userId },
    include: { clients: true },
  });
  if (!business) redirect("/dashboard");

  // Generate next invoice number
  const lastInvoice = await prisma.invoice.findFirst({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    select: { number: true },
  });

  let nextNumber = "INV-001";
  if (lastInvoice) {
    const num = parseInt(lastInvoice.number.replace("INV-", ""), 10);
    if (!isNaN(num)) {
      nextNumber = `INV-${String(num + 1).padStart(3, "0")}`;
    }
  }

  return (
    <NewInvoiceClient
      businessId={business.id}
      nextNumber={nextNumber}
      clients={business.clients.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
      }))}
    />
  );
}
