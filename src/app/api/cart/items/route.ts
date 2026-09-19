import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { addToCartSchema } from "@/lib/validations/cart";
import { addToCart } from "@/server/services/cart-service";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in to add items to your cart" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = addToCartSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const item = await addToCart(session.user.id, parsed.data.productId, parsed.data.variantId ?? null, parsed.data.quantity);
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "INSUFFICIENT_STOCK") {
      return NextResponse.json({ error: "Not enough stock available" }, { status: 409 });
    }
    return NextResponse.json({ error: "Could not add to cart" }, { status: 500 });
  }
}
