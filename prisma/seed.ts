import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create a demo business
  const business = await prisma.business.upsert({
    where: { userId: "demo-user-id" },
    update: {},
    create: {
      userId: "demo-user-id",
      name: "Acme Corp",
      email: "billing@acmecorp.com",
      phone: "+1 (555) 123-4567",
      address: "123 Business Ave, Suite 100, San Francisco, CA 94102",
    },
  });

  // Create clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        address: "456 Oak Street, Apt 2B, New York, NY 10001",
        businessId: business.id,
      },
    }),
    prisma.client.create({
      data: {
        name: "TechStart Inc",
        email: "accounts@techstart.io",
        address: "789 Innovation Drive, Palo Alto, CA 94304",
        businessId: business.id,
      },
    }),
    prisma.client.create({
      data: {
        name: "Maria Garcia Design",
        email: "maria@mgdesign.co",
        address: "321 Creative Lane, Austin, TX 78701",
        businessId: business.id,
      },
    }),
  ]);

  // Create invoices
  const now = new Date();
  const invoices = [
    {
      number: "INV-001",
      status: "PAID",
      total: 2500.00,
      issueDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      dueDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      clientId: clients[0].id,
      items: [
        { description: "Website Redesign", quantity: 1, rate: 2000, amount: 2000 },
        { description: "Logo Package", quantity: 1, rate: 500, amount: 500 },
      ],
    },
    {
      number: "INV-002",
      status: "SENT",
      total: 4800.00,
      issueDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      dueDate: new Date(now.getTime() + 16 * 24 * 60 * 60 * 1000),
      clientId: clients[1].id,
      items: [
        { description: "API Development", quantity: 40, rate: 95, amount: 3800 },
        { description: "Database Setup", quantity: 1, rate: 1000, amount: 1000 },
      ],
    },
    {
      number: "INV-003",
      status: "DRAFT",
      total: 1800.00,
      issueDate: now,
      dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      clientId: clients[2].id,
      items: [
        { description: "Brand Identity Package", quantity: 1, rate: 1500, amount: 1500 },
        { description: "Social Media Kit", quantity: 1, rate: 300, amount: 300 },
      ],
    },
  ];

  for (const inv of invoices) {
    const { items, ...invoiceData } = inv;
    await prisma.invoice.create({
      data: {
        ...invoiceData,
        businessId: business.id,
        items: {
          create: items,
        },
      },
    });
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
