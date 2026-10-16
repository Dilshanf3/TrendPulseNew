import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";

export function FreeShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  return (
    <div>
      <p className="mb-2 text-xs text-muted">
        {remaining > 0 ? (
          <>
            Add <span className="font-medium text-foreground">{formatPrice(remaining)}</span> more for free standard shipping
          </>
        ) : (
          <span className="font-medium text-emerald-700">You&apos;ve unlocked free standard shipping</span>
        )}
      </p>
      <div className="h-1 overflow-hidden rounded-full bg-surface-muted">
        <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function SummaryRows({ subtotal, shippingFee }: { subtotal: number; shippingFee: number | null }) {
  const total = subtotal + (shippingFee ?? 0);
  return (
    <dl className="flex flex-col gap-2.5 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted">Subtotal</dt>
        <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">Shipping</dt>
        <dd className="tabular-nums">
          {shippingFee === null ? "Calculated at checkout" : shippingFee === 0 ? "Free" : formatPrice(shippingFee)}
        </dd>
      </div>
      <div className="mt-1 flex justify-between border-t border-border pt-3.5 text-base font-semibold">
        <dt>Total</dt>
        <dd className="tabular-nums">{formatPrice(total)}</dd>
      </div>
    </dl>
  );
}
