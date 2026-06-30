import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: { client: true, business: true, items: true, payments: true },
    });

    if (!invoice || invoice.business.userId !== userId) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Invoice get error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: { business: true },
    });

    if (!invoice || invoice.business.userId !== userId) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (invoice.status !== "DRAFT") {
      return NextResponse.json({ error: "Only draft invoices can be edited" }, { status: 400 });
    }

    const { clientId, dueDate, notes, items, taxRate } = await req.json();

    const subtotal = items
      ? items.reduce((sum: number, item: any) => sum + item.quantity * item.unitPrice, 0)
      : invoice.subtotal;
    const rate = taxRate ?? invoice.taxRate;
    const taxAmount = subtotal * rate;
    const total = subtotal + taxAmount;

    // Delete old items and recreate
    if (items) {
      await prisma.invoiceItem.deleteMany({ where: { invoiceId: params.id } });
    }

    const updated = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        ...(clientId && { clientId }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(notes !== undefined && { notes }),
        ...(items && { subtotal, taxRate: rate, taxAmount, total }),
        items: items
          ? {
              create: items.map((item: any) => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                amount: item.quantity * item.unitPrice,
              })),
            }
          : undefined,
      },
      include: { client: true, items: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Invoice update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: { business: true },
    });

    if (!invoice || invoice.business.userId !== userId) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (invoice.status === "PAID") {
      return NextResponse.json({ error: "Cannot delete a paid invoice" }, { status: 400 });
    }

    await prisma.invoiceItem.deleteMany({ where: { invoiceId: params.id } });
    await prisma.payment.deleteMany({ where: { invoiceId: params.id } });
    await prisma.invoice.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Invoice delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
