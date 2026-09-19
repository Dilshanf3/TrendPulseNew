import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const wishlist = await prisma.wishlist.findUnique({ where: { userId: session.user.id } });
  if (!wishlist) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.wishlistItem.deleteMany({ where: { id, wishlistId: wishlist.id } });
  return NextResponse.json({ success: true });
}
