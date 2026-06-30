import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: { business: true, client: true },
    });

    if (!invoice || invoice.business.userId !== userId) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Update status to SENT
    const updated = await prisma.invoice.update({
      where: { id: params.id },
      data: { status: "SENT" },
    });

    // In production, send email via Resend here
    console.log(`Invoice ${invoice.number} sent to ${invoice.client.email}`);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Send error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
