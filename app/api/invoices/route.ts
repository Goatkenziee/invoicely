import { NextRequest, NextResponse } from "next/server";
import { getInvoices, createInvoice } from "@/lib/db";

export async function GET() {
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
