"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CartLineItem } from "./cart-line-item";
import { FreeShippingProgress } from "./order-summary";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { isOpen, setOpen, items, itemCount, subtotal, status } = useCart();
  const close = () => setOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" title={itemCount > 0 ? `Your bag (${itemCount})` : "Your bag"}>
        {status !== "ready" ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner className="h-5 w-5 text-muted" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-muted">
              <ShoppingBag className="h-6 w-6" />
            </span>
            <p className="font-medium">Your bag is empty</p>
            <p className="mt-1 text-sm text-muted">Pieces you add will show up here.</p>
            <Button asChild className="mt-6" onClick={close}>
              <Link href="/new-in">Shop new arrivals</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="border-b border-border px-5 py-4">
              <FreeShippingProgress subtotal={subtotal} />
            </div>
            <ul className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-5">
              {items.map((item) => (
                <CartLineItem key={item.id} item={item} size="sm" onNavigate={close} />
              ))}
            </ul>
            <div className="border-t border-border px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
              <div className="mb-1 flex items-center justify-between text-base font-semibold">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="mb-4 text-xs text-muted">Shipping calculated at checkout.</p>
              <div className="flex flex-col gap-2">
                <Button asChild size="lg" onClick={close}>
                  <Link href="/checkout">Checkout</Link>
                </Button>
                <Button asChild variant="ghost" onClick={close}>
                  <Link href="/cart">View bag</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
