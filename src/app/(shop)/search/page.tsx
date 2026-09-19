import { prisma } from "@/lib/db/prisma";
import { toProductCard } from "@/lib/utils/map-product";
import { CategoryListing } from "@/components/product/category-listing";

export const metadata = { title: "Search Results" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;

  const products = q.trim()
    ? await prisma.product.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
        include: { images: { orderBy: { sortOrder: "asc" } }, variants: true },
        take: 60,
      })
    : [];

  return (
    <CategoryListing
      title={q ? `Results for "${q}"` : "Search"}
      description={q ? undefined : "Enter a search term to find products."}
      products={products.map(toProductCard)}
    />
  );
}
