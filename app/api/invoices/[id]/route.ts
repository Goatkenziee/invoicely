import { NextRequest, NextResponse } from "next/server";
import { getInvoice, updateInvoiceStatus, deleteInvoice } from "@/lib/db";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const invoice = getInvoice(params.id);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }
  return NextResponse.json(invoice);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "pay") {
      const invoice = updateInvoiceStatus(params.id, "paid");
      if (!invoice) {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
      }
      return NextResponse.json(invoice);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const deleted = deleteInvoice(params.id);
  if (!deleted) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
