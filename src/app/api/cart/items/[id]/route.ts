import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateCartItemSchema } from "@/lib/validations/cart";
import { updateCartItemQuantity, removeCartItem } from "@/server/services/cart-service";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateCartItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const item = await updateCartItemQuantity(session.user.id, id, parsed.data.quantity);
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "Could not update item" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await removeCartItem(session.user.id, id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not remove item" }, { status: 400 });
  }
}
