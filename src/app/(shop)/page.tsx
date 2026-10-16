import { getCollection } from "@/server/services/product-service";
import { getHeroContent, getSaleSummary, getShopCategories } from "@/server/services/storefront-service";
import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { ProductRail } from "@/components/home/product-rail";
import { SaleBanner } from "@/components/home/sale-banner";

export default async function HomePage() {
  const [hero, categories, sale, newArrivals, bestSellers] = await Promise.all([
    getHeroContent(),
    getShopCategories(),
    getSaleSummary(),
    getCollection("new-arrivals"),
    getCollection("best-sellers"),
  ]);

  return (
    <>
      <Hero {...hero} showSaleLink={sale.count > 0} />
      <CategoryGrid categories={categories} />
      <ProductRail title="New arrivals" subtitle="Just landed" href="/new-in" products={newArrivals} />
      {sale.count > 0 && <SaleBanner maxDiscount={sale.maxDiscount} image={sale.image} />}
      <ProductRail title="Best sellers" subtitle="What everyone's wearing" href="/new-in?sort=popular" products={bestSellers} />
    </>
  );
}
