import type { ProductCardData } from "@/types";
import { FALLBACK_IMAGE } from "@/lib/image-pool";

type RawProduct = {
  id: string;
  name: string;
  slug: string;
  basePrice: unknown;
  salePrice: unknown;
  isNew: boolean;
  ratingAvg: unknown;
  ratingCount: number;
  images: { url: string; isHover: boolean }[];
  variants: { color: string | null; colorHex: string | null }[];
};

export function toProductCard(product: RawProduct): ProductCardData {
  const sorted = [...product.images];
  const primary = sorted.find((i) => !i.isHover) ?? sorted[0];
  const hover = sorted.find((i) => i.isHover && i.url !== primary?.url);

  const colors = Array.from(
    new Map(
      product.variants
        .filter((v) => v.color && v.colorHex)
        .map((v) => [v.color, v.colorHex as string])
    ).values()
  );

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    basePrice: Number(product.basePrice),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    isNew: product.isNew,
    ratingAvg: Number(product.ratingAvg),
    ratingCount: product.ratingCount,
    image: primary?.url ?? FALLBACK_IMAGE,
    hoverImage: hover?.url ?? null,
    colors,
  };
}
