import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { id: string } }) {
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

    // Create a payment record and update invoice status
    const [payment] = await prisma.$transaction([
      prisma.payment.create({
        data: {
          amount: invoice.total,
          status: "COMPLETED",
          invoiceId: invoice.id,
        },
      }),
      prisma.invoice.update({
        where: { id: params.id },
        data: { status: "PAID" },
      }),
    ]);

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Mark paid error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
