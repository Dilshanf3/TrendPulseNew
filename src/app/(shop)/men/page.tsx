import { prisma } from "@/lib/db/prisma";
import { toProductCard } from "@/lib/utils/map-product";
import { CategoryListing } from "@/components/product/category-listing";

export const metadata = { title: "Men" };

export default async function MenPage() {
  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      category: { OR: [{ slug: "men" }, { parent: { slug: "men" } }] },
    },
    include: { images: { orderBy: { sortOrder: "asc" } }, variants: true },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return (
    <CategoryListing
      title="Men"
      description="Shop the latest in men's fashion — shirts, denim, activewear, and more."
      products={products.map(toProductCard)}
    />
  );
}
