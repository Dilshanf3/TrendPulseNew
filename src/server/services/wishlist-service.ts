import { cache } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { toProductCard } from "@/lib/utils/map-product";

async function getOrCreateWishlist(userId: string) {
  return prisma.wishlist.upsert({ where: { userId }, update: {}, create: { userId } });
}

export async function addToWishlist(userId: string, productId: string) {
  const wishlist = await getOrCreateWishlist(userId);
  return prisma.wishlistItem.upsert({
    where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
    update: {},
    create: { wishlistId: wishlist.id, productId },
  });
}

export async function removeFromWishlist(userId: string, productId: string) {
  return prisma.wishlistItem.deleteMany({ where: { productId, wishlist: { userId } } });
}

export async function getWishlistProducts(userId: string) {
  const items = await prisma.wishlistItem.findMany({
    where: { wishlist: { userId } },
    include: {
      product: {
        include: {
          images: { orderBy: { sortOrder: "asc" }, select: { url: true, isHover: true } },
          variants: { select: { color: true, colorHex: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return items.map((i) => toProductCard(i.product));
}

/**
 * Product ids the current shopper has saved. Memoised per request, so every product grid on a
 * page can mark its saved items without repeating the query.
 */
export const getSavedProductIds = cache(async (): Promise<Set<string>> => {
  const session = await auth();
  if (!session?.user?.id) return new Set();
  const items = await prisma.wishlistItem.findMany({
    where: { wishlist: { userId: session.user.id } },
    select: { productId: true },
  });
  return new Set(items.map((i) => i.productId));
});
