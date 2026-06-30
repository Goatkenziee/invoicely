import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { InvoicesListClient } from "./invoices-list-client";

export default async function InvoicesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const business = await prisma.business.findFirst({ where: { userId } });
  if (!business) redirect("/dashboard");

  const invoices = await prisma.invoice.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    include: { client: true, items: true },
  });

  return (
    <InvoicesListClient
      invoices={invoices.map((inv) => ({
        id: inv.id,
        number: inv.number,
        status: inv.status,
        total: inv.total,
        clientName: inv.client?.name || "Unknown",
        issueDate: inv.issueDate.toISOString(),
        dueDate: inv.dueDate.toISOString(),
      }))}
    />
  );
}
