"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function StickyMobileActions({
  price,
  onAddToCart,
}: {
  price: number;
  onAddToCart: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-line bg-paper p-3 shadow-sm lg:hidden">
      <span className="shrink-0 text-lg font-bold text-charcoal">{formatPrice(price)}</span>
      <Button className="flex-1" onClick={onAddToCart}>
        Add to Cart
      </Button>
      <Button variant="outline" className="flex-1">
        Buy Now
      </Button>
    </div>
  );
}
