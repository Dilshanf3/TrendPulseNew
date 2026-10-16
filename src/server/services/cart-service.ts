import { prisma } from "@/lib/db/prisma";
import { getUnitPrice } from "@/lib/pricing";

export async function getOrCreateCart(userId: string) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        where: { savedForLater: false },
        include: {
          product: { include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } } },
          variant: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: { include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } } },
            variant: true,
          },
        },
      },
    });
  }

  return cart;
}

export async function addToCart(userId: string, productId: string, variantId: string | null, quantity: number) {
  const cart = await getOrCreateCart(userId);

  const variant = variantId
    ? await prisma.productVariant.findUnique({ where: { id: variantId } })
    : null;

  if (variant) {
    const available = variant.stock - variant.reservedStock;
    if (available < quantity) {
      throw new Error("INSUFFICIENT_STOCK");
    }
  }

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, variantId: variantId ?? null, savedForLater: false },
  });

  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  }

  return prisma.cartItem.create({
    data: { cartId: cart.id, productId, variantId, quantity },
  });
}

export async function updateCartItemQuantity(userId: string, itemId: string, quantity: number) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new Error("CART_NOT_FOUND");

  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
  if (!item) throw new Error("ITEM_NOT_FOUND");

  return prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
}

export async function removeCartItem(userId: string, itemId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new Error("CART_NOT_FOUND");

  return prisma.cartItem.deleteMany({ where: { id: itemId, cartId: cart.id } });
}

export async function getCartTotals(userId: string) {
  const cart = await getOrCreateCart(userId);

  const subtotal = cart.items.reduce((sum, item) => sum + getUnitPrice(item.product, item.variant) * item.quantity, 0);

  return { subtotal, itemCount: cart.items.reduce((n, i) => n + i.quantity, 0) };
}
