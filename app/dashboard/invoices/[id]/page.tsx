import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { InvoiceDetailClient } from "./invoice-detail-client";

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      business: true,
      items: true,
      payments: true,
    },
  });

  if (!invoice || invoice.business.userId !== userId) notFound();

  return (
    <InvoiceDetailClient
      invoice={{
        id: invoice.id,
        number: invoice.number,
        status: invoice.status,
        total: invoice.total,
        subtotal: invoice.subtotal,
        taxRate: invoice.taxRate,
        taxAmount: invoice.taxAmount,
        notes: invoice.notes,
        issueDate: invoice.issueDate.toISOString(),
        dueDate: invoice.dueDate.toISOString(),
        createdAt: invoice.createdAt.toISOString(),
        client: {
          name: invoice.client.name,
          email: invoice.client.email,
          address: invoice.client.address || "",
          phone: invoice.client.phone || "",
        },
        business: {
          name: invoice.business.name,
          email: invoice.business.email,
          address: invoice.business.address || "",
          phone: invoice.business.phone || "",
        },
        items: invoice.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.amount,
        })),
        payments: invoice.payments.map((p) => ({
          id: p.id,
          amount: p.amount,
          status: p.status,
          stripePaymentIntentId: p.stripePaymentIntentId,
          createdAt: p.createdAt.toISOString(),
        })),
      }}
    />
  );
}
