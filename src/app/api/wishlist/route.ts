import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { addToWishlist, getWishlistProducts } from "@/server/services/wishlist-service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ products: [] });
  }
  return NextResponse.json({ products: await getWishlistProducts(session.user.id) });
}

const addSchema = z.object({ productId: z.string().min(1) });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const item = await addToWishlist(session.user.id, parsed.data.productId);
  return NextResponse.json({ item }, { status: 201 });
}
