import { ProductCard } from "./product-card";
import { getSavedProductIds } from "@/server/services/wishlist-service";
import type { ProductCardData } from "@/types";

export async function ProductGrid({ products }: { products: ProductCardData[] }) {
  const savedIds = await getSavedProductIds();

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} saved={savedIds.has(product.id)} />
      ))}
    </div>
  );
}
