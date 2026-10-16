import { SectionHeader } from "@/components/ui/section-header";
import { ProductGrid } from "@/components/catalog/product-grid";
import type { ProductCardData } from "@/types";

/** A titled row of products — used on the home page and for "You may also like". */
export function ProductRail({
  title,
  subtitle,
  href,
  products,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  products: ProductCardData[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="container-page py-12 sm:py-16">
      <SectionHeader title={title} subtitle={subtitle} href={href} />
      <ProductGrid products={products} />
    </section>
  );
}
