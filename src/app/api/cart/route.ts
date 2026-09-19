import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOrCreateCart } from "@/server/services/cart-service";
import { FALLBACK_IMAGE } from "@/lib/image-pool";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ items: [] });
  }

  const cart = await getOrCreateCart(session.user.id);

  const items = cart.items.map((item) => {
    const price = Number(item.variant?.salePrice ?? item.variant?.price ?? item.product.salePrice ?? item.product.basePrice);
    return {
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      productName: item.product.name,
      slug: item.product.slug,
      image: item.product.images[0]?.url ?? FALLBACK_IMAGE,
      color: item.variant?.color ?? null,
      size: item.variant?.size ?? null,
      price,
      quantity: item.quantity,
      stock: item.variant ? item.variant.stock - item.variant.reservedStock : 999,
    };
  });

  return NextResponse.json({ items });
}
