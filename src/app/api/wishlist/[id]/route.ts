import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { removeFromWishlist } from "@/server/services/wishlist-service";

/** Removes a product from the shopper's wishlist. `id` is the product id. */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await removeFromWishlist(session.user.id, id);
  return NextResponse.json({ success: true });
}
