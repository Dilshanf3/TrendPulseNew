import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional().nullable(),
  quantity: z.coerce.number().int().min(1).max(20).default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().min(1).max(20),
});

export const checkoutSchema = z.object({
  guestEmail: z.string().email().optional().or(z.literal("")),
  fullName: z.string().min(2),
  phone: z.string().min(6),
  line1: z.string().min(2),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().default("Sri Lanka"),
  shippingMethod: z.enum(["Standard", "Express"]).default("Standard"),
  paymentMethod: z.enum(["COD", "CARD"]).default("COD"),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
