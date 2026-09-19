"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid/product-grid";
import type { ProductCardData } from "@/types";

function useCountdown(target: Date) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initialize countdown from wall-clock time on mount
    setRemaining(target.getTime() - Date.now());
    const interval = setInterval(() => {
      setRemaining(target.getTime() - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

  const clamped = Math.max(remaining, 0);
  const hours = Math.floor(clamped / (1000 * 60 * 60));
  const minutes = Math.floor((clamped / (1000 * 60)) % 60);
  const seconds = Math.floor((clamped / 1000) % 60);

  return { hours, minutes, seconds };
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-9 min-w-9 items-center justify-center rounded-sm bg-charcoal px-2 text-sm font-bold text-cream">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1 text-[10px] uppercase text-charcoal-soft/70">{label}</span>
    </div>
  );
}

export function FlashSaleSection({ products }: { products: ProductCardData[] }) {
  const [endsAt] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 8);
    return d;
  });
  const { hours, minutes, seconds } = useCountdown(endsAt);

  if (products.length === 0) return null;

  return (
    <section className="bg-cream-dark/60 py-10">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl font-semibold tracking-wide text-gold-dark sm:text-3xl">Flash Sale</h2>
            <div className="flex items-center gap-1">
              <TimeBox value={hours} label="hrs" />
              <span className="pb-4 text-lg font-bold text-gold-dark">:</span>
              <TimeBox value={minutes} label="min" />
              <span className="pb-4 text-lg font-bold text-gold-dark">:</span>
              <TimeBox value={seconds} label="sec" />
            </div>
          </div>
          <Link href="/sale" className="text-xs font-semibold uppercase tracking-wide text-gold-dark underline decoration-gold underline-offset-4 hover:text-charcoal">
            View All
          </Link>
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
