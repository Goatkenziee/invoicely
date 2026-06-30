import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Get or create business for this user
  let business = await prisma.business.findFirst({ where: { userId } });
  if (!business) {
    const user = await currentUser();
    business = await prisma.business.create({
      data: {
        name: `${user?.firstName || "Your"} Business`,
        email: user?.emailAddresses[0]?.emailAddress || "",
        userId,
      },
    });
  }

  // Get stats
  const [totalInvoices, paidInvoices, overdueInvoices, totalRevenue, recentInvoices] = await Promise.all([
    prisma.invoice.count({ where: { businessId: business.id } }),
    prisma.invoice.count({ where: { businessId: business.id, status: "PAID" } }),
    prisma.invoice.count({ where: { businessId: business.id, status: "OVERDUE" } }),
    prisma.invoice.aggregate({ where: { businessId: business.id, status: "PAID" }, _sum: { total: true } }),
    prisma.invoice.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { client: true },
    }),
  ]);

  const formattedRevenue = totalRevenue._sum.total || 0;

  return (
    <DashboardClient
      businessName={business.name}
      stats={{
        totalInvoices,
        paidInvoices,
        overdueInvoices,
        totalRevenue: formattedRevenue,
        pendingRevenue: 0, // Will calculate from SENT invoices
      }}
      recentInvoices={recentInvoices.map((inv) => ({
        id: inv.id,
        number: inv.number,
        status: inv.status,
        total: inv.total,
        clientName: inv.client?.name || "Unknown",
        dueDate: inv.dueDate.toISOString(),
      }))}
    />
  );
}
