import Link from "next/link";
import { ProductGrid } from "@/components/product-grid/product-grid";
import type { ProductCardData } from "@/types";

export function ProductSection({
  title,
  subtitle,
  viewAllHref,
  products,
}: {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  products: ProductCardData[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 lg:px-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-wide text-charcoal sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-charcoal-soft/70">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} className="shrink-0 text-xs font-semibold uppercase tracking-wide text-gold-dark underline decoration-gold underline-offset-4 hover:text-charcoal">
            View All
          </Link>
        )}
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
