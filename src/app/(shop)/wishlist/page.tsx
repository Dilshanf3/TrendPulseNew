"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid/product-grid";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toProductCard } from "@/lib/utils/map-product";
import type { ProductCardData } from "@/types";

export default function WishlistPage() {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => {
        const items = (data.items ?? []).map((item: { product: Parameters<typeof toProductCard>[0] }) => toProductCard(item.product));
        setProducts(items);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="h-6 w-6 text-charcoal-soft/60" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-8">
      <h1 className="mb-6 font-serif text-xl font-semibold uppercase tracking-wide">My Wishlist ({products.length})</h1>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="mb-4 text-sm text-charcoal-soft">Your wishlist is empty</p>
          <Button asChild>
            <Link href="/new-in">Discover Products</Link>
          </Button>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
