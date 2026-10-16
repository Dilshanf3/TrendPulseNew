import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { toProductCard } from "@/lib/utils/map-product";
import type { SortOption } from "@/types";

/** The minimal relations a product card needs. */
const cardInclude = {
  images: { orderBy: { sortOrder: "asc" }, select: { url: true, isHover: true } },
  variants: { select: { color: true, colorHex: true } },
} satisfies Prisma.ProductInclude;

export type ListProductsParams = {
  categorySlug?: string;
  search?: string;
  sizes?: string[];
  colors?: string[];
  onSale?: boolean;
  isNew?: boolean;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
};

function sortToOrderBy(sort?: SortOption): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "popular":
      return [{ soldCount: "desc" }, { createdAt: "desc" }];
    case "rating":
      return [{ ratingAvg: "desc" }, { ratingCount: "desc" }];
    case "price-asc":
      return [{ basePrice: "asc" }];
    case "price-desc":
      return [{ basePrice: "desc" }];
    default:
      return [{ createdAt: "desc" }];
  }
}

export async function listProducts(params: ListProductsParams) {
  const { categorySlug, search, sizes, colors, onSale, isNew, sort, page = 1, pageSize = 24 } = params;

  const where: Prisma.ProductWhereInput = { status: "PUBLISHED" };

  if (categorySlug) {
    where.category = { OR: [{ slug: categorySlug }, { parent: { slug: categorySlug } }] };
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (onSale) where.salePrice = { not: null };
  if (isNew) where.isNew = true;
  if (sizes?.length || colors?.length) {
    where.variants = {
      some: {
        ...(sizes?.length ? { size: { in: sizes } } : {}),
        ...(colors?.length ? { color: { in: colors } } : {}),
      },
    };
  }

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: cardInclude,
      orderBy: sortToOrderBy(sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return { items: items.map(toProductCard), total, page, pageCount: Math.max(1, Math.ceil(total / pageSize)) };
}

/**
 * Merchandising order, controlled from the database: featured products first, then by the
 * top-level category's sortOrder (so e.g. clothing and beauty lead), then newest.
 */
export const MERCHANDISING_ORDER: Prisma.ProductOrderByWithRelationInput[] = [
  { isFeatured: "desc" },
  { category: { parent: { sortOrder: "asc" } } },
  { createdAt: "desc" },
];

const COLLECTIONS = {
  "new-arrivals": { where: { isNew: true }, orderBy: MERCHANDISING_ORDER },
  "best-sellers": { where: { isBestSeller: true }, orderBy: [{ soldCount: "desc" }, ...MERCHANDISING_ORDER] },
} satisfies Record<string, { where: Prisma.ProductWhereInput; orderBy: Prisma.ProductOrderByWithRelationInput[] }>;

export async function getCollection(name: keyof typeof COLLECTIONS, take = 8) {
  const { where, orderBy } = COLLECTIONS[name];
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED", ...where },
    include: cardInclude,
    orderBy,
    take,
  });
  return products.map(toProductCard);
}

/** A top-level category plus its active sub-categories that have products (the listing's chips). */
export async function getCategoryWithChildren(slug: string) {
  return prisma.category.findFirst({
    where: { slug, parentId: null, isActive: true },
    include: {
      children: {
        where: { isActive: true, products: { some: { status: "PUBLISHED" } } },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: { slug: true, name: true },
      },
    },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
      category: { include: { parent: true } },
      brand: true,
      reviews: {
        include: {
          user: { select: { name: true, image: true } },
          images: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getRelatedProducts(categoryId: string, excludeId: string, take = 4) {
  const products = await prisma.product.findMany({
    where: { categoryId, id: { not: excludeId }, status: "PUBLISHED" },
    include: cardInclude,
    take,
    orderBy: { soldCount: "desc" },
  });
  return products.map(toProductCard);
}

export async function searchProducts(query: string, take = 10) {
  if (!query.trim()) return [];
  return prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    select: { id: true, name: true, slug: true },
    take,
  });
}
