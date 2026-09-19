"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartDrawer } from "@/hooks/use-cart-drawer";
import { useCartStore } from "@/hooks/use-cart-store";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice, cn } from "@/lib/utils";

async function fetchCart() {
  const res = await fetch("/api/cart");
  if (!res.ok) return null;
  return res.json();
}

export function CartDrawer() {
  const { isOpen, close } = useCartDrawer();
  const { items, subtotal, setCart, setLoading, isLoading } = useCartStore();
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchCart()
        .then((data) => data && setCart(data.items))
        .finally(() => setLoading(false));
    }
  }, [isOpen, setCart, setLoading]);

  async function updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) return removeItem(itemId);
    setPendingItemId(itemId);
    try {
      await fetch(`/api/cart/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const data = await fetchCart();
      if (data) setCart(data.items);
    } finally {
      setPendingItemId(null);
    }
  }

  async function removeItem(itemId: string) {
    setPendingItemId(itemId);
    try {
      await fetch(`/api/cart/items/${itemId}`, { method: "DELETE" });
      const data = await fetchCart();
      if (data) setCart(data.items);
    } finally {
      setPendingItemId(null);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-charcoal/40" onClick={close} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper">
        <div className="flex h-14 items-center justify-between border-b border-line px-4">
          <span className="font-serif text-sm font-semibold uppercase tracking-wide text-charcoal">Shopping Bag ({items.length})</span>
          <button onClick={close} aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Spinner className="h-5 w-5 text-charcoal-soft/60" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="mb-4 text-sm text-charcoal-soft/70">Your bag is empty</p>
              <Button onClick={close} asChild>
                <Link href="/new-in">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <Link href={`/products/${item.slug}`} onClick={close} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-cream-dark">
                    <Image src={item.image} alt={item.productName} fill className="object-cover" sizes="80px" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <Link href={`/products/${item.slug}`} onClick={close} className="line-clamp-2 text-xs text-charcoal hover:underline">
                      {item.productName}
                    </Link>
                    {(item.color || item.size) && (
                      <p className="mt-0.5 text-[11px] text-charcoal-soft/60">
                        {[item.color, item.size].filter(Boolean).join(" / ")}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between">
                      <div className={cn("flex h-7 items-center rounded-sm border border-line", pendingItemId === item.id && "opacity-50")}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={pendingItemId === item.id}
                          className="flex h-full w-6 items-center justify-center disabled:pointer-events-none"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="flex w-6 items-center justify-center text-center text-xs">
                          {pendingItemId === item.id ? <Spinner className="h-3 w-3" /> : item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={pendingItemId === item.id}
                          className="flex h-full w-6 items-center justify-center disabled:pointer-events-none"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-charcoal">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={pendingItemId === item.id}
                    aria-label="Remove item"
                    className="self-start text-charcoal-soft/50 hover:text-gold-dark disabled:pointer-events-none disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line p-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-medium text-charcoal">Subtotal</span>
              <span className="font-bold text-charcoal">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild size="lg" onClick={close}>
                <Link href="/checkout">Checkout</Link>
              </Button>
              <Button asChild variant="outline" size="lg" onClick={close}>
                <Link href="/cart">View Cart</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
