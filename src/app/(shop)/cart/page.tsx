"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice, cn } from "@/lib/utils";
import type { CartItemData } from "@/types";

export default function CartPage() {
  const [items, setItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);

  async function loadCart() {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setItems(data.items ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    void loadCart();
  }, []);

  async function updateQuantity(id: string, quantity: number) {
    if (quantity < 1) return removeItem(id);
    setPendingItemId(id);
    try {
      await fetch(`/api/cart/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      await loadCart();
    } finally {
      setPendingItemId(null);
    }
  }

  async function removeItem(id: string) {
    setPendingItemId(id);
    try {
      await fetch(`/api/cart/items/${id}`, { method: "DELETE" });
      await loadCart();
    } finally {
      setPendingItemId(null);
    }
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = subtotal >= 5000 || subtotal === 0 ? 0 : 600;
  const total = subtotal + shippingFee;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="h-6 w-6 text-charcoal-soft/60" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="mb-4 text-lg font-semibold">Your bag is empty</p>
        <Button asChild>
          <Link href="/new-in">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-8">
      <h1 className="mb-6 font-serif text-xl font-semibold uppercase tracking-wide">Shopping Bag ({items.length})</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ul className="flex flex-col divide-y divide-line">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-5">
                <Link href={`/products/${item.slug}`} className="relative h-32 w-24 shrink-0 overflow-hidden rounded-sm bg-cream-dark">
                  <Image src={item.image} alt={item.productName} fill className="object-cover" sizes="100px" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <Link href={`/products/${item.slug}`} className="text-sm text-charcoal hover:text-gold-dark">
                    {item.productName}
                  </Link>
                  {(item.color || item.size) && (
                    <p className="mt-1 text-xs text-charcoal-soft/60">{[item.color, item.size].filter(Boolean).join(" / ")}</p>
                  )}
                  <div className="mt-auto flex items-center justify-between">
                    <div className={cn("flex h-9 items-center rounded-sm border border-line", pendingItemId === item.id && "opacity-50")}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={pendingItemId === item.id}
                        className="flex h-full w-8 items-center justify-center disabled:pointer-events-none"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="flex w-8 items-center justify-center text-center text-sm">
                        {pendingItemId === item.id ? <Spinner className="h-3.5 w-3.5" /> : item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={pendingItemId === item.id}
                        className="flex h-full w-8 items-center justify-center disabled:pointer-events-none"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="text-base font-bold text-charcoal">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  disabled={pendingItemId === item.id}
                  aria-label="Remove item"
                  className="self-start text-charcoal-soft/60 hover:text-gold-dark disabled:pointer-events-none disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-fit rounded-sm border border-line bg-paper p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">Order Summary</h2>

          <div className="mb-4 flex gap-2">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon code"
              className="h-10 flex-1 rounded-sm border border-line px-3 text-sm outline-none focus:border-gold-dark"
            />
            <Button variant="outline" size="sm" className="h-10">Apply</Button>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-charcoal-soft">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-soft">Shipping</span>
              <span>{shippingFee === 0 ? "Free" : formatPrice(shippingFee)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-line pt-2 text-base font-bold text-charcoal">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <Button asChild size="lg" className="mt-5 w-full">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
