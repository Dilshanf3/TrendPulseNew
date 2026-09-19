"use client";

import { ShoppingBag } from "lucide-react";
import { useCartDrawer } from "@/hooks/use-cart-drawer";
import { useCartStore } from "@/hooks/use-cart-store";

export function CartButton() {
  const { open } = useCartDrawer();
  const itemCount = useCartStore((s) => s.itemCount);

  return (
    <button aria-label="Cart" onClick={open} className="relative flex h-10 w-10 items-center justify-center text-charcoal-soft transition-colors hover:text-gold-dark">
      <ShoppingBag className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
          {itemCount}
        </span>
      )}
    </button>
  );
}
