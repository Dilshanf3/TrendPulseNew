"use client";

import { useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export function CartButton() {
  const itemCount = useCart((s) => s.itemCount);
  const setOpen = useCart((s) => s.setOpen);
  const status = useCart((s) => s.status);
  const load = useCart((s) => s.load);

  // Populate the badge on first paint rather than waiting for the drawer to open.
  useEffect(() => {
    if (status === "idle") void load();
  }, [status, load]);

  return (
    <button
      aria-label={itemCount > 0 ? `Shopping bag, ${itemCount} items` : "Shopping bag"}
      onClick={() => setOpen(true)}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-muted"
    >
      <ShoppingBag className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
          {itemCount}
        </span>
      )}
    </button>
  );
}
