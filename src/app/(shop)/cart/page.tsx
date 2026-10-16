"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/section-header";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { FreeShippingProgress, SummaryRows } from "@/components/cart/order-summary";
import { getShippingFee } from "@/lib/pricing";

export default function CartPage() {
  const { items, itemCount, subtotal, status, load } = useCart();

  useEffect(() => {
    void load();
  }, [load]);

  if (status !== "ready") {
    return (
      <div className="flex justify-center py-32">
        <Spinner className="h-6 w-6 text-muted" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-10">
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Looks like you haven't added anything yet."
          action={{ label: "Start shopping", href: "/new-in" }}
        />
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <PageHeader title="Your bag" description={`${itemCount} ${itemCount === 1 ? "item" : "items"}`} />

      <div className="grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-16">
        <ul className="flex flex-col divide-y divide-border [&>li]:py-6 [&>li:first-child]:pt-0">
          {items.map((item) => (
            <CartLineItem key={item.id} item={item} />
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-6 lg:sticky lg:top-24">
          <h2 className="mb-5 text-base font-semibold">Order summary</h2>
          <div className="mb-6">
            <FreeShippingProgress subtotal={subtotal} />
          </div>
          <SummaryRows subtotal={subtotal} shippingFee={getShippingFee(subtotal)} />
          <Button asChild size="lg" className="mt-6 w-full">
            <Link href="/checkout">Checkout</Link>
          </Button>
          <p className="mt-3 text-center text-xs text-muted">Express delivery can be chosen at checkout.</p>
        </aside>
      </div>
    </div>
  );
}
