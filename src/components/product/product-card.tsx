"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Star } from "lucide-react";
import { cn, formatPrice, calcDiscountPercent } from "@/lib/utils";
import type { ProductCardData } from "@/types";

export function ProductCard({ product }: { product: ProductCardData }) {
  const [wishlisted, setWishlisted] = useState(false);
  const discount = product.salePrice ? calcDiscountPercent(product.basePrice, product.salePrice) : 0;

  return (
    <div className="group relative flex flex-col">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[3/4] w-full overflow-hidden rounded-sm bg-cream-dark shadow-sm transition-shadow duration-300 group-hover:shadow-md">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className={cn(
            "object-cover transition-all duration-500 group-hover:scale-[1.03]",
            product.hoverImage && "group-hover:opacity-0"
          )}
        />
        {product.hoverImage && (
          <Image
            src={product.hoverImage}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover opacity-0 transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
          />
        )}

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="rounded-sm bg-charcoal px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cream">New</span>
          )}
          {discount > 0 && (
            <span className="rounded-sm bg-gold px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">-{discount}%</span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            setWishlisted((w) => !w);
          }}
          aria-label="Add to wishlist"
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 shadow-sm backdrop-blur-sm transition-transform hover:scale-110"
        >
          <Heart className={cn("h-4 w-4", wishlisted ? "fill-gold text-gold" : "text-charcoal-soft")} />
        </button>

        <div className="absolute inset-x-0 bottom-0 hidden translate-y-full bg-paper/95 py-2 text-center text-xs font-medium uppercase tracking-wide text-charcoal transition-transform duration-200 group-hover:translate-y-0 sm:block">
          Quick View
        </div>
      </Link>

      <div className="mt-2.5 flex flex-col gap-0.5 px-0.5">
        <Link href={`/products/${product.slug}`} className="line-clamp-2 text-[13px] leading-snug text-charcoal-soft transition-colors hover:text-charcoal">
          {product.name}
        </Link>

        {product.ratingCount > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-charcoal-soft/70">
            <Star className="h-3 w-3 fill-gold text-gold" />
            <span>{product.ratingAvg.toFixed(1)}</span>
            <span>({product.ratingCount})</span>
          </div>
        )}

        <div className="flex items-baseline gap-1.5">
          {product.salePrice ? (
            <>
              <span className="text-sm font-bold text-gold-dark">{formatPrice(product.salePrice)}</span>
              <span className="text-xs text-charcoal-soft/50 line-through">{formatPrice(product.basePrice)}</span>
            </>
          ) : (
            <span className="text-sm font-bold text-charcoal">{formatPrice(product.basePrice)}</span>
          )}
        </div>

        {product.colors.length > 0 && (
          <div className="mt-0.5 flex items-center gap-1">
            {product.colors.slice(0, 5).map((color, i) => (
              <span
                key={i}
                className="h-3 w-3 rounded-full border border-line"
                style={{ backgroundColor: color }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-charcoal-soft/60">+{product.colors.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
