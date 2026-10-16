import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORY_TREE: Record<string, string[]> = {
  Women: ["Dresses", "Tops", "T-Shirts", "Blouses", "Jeans", "Pants", "Skirts", "Activewear"],
  Men: ["Shirts", "T-Shirts", "Jeans", "Pants", "Shorts", "Activewear"],
  Kids: ["Girls Clothing", "Boys Clothing", "Kids Shoes"],
  Beauty: ["Skincare", "Makeup", "Haircare", "Fragrance"],
  Home: ["Bedding", "Decor", "Kitchen"],
  Electronics: ["Audio", "Accessories", "Gadgets"],
};

/**
 * Idempotent and non-destructive: creates the default accounts, category tree and coupon if
 * missing. Products are not seeded — they live in the database and are managed through the admin
 * portal. Never deletes or overwrites data, so it is safe to re-run against a live database.
 */
async function main() {
  console.log("Seeding TrendPulse database...");

  const adminPassword = await bcrypt.hash("Admin123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@trendpulse.com" },
    update: {},
    create: {
      email: "admin@trendpulse.com",
      name: "TrendPulse Admin",
      password: adminPassword,
      role: "SUPER_ADMIN",
    },
  });

  const customerPassword = await bcrypt.hash("Customer123!", 10);
  await prisma.user.upsert({
    where: { email: "customer@trendpulse.com" },
    update: {},
    create: {
      email: "customer@trendpulse.com",
      name: "Jamie Rivera",
      password: customerPassword,
      role: "CUSTOMER",
    },
  });

  for (const [parentName, children] of Object.entries(CATEGORY_TREE)) {
    const parent = await prisma.category.upsert({
      where: { slug: parentName.toLowerCase() },
      update: {},
      create: {
        name: parentName,
        slug: parentName.toLowerCase(),
        description: `Shop the latest ${parentName.toLowerCase()} collection at TrendPulse.`,
        isActive: true,
      },
    });

    for (const childName of children) {
      const slug = `${childName.toLowerCase().replace(/\s+/g, "-")}`;
      await prisma.category.upsert({
        where: { slug },
        update: {},
        create: { name: childName, slug, parentId: parent.id, isActive: true },
      });
    }
  }

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: 10,
      minOrderAmount: 3000,
      maxDiscount: 2500,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2027-01-01"),
      usageLimit: 1000,
      perUserLimit: 1,
      isActive: true,
    },
  });

  console.log("Seed complete.");
  console.log("Admin login: admin@trendpulse.com / Admin123!");
  console.log("Customer login: customer@trendpulse.com / Customer123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
