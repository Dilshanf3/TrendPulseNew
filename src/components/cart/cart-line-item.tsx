"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";
import type { CartItemData } from "@/types";

export function CartLineItem({
  item,
  size = "default",
  onNavigate,
}: {
  item: CartItemData;
  size?: "default" | "sm";
  onNavigate?: () => void;
}) {
  const pendingItemId = useCart((s) => s.pendingItemId);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const pending = pendingItemId === item.id;
  const href = `/products/${item.slug}`;

  return (
    <li className="flex gap-4">
      <Link
        href={href}
        onClick={onNavigate}
        className={cn(
          "relative shrink-0 overflow-hidden rounded-lg bg-surface-muted",
          size === "sm" ? "h-28 w-21" : "h-36 w-27"
        )}
      >
        <Image src={item.image} alt={item.productName} fill className="object-cover" sizes="120px" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={href} onClick={onNavigate} className="line-clamp-2 text-sm font-medium text-foreground hover:underline">
              {item.productName}
            </Link>
            {(item.color || item.size) && (
              <p className="mt-0.5 text-xs text-muted">{[item.color, item.size].filter(Boolean).join(" · ")}</p>
            )}
          </div>
          <button
            onClick={() => removeItem(item.id)}
            disabled={pending}
            aria-label={`Remove ${item.productName}`}
            className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-foreground disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper
            size="sm"
            min={0}
            max={Math.min(20, item.stock)}
            value={item.quantity}
            pending={pending}
            onChange={(q) => updateQuantity(item.id, q)}
          />
          <span className="text-sm font-medium tabular-nums">{formatPrice(item.price * item.quantity)}</span>
        </div>
      </div>
    </li>
  );
}
