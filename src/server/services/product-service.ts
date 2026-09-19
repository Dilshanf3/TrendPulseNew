import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import type { SortOption } from "@/types";

type ListProductsParams = {
  categorySlug?: string;
  search?: string;
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  onSale?: boolean;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
};

function sortToOrderBy(sort?: SortOption): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "newest":
      return { createdAt: "desc" };
    case "popular":
      return { soldCount: "desc" };
    case "rating":
      return { ratingAvg: "desc" };
    case "price-asc":
      return { basePrice: "asc" };
    case "price-desc":
      return { basePrice: "desc" };
    default:
      return { createdAt: "desc" };
  }
}

export async function listProducts(params: ListProductsParams) {
  const {
    categorySlug,
    search,
    sizes,
    colors,
    minPrice,
    maxPrice,
    rating,
    onSale,
    sort,
    page = 1,
    pageSize = 24,
  } = params;

  const where: Prisma.ProductWhereInput = {
    status: "PUBLISHED",
  };

  if (categorySlug) {
    where.category = {
      OR: [{ slug: categorySlug }, { parent: { slug: categorySlug } }],
    };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.basePrice = {
      ...(minPrice !== undefined ? { gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
    };
  }

  if (rating !== undefined) {
    where.ratingAvg = { gte: rating };
  }

  if (onSale) {
    where.salePrice = { not: null };
  }

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
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        category: true,
      },
      orderBy:
        sort === "discount"
          ? [{ salePrice: "asc" }, { createdAt: "desc" }]
          : sortToOrderBy(sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, pageSize, pageCount: Math.ceil(total / pageSize) };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
      category: true,
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

export async function getRelatedProducts(categoryId: string, excludeId: string, take = 8) {
  return prisma.product.findMany({
    where: { categoryId, id: { not: excludeId }, status: "PUBLISHED" },
    include: { images: { orderBy: { sortOrder: "asc" } }, variants: true, category: true },
    take,
    orderBy: { soldCount: "desc" },
  });
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
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 }, variants: true, category: true },
    take,
  });
}
