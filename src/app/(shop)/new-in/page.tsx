import { prisma } from "@/lib/db/prisma";
import { toProductCard } from "@/lib/utils/map-product";
import { CategoryListing } from "@/components/product/category-listing";

export const metadata = { title: "New In" };

export default async function NewInPage() {
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED", isNew: true },
    include: { images: { orderBy: { sortOrder: "asc" } }, variants: true },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return (
    <CategoryListing title="New In" description="The latest arrivals, fresh off the runway." products={products.map(toProductCard)} />
  );
}
