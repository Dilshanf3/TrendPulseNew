import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkoutSchema } from "@/lib/validations/cart";
import { createOrderFromCart } from "@/server/services/order-service";

export async function POST(req: NextRequest) {
  const session = await auth();

  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid checkout data" }, { status: 400 });
  }

  if (!session?.user?.id && !parsed.data.guestEmail) {
    return NextResponse.json({ error: "Email is required for guest checkout" }, { status: 400 });
  }

  try {
    const order = await createOrderFromCart(session?.user?.id ?? null, [], parsed.data);
    return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "EMPTY_CART") {
      return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
    }
    if (err instanceof Error && err.message.startsWith("INSUFFICIENT_STOCK")) {
      const productName = err.message.split(":")[1] ?? "an item";
      return NextResponse.json({ error: `Not enough stock for ${productName}` }, { status: 409 });
    }
    return NextResponse.json({ error: "Could not process your order" }, { status: 500 });
  }
}
