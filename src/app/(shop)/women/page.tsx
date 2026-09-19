import { prisma } from "@/lib/db/prisma";
import { toProductCard } from "@/lib/utils/map-product";
import { CategoryListing } from "@/components/product/category-listing";

export const metadata = { title: "Women" };

export default async function WomenPage() {
  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      category: { OR: [{ slug: "women" }, { parent: { slug: "women" } }] },
    },
    include: { images: { orderBy: { sortOrder: "asc" } }, variants: true },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return (
    <CategoryListing
      title="Women"
      description="Shop the latest in women's fashion — dresses, tops, denim, and more."
      products={products.map(toProductCard)}
    />
  );
}
