import type { Product, ProductImage, ProductVariant, Category, Review } from "@prisma/client";

export type ProductWithRelations = Product & {
  images: ProductImage[];
  variants: ProductVariant[];
  category: Category;
};

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice: number | null;
  isNew: boolean;
  ratingAvg: number;
  ratingCount: number;
  image: string;
  hoverImage: string | null;
  colors: string[];
};

export type ReviewWithUser = Review & {
  user: { name: string | null; image: string | null };
  images: { id: string; url: string }[];
};

export type CartItemData = {
  id: string;
  productId: string;
  variantId: string | null;
  productName: string;
  slug: string;
  image: string;
  color: string | null;
  size: string | null;
  price: number;
  quantity: number;
  stock: number;
};

export type FilterState = {
  categories: string[];
  sizes: string[];
  colors: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  onSale?: boolean;
};

export type SortOption =
  | "recommended"
  | "newest"
  | "popular"
  | "rating"
  | "price-asc"
  | "price-desc"
  | "discount";
