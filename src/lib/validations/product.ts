import { z } from "zod";

export const productVariantSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(1),
  color: z.string().optional(),
  colorHex: z.string().optional(),
  size: z.string().optional(),
  price: z.coerce.number().positive(),
  salePrice: z.coerce.number().positive().optional().nullable(),
  stock: z.coerce.number().int().min(0),
  image: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  description: z.string().min(1),
  details: z.string().optional(),
  material: z.string().optional(),
  careInstructions: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
  basePrice: z.coerce.number().positive(),
  salePrice: z.coerce.number().positive().optional().nullable(),
  isNew: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  categoryId: z.string().min(1),
  brandId: z.string().optional().nullable(),
  images: z.array(z.object({ url: z.string(), altText: z.string().optional(), isHover: z.boolean().optional() })).default([]),
  variants: z.array(productVariantSchema).default([]),
  tagIds: z.array(z.string()).default([]),
});

export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export type CategoryInput = z.infer<typeof categorySchema>;
