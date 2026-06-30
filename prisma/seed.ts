import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a sample business
  const business = await prisma.business.upsert({
    where: { email: "hello@acmecorp.com" },
    update: {},
    create: {
      name: "Acme Corp",
      email: "hello@acmecorp.com",
      phone: "+1 (555) 123-4567",
      address: "123 Business Ave, Suite 100, San Francisco, CA 94102",
      userId: "sample_user_id", // Replace with actual Clerk user ID
    },
  });

  // Create sample clients
  const clients = await Promise.all([
    prisma.client.upsert({
      where: { id: "client-1" },
      update: {},
      create: {
        id: "client-1",
        name: "TechStart Inc.",
        email: "billing@techstart.io",
        address: "456 Innovation Drive, Palo Alto, CA 94301",
        businessId: business.id,
      },
    }),
    prisma.client.upsert({
      where: { id: "client-2" },
      update: {},
      create: {
        id: "client-2",
        name: "DesignStudio Co.",
        email: "accounts@designstudio.co",
        address: "789 Creative Lane, New York, NY 10012",
        businessId: business.id,
      },
    }),
    prisma.client.upsert({
      where: { id: "client-3" },
      update: {},
      create: {
        id: "client-3",
        name: "CloudOps Solutions",
        email: "payables@cloudops.com",
        address: "321 Server Row, Austin, TX 78701",
        businessId: business.id,
      },
    }),
  ]);

  // Create sample invoices
  const invoice1 = await prisma.invoice.upsert({
    where: { id: "invoice-1" },
    update: {},
    create: {
      id: "invoice-1",
      number: "INV-001",
      status: "PAID",
      issueDate: new Date("2024-12-01"),
      dueDate: new Date("2024-12-15"),
      subtotal: 5000,
      taxRate: 8.5,
      taxAmount: 425,
      total: 5425,
      businessId: business.id,
      clientId: "client-1",
      items: {
        create: [
          { description: "Website Development - Phase 1", quantity: 1, unitPrice: 3500, amount: 3500 },
          { description: "UI/UX Design", quantity: 1, unitPrice: 1500, amount: 1500 },
        ],
      },
    },
  });

  const invoice2 = await prisma.invoice.upsert({
    where: { id: "invoice-2" },
    update: {},
    create: {
      id: "invoice-2",
      number: "INV-002",
      status: "SENT",
      issueDate: new Date("2024-12-10"),
      dueDate: new Date("2024-12-31"),
      subtotal: 2800,
      taxRate: 8.5,
      taxAmount: 238,
      total: 3038,
      businessId: business.id,
      clientId: "client-2",
      items: {
        create: [
          { description: "Brand Identity Package", quantity: 1, unitPrice: 2000, amount: 2000 },
          { description: "Social Media Templates (5 sets)", quantity: 5, unitPrice: 160, amount: 800 },
        ],
      },
    },
  });

  const invoice3 = await prisma.invoice.upsert({
    where: { id: "invoice-3" },
    update: {},
    create: {
      id: "invoice-3",
      number: "INV-003",
      status: "DRAFT",
      issueDate: new Date("2024-12-15"),
      dueDate: new Date("2025-01-15"),
      subtotal: 4200,
      taxRate: 0,
      taxAmount: 0,
      total: 4200,
      businessId: business.id,
      clientId: "client-3",
      items: {
        create: [
          { description: "Cloud Infrastructure Setup", quantity: 1, unitPrice: 3200, amount: 3200 },
          { description: "Monthly Maintenance Retainer", quantity: 1, unitPrice: 1000, amount: 1000 },
        ],
      },
    },
  });

  console.log("✅ Seed complete!");
  console.log(`  Business: ${business.name}`);
  console.log(`  Clients: ${clients.length}`);
  console.log(`  Invoices: 3`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
