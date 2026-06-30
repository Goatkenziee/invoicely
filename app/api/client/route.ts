import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { businessId, name, email, address, phone } = await req.json();

    if (!businessId || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const business = await prisma.business.findFirst({ where: { id: businessId, userId } });
    if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 });

    const client = await prisma.client.create({
      data: { name, email, address, phone, businessId },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error("Client creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
