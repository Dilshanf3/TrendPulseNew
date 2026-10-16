/**
 * One-off cleanup of the old generated demo data.
 *
 *   npm run db:remove-demo            # dry run — prints what would be removed
 *   npm run db:remove-demo -- --apply # actually deletes, in one transaction
 *
 * Demo data is recognised by its stock-photo image hosts (the old generator used Unsplash/Picsum).
 * Removes every product whose images come from those hosts (with its images, variants, reviews,
 * cart/wishlist entries), any orders that contain those products (order items can't outlive their
 * product) plus those orders' shipping addresses, stock-photo banners, and unused brands and tags.
 * Users, categories and coupons are kept.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const apply = process.argv.includes("--apply");
const DEMO_IMAGE_HOSTS = ["images.unsplash.com", "picsum.photos"];
const fromDemoHost = DEMO_IMAGE_HOSTS.map((host) => ({ url: { contains: host } }));

async function main() {
  const demoProducts = await prisma.product.findMany({ where: { images: { some: { OR: fromDemoHost } } }, select: { id: true } });
  const demoProductIds = demoProducts.map((p) => p.id);

  const orders = await prisma.order.findMany({
    where: { items: { some: { productId: { in: demoProductIds } } } },
    select: { id: true, orderNumber: true, shippingAddressId: true },
  });
  const banners = await prisma.banner.findMany({
    where: { OR: DEMO_IMAGE_HOSTS.map((host) => ({ image: { contains: host } })) },
    select: { id: true, title: true },
  });

  console.log(`Products to remove: ${demoProductIds.length}`);
  console.log(`Orders to remove:   ${orders.length}${orders.length ? ` — ${orders.map((o) => o.orderNumber).join(", ")}` : ""}`);
  console.log(`Banners to remove:  ${banners.length}${banners.length ? ` — ${banners.map((b) => b.title).join(", ")}` : ""}`);
  console.log("Brands and tags no longer used by any product will also be removed.");

  if (!apply) {
    console.log("\nDry run only. Re-run with --apply to delete.");
    return;
  }

  const orderIds = orders.map((o) => o.id);
  const addressIds = orders.map((o) => o.shippingAddressId).filter((id): id is string => !!id);

  await prisma.$transaction(async (tx) => {
    // Cascades to order items, payments and coupon usage.
    await tx.order.deleteMany({ where: { id: { in: orderIds } } });
    await tx.address.deleteMany({ where: { id: { in: addressIds }, orders: { none: {} } } });
    // Cascades to images, variants, tags, reviews, cart, wishlist and recently-viewed rows.
    await tx.product.deleteMany({ where: { id: { in: demoProductIds } } });
    await tx.banner.deleteMany({ where: { id: { in: banners.map((b) => b.id) } } });
    await tx.brand.deleteMany({ where: { products: { none: {} } } });
    await tx.tag.deleteMany({ where: { products: { none: {} } } });
  });

  console.log("\nDemo data removed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
