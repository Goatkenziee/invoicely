import { NextRequest, NextResponse } from "next/server";
import { getInvoices, getInvoice, createInvoice, updateInvoiceStatus, deleteInvoice } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const invoice = getInvoice(id);
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    return NextResponse.json(invoice);
  }

  const invoices = getInvoices();
  return NextResponse.json(invoices);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { client, lineItems, taxRate, notes, dueDate, status } = body;

    if (!client?.name?.trim()) {
      return NextResponse.json({ error: "Client name is required" }, { status: 400 });
    }

    if (!lineItems?.length || !lineItems.some((i: any) => i.description?.trim())) {
      return NextResponse.json({ error: "At least one line item with a description is required" }, { status: 400 });
    }

    const invoice = createInvoice({ client, lineItems, taxRate, notes, dueDate, status });
    return NextResponse.json(invoice, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id || action !== "pay") {
      return NextResponse.json({ error: "Invalid request: id and action='pay' required" }, { status: 400 });
    }

    const invoice = updateInvoiceStatus(id, "paid");
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    return NextResponse.json(invoice);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Invoice id is required" }, { status: 400 });
  }

  const deleted = deleteInvoice(id);
  if (!deleted) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
