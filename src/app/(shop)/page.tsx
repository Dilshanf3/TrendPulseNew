import { prisma } from "@/lib/db/prisma";
import { toProductCard } from "@/lib/utils/map-product";
import { HeroBanner } from "@/components/home/hero-banner";
import { CategoryTiles } from "@/components/home/category-tiles";
import { ProductSection } from "@/components/home/product-section";
import { FlashSaleSection } from "@/components/home/flash-sale-section";
import { PromoBanner } from "@/components/banners/promo-banner";
import { NewsletterSection } from "@/components/home/newsletter-section";

const productInclude = {
  images: { orderBy: { sortOrder: "asc" as const } },
  variants: true,
};

export default async function HomePage() {
  const [newArrivals, trending, flashSale, bestSellers] = await Promise.all([
    prisma.product.findMany({
      where: { status: "PUBLISHED", isNew: true },
      include: productInclude,
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", isFeatured: true },
      include: productInclude,
      orderBy: { soldCount: "desc" },
      take: 10,
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", salePrice: { not: null } },
      include: productInclude,
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", isBestSeller: true },
      include: productInclude,
      orderBy: { soldCount: "desc" },
      take: 10,
    }),
  ]);

  return (
    <div>
      <HeroBanner />
      <CategoryTiles />
      <ProductSection title="New Arrivals" viewAllHref="/new-in" products={newArrivals.map(toProductCard)} />
      <ProductSection title="Trending Now" viewAllHref="/search?sort=popular" products={trending.map(toProductCard)} />
      <FlashSaleSection products={flashSale.map(toProductCard)} />
      <ProductSection title="Best Sellers" viewAllHref="/search?sort=popular" products={bestSellers.map(toProductCard)} />
      <PromoBanner title="Summer Essentials" subtitle="Up to 50% Off" href="/sale" categorySlug="women" />
      <NewsletterSection />
    </div>
  );
}
