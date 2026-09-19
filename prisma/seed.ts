import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { pickProductImages, HERO_IMAGE, PROMO_IMAGE } from "../src/lib/image-pool";

const prisma = new PrismaClient();

const COLOR_HEX: Record<string, string> = {
  Black: "#111111",
  White: "#FAFAFA",
  Red: "#DC2626",
  Blue: "#2563EB",
  Green: "#16A34A",
  Pink: "#EC4899",
  Beige: "#D6C7A1",
  Gray: "#6B7280",
  Navy: "#1E3A5F",
  Brown: "#78350F",
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

function pick<T>(arr: T[], n = 1): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const CATEGORY_TREE: Record<string, string[]> = {
  Women: ["Dresses", "Tops", "T-Shirts", "Blouses", "Jeans", "Pants", "Skirts", "Activewear"],
  Men: ["Shirts", "T-Shirts", "Jeans", "Pants", "Shorts", "Activewear"],
  Kids: ["Girls Clothing", "Boys Clothing", "Kids Shoes"],
  Beauty: ["Skincare", "Makeup", "Haircare", "Fragrance"],
  Home: ["Bedding", "Decor", "Kitchen"],
  Electronics: ["Audio", "Accessories", "Gadgets"],
};

const PRODUCT_NOUNS = [
  "Oversized Shirt", "Slim Fit Jeans", "Cropped Hoodie", "Wrap Dress", "Denim Jacket",
  "Ribbed Tank", "Pleated Skirt", "Linen Trousers", "Graphic Tee", "Puffer Vest",
  "Knit Sweater", "Cargo Pants", "Midi Dress", "Bomber Jacket", "Satin Cami",
  "Wide Leg Pants", "Utility Jacket", "Mesh Top", "High-Waist Shorts", "Longline Coat",
];

const ADJECTIVES = ["Classic", "Modern", "Essential", "Relaxed", "Elevated", "Vintage", "Casual", "Chic"];

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
  const customer = await prisma.user.upsert({
    where: { email: "customer@trendpulse.com" },
    update: {},
    create: {
      email: "customer@trendpulse.com",
      name: "Jamie Rivera",
      password: customerPassword,
      role: "CUSTOMER",
    },
  });

  const categoryMap: Record<string, string> = {};

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
    categoryMap[parentName] = parent.id;

    for (const childName of children) {
      const slug = `${childName.toLowerCase().replace(/\s+/g, "-")}`;
      const child = await prisma.category.upsert({
        where: { slug },
        update: {},
        create: {
          name: childName,
          slug,
          parentId: parent.id,
          isActive: true,
        },
      });
      categoryMap[childName] = child.id;
    }
  }

  const brands = await Promise.all(
    ["TrendPulse Basics", "Urban Thread", "Studio 21", "Northline", "Aria Collective"].map((name) =>
      prisma.brand.upsert({
        where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
        update: {},
        create: { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
      })
    )
  );

  const tags = await Promise.all(
    ["summer", "casual", "office", "streetwear", "minimal", "party"].map((name) =>
      prisma.tag.upsert({
        where: { slug: name },
        update: {},
        create: { name, slug: name },
      })
    )
  );

  await prisma.product.deleteMany({});

  const allSubCategories = Object.values(CATEGORY_TREE).flat();
  const subCategoryToParentSlug: Record<string, string> = {};
  for (const [parentName, children] of Object.entries(CATEGORY_TREE)) {
    for (const child of children) {
      subCategoryToParentSlug[child] = parentName.toLowerCase();
    }
  }
  let productIndex = 0;
  const totalProducts = 100;

  for (let i = 0; i < totalProducts; i++) {
    const categoryName = allSubCategories[i % allSubCategories.length];
    const categoryId = categoryMap[categoryName];
    const parentSlug = subCategoryToParentSlug[categoryName] ?? "women";
    const adjective = ADJECTIVES[randInt(0, ADJECTIVES.length - 1)];
    const noun = PRODUCT_NOUNS[randInt(0, PRODUCT_NOUNS.length - 1)];
    const name = `${adjective} ${noun} ${i + 1}`;
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${i + 1}`;

    const basePrice = randInt(1500, 15000);
    const isOnSale = Math.random() < 0.45;
    const salePrice = isOnSale ? Math.round(basePrice * (0.5 + Math.random() * 0.3)) : null;

    const productColors = pick(Object.keys(COLOR_HEX), randInt(2, 4));
    const seed = `tp-product-${i + 1}`;
    const [imageA, imageB, imageC] = pickProductImages(parentSlug, seed);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: `A ${adjective.toLowerCase()} ${noun.toLowerCase()} crafted for everyday wear. Made with premium materials and designed for comfort and style.`,
        details: "Regular fit. True to size. Designed in-house by the TrendPulse studio team.",
        material: pick(["100% Cotton", "Cotton Blend", "Polyester", "Linen Blend", "Viscose"], 1)[0],
        careInstructions: "Machine wash cold. Do not bleach. Tumble dry low.",
        status: "PUBLISHED",
        basePrice,
        salePrice,
        isNew: Math.random() < 0.25,
        isFeatured: Math.random() < 0.2,
        isBestSeller: Math.random() < 0.15,
        ratingAvg: Math.round((3 + Math.random() * 2) * 10) / 10,
        ratingCount: randInt(0, 240),
        soldCount: randInt(0, 500),
        categoryId,
        brandId: brands[randInt(0, brands.length - 1)].id,
        images: {
          create: [
            { url: imageA, sortOrder: 0 },
            { url: imageB, sortOrder: 1, isHover: true },
            { url: imageC, sortOrder: 2 },
          ],
        },
        variants: {
          create: productColors.flatMap((color) =>
            pick(SIZES, randInt(3, SIZES.length)).map((size) => ({
              sku: `${slug}-${color.toLowerCase()}-${size}`.toUpperCase(),
              color,
              colorHex: COLOR_HEX[color],
              size,
              price: basePrice,
              salePrice,
              stock: randInt(0, 60),
              reservedStock: 0,
            }))
          ),
        },
        tags: {
          create: pick(tags, randInt(1, 3)).map((tag) => ({ tagId: tag.id })),
        },
      },
    });

    if (Math.random() < 0.3) {
      await prisma.review.create({
        data: {
          productId: product.id,
          userId: customer.id,
          rating: randInt(3, 5),
          title: "Great quality",
          body: "Loved the fit and fabric quality. Would definitely buy again.",
          isVerifiedPurchase: true,
          helpfulVotes: randInt(0, 20),
        },
      });
    }

    productIndex++;
  }

  console.log(`Created ${productIndex} products.`);

  await prisma.banner.createMany({
    data: [
      {
        title: "The New Season",
        subtitle: "Discover the latest trends",
        image: HERO_IMAGE,
        link: "/new-in",
        placement: "HERO",
        sortOrder: 0,
      },
      {
        title: "Summer Essentials",
        subtitle: "Up to 50% Off",
        image: PROMO_IMAGE,
        link: "/sale",
        placement: "PROMO",
        sortOrder: 0,
      },
    ],
  });

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
