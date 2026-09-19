import { prisma } from "@/lib/db/prisma";
import { toProductCard } from "@/lib/utils/map-product";
import { CategoryListing } from "@/components/product/category-listing";

export const metadata = { title: "Sale" };

export default async function SalePage() {
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED", salePrice: { not: null } },
    include: { images: { orderBy: { sortOrder: "asc" } }, variants: true },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return (
    <CategoryListing title="Sale" description="Limited-time deals across the entire collection." products={products.map(toProductCard)} />
  );
}
