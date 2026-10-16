import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { calcDiscountPercent } from "@/lib/utils";
import type { ListProductsParams } from "./product-service";

/**
 * Everything the storefront shows as navigation or merchandising is derived from the database,
 * so adding a product/category/banner in the admin portal is all it takes to change the site.
 * Functions are memoised per request because the header, footer and page often need the same data.
 */

const published = { status: "PUBLISHED" } satisfies Prisma.ProductWhereInput;

export type ShopCategory = { slug: string; name: string; description: string | null; image: string | null };

/** Top-level categories that currently have published products (directly or via a sub-category). */
export const getShopCategories = cache(async (): Promise<ShopCategory[]> => {
  const categories = await prisma.category.findMany({
    where: {
      parentId: null,
      isActive: true,
      OR: [{ products: { some: published } }, { children: { some: { isActive: true, products: { some: published } } } }],
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { slug: true, name: true, description: true, image: true },
  });

  // Fall back to a product photo from the category when it has no image of its own.
  return Promise.all(
    categories.map(async (c) => {
      if (c.image) return c;
      const img = await prisma.productImage.findFirst({
        where: { product: { ...published, category: { OR: [{ slug: c.slug }, { parent: { slug: c.slug } }] } } },
        orderBy: [{ product: { isFeatured: "desc" } }, { product: { createdAt: "desc" } }, { sortOrder: "asc" }],
        select: { url: true },
      });
      return { ...c, image: img?.url ?? null };
    })
  );
});

/** On-sale products and the deepest discount — drives the Sale nav link and home banner. */
export const getSaleSummary = cache(async () => {
  const onSale = await prisma.product.findMany({
    where: { ...published, salePrice: { not: null } },
    select: { basePrice: true, salePrice: true, images: { orderBy: { sortOrder: "asc" }, take: 1, select: { url: true } } },
  });
  const ranked = onSale
    .map((p) => ({ discount: calcDiscountPercent(Number(p.basePrice), Number(p.salePrice)), image: p.images[0]?.url ?? null }))
    .sort((a, b) => b.discount - a.discount);
  return { count: onSale.length, maxDiscount: ranked[0]?.discount ?? 0, image: ranked[0]?.image ?? null };
});

/** Hero content: the active HERO banner if one is set in admin, otherwise featured product photos. */
export async function getHeroContent() {
  const now = new Date();
  const banner = await prisma.banner.findFirst({
    where: {
      placement: "HERO",
      isActive: true,
      AND: [{ OR: [{ startDate: null }, { startDate: { lte: now } }] }, { OR: [{ endDate: null }, { endDate: { gte: now } }] }],
    },
    orderBy: { sortOrder: "asc" },
  });

  const productImages = await prisma.productImage.findMany({
    where: { sortOrder: 0, product: published },
    orderBy: [{ product: { isFeatured: "desc" } }, { product: { createdAt: "desc" } }],
    take: 2,
    select: { url: true, altText: true },
  });

  return {
    title: banner?.title ?? null,
    subtitle: banner?.subtitle ?? null,
    link: banner?.link ?? null,
    images: banner ? [{ url: banner.image, altText: banner.title }, ...productImages.slice(0, 1)] : productImages,
  };
}

/** Best-selling, then newest, products — shown as search suggestions before the shopper types. */
export const getPopularProducts = cache(async (take = 5) =>
  prisma.product.findMany({
    where: published,
    orderBy: [{ soldCount: "desc" }, { createdAt: "desc" }],
    take,
    select: { id: true, name: true, slug: true },
  })
);

/** Sizes and colours that actually exist among the products a listing can show. */
export async function getListingFacets(scope: Pick<ListProductsParams, "categorySlug" | "search" | "isNew" | "onSale">) {
  const product: Prisma.ProductWhereInput = { ...published };
  if (scope.categorySlug) product.category = { OR: [{ slug: scope.categorySlug }, { parent: { slug: scope.categorySlug } }] };
  if (scope.search) {
    product.OR = [
      { name: { contains: scope.search, mode: "insensitive" } },
      { description: { contains: scope.search, mode: "insensitive" } },
    ];
  }
  if (scope.isNew) product.isNew = true;
  if (scope.onSale) product.salePrice = { not: null };

  // Variant ids are created in the order sizes were entered (S, M, L…), which keeps sizes in a natural order.
  const variants = await prisma.productVariant.findMany({
    where: { isActive: true, product },
    orderBy: { id: "asc" },
    select: { size: true, color: true, colorHex: true },
  });

  const sizes = [...new Set(variants.map((v) => v.size).filter((s): s is string => !!s))];
  const colors = [
    ...new Map(variants.filter((v) => v.color).map((v) => [v.color!, { name: v.color!, hex: v.colorHex ?? "#cccccc" }])).values(),
  ];
  const hasSale = scope.onSale ? false : (await prisma.product.count({ where: { ...product, salePrice: { not: null } } })) > 0;
  return { sizes, colors, hasSale };
}
