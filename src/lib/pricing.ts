/**
 * Pricing rules shared by the client (cart/checkout summaries) and the server (order creation),
 * so the total a shopper sees is always the total they are charged.
 */

export const FREE_SHIPPING_THRESHOLD = 5000;

export const SHIPPING_METHODS = {
  Standard: { label: "Standard", eta: "5–7 business days", fee: 600 },
  Express: { label: "Express", eta: "2–3 business days", fee: 1200 },
} as const;

export type ShippingMethod = keyof typeof SHIPPING_METHODS;

export function getShippingFee(subtotal: number, method: ShippingMethod = "Standard") {
  if (method === "Express") return SHIPPING_METHODS.Express.fee;
  return subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_METHODS.Standard.fee;
}

type Priced = { salePrice: unknown; basePrice?: unknown; price?: unknown };

/** Unit price for a cart line: a variant's own price wins over the product's. */
export function getUnitPrice(product: Priced, variant?: Priced | null) {
  return Number(variant?.salePrice ?? variant?.price ?? product.salePrice ?? product.basePrice);
}
