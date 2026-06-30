import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { businessId, clientId, number, dueDate, notes, items, status, taxRate } = await req.json();

    if (!businessId || !clientId || !number || !dueDate || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify business ownership
    const business = await prisma.business.findFirst({ where: { id: businessId, userId } });
    if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 });

    const subtotal = items.reduce((sum: number, item: any) => sum + item.quantity * item.unitPrice, 0);
    const rate = taxRate ?? 0.1;
    const taxAmount = subtotal * rate;
    const total = subtotal + taxAmount;

    const invoice = await prisma.invoice.create({
      data: {
        number,
        status: status || "DRAFT",
        subtotal,
        taxRate: rate,
        taxAmount,
        total,
        notes,
        issueDate: new Date(),
        dueDate: new Date(dueDate),
        businessId,
        clientId,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.quantity * item.unitPrice,
          })),
        },
      },
      include: { client: true, items: true },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Invoice creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");
    const status = searchParams.get("status");

    if (!businessId) return NextResponse.json({ error: "Missing businessId" }, { status: 400 });

    const business = await prisma.business.findFirst({ where: { id: businessId, userId } });
    if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 });

    const where: any = { businessId };
    if (status) where.status = status;

    const invoices = await prisma.invoice.findMany({
      where,
      include: { client: true, items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Invoice list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
