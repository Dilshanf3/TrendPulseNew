import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { WishlistButton } from "./wishlist-button";
import { cn, calcDiscountPercent } from "@/lib/utils";
import type { ProductCardData } from "@/types";

const IMAGE_SIZES = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw";

export function ProductCard({ product, saved = false }: { product: ProductCardData; saved?: boolean }) {
  const discount = product.salePrice ? calcDiscountPercent(product.basePrice, product.salePrice) : 0;
  const href = `/products/${product.slug}`;

  return (
    <article className="group relative">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-muted">
        <Image
          src={product.image}
          alt=""
          fill
          sizes={IMAGE_SIZES}
          className={cn(
            "object-cover transition-[opacity,transform] duration-500 group-hover:scale-[1.03]",
            product.hoverImage && "group-hover:opacity-0"
          )}
        />
        {product.hoverImage && (
          <Image
            src={product.hoverImage}
            alt=""
            fill
            sizes={IMAGE_SIZES}
            className="object-cover opacity-0 transition-[opacity,transform] duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
          />
        )}

        <div className="absolute left-3 top-3 flex gap-1.5">
          {discount > 0 && <Badge variant="sale">−{discount}%</Badge>}
          {product.isNew && <Badge>New</Badge>}
        </div>

        {/* z-10 lifts the heart above the card's stretched link */}
        <WishlistButton productId={product.id} initialSaved={saved} className="absolute right-3 top-3 z-10" />
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <h3 className="line-clamp-1 text-sm text-foreground">
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        <Price basePrice={product.basePrice} salePrice={product.salePrice} />
        {product.colors.length > 1 && (
          <div className="mt-0.5 flex items-center gap-1.5" aria-label={`${product.colors.length} colours`}>
            {product.colors.slice(0, 5).map((color) => (
              <span key={color} className="h-3 w-3 rounded-full ring-1 ring-border" style={{ backgroundColor: color }} />
            ))}
            {product.colors.length > 5 && <span className="text-[11px] text-muted">+{product.colors.length - 5}</span>}
          </div>
        )}
      </div>
    </article>
  );
}
