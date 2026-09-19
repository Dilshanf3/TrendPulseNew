import { prisma } from "@/lib/db/prisma";
import type { CheckoutInput } from "@/lib/validations/cart";

function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TP-${ts}-${rand}`;
}

export async function createOrderFromCart(userId: string | null, guestCartItems: Array<{
  productId: string;
  variantId: string | null;
  quantity: number;
}>, input: CheckoutInput) {
  return prisma.$transaction(async (tx) => {
    const items = userId
      ? (
          await tx.cartItem.findMany({
            where: { cart: { userId }, savedForLater: false },
            include: { product: true, variant: true },
          })
        ).map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity, product: i.product, variant: i.variant }))
      : await Promise.all(
          guestCartItems.map(async (i) => {
            const product = await tx.product.findUniqueOrThrow({ where: { id: i.productId } });
            const variant = i.variantId ? await tx.productVariant.findUnique({ where: { id: i.variantId } }) : null;
            return { ...i, product, variant };
          })
        );

    if (items.length === 0) throw new Error("EMPTY_CART");

    for (const item of items) {
      if (item.variant) {
        const fresh = await tx.productVariant.findUniqueOrThrow({ where: { id: item.variant.id } });
        const available = fresh.stock - fresh.reservedStock;
        if (available < item.quantity) {
          throw new Error(`INSUFFICIENT_STOCK:${item.product.name}`);
        }
      }
    }

    let subtotal = 0;
    const orderItemsData = items.map((item) => {
      const price = Number(item.variant?.salePrice ?? item.variant?.price ?? item.product.salePrice ?? item.product.basePrice);
      subtotal += price * item.quantity;
      return {
        productId: item.productId,
        variantId: item.variantId,
        productName: item.product.name,
        variantLabel: item.variant ? [item.variant.color, item.variant.size].filter(Boolean).join(" / ") : null,
        image: null,
        quantity: item.quantity,
        price,
      };
    });

    let discount = 0;
    let couponId: string | null = null;
    if (input.couponCode) {
      const coupon = await tx.coupon.findUnique({ where: { code: input.couponCode } });
      const now = new Date();
      if (
        coupon &&
        coupon.isActive &&
        coupon.startDate <= now &&
        coupon.endDate >= now &&
        (!coupon.minOrderAmount || subtotal >= Number(coupon.minOrderAmount)) &&
        (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit)
      ) {
        discount =
          coupon.type === "PERCENTAGE"
            ? Math.min(subtotal * (Number(coupon.value) / 100), Number(coupon.maxDiscount ?? Infinity))
            : Number(coupon.value);
        couponId = coupon.id;
      }
    }

    const shippingFee = input.shippingMethod === "Express" ? 1200 : subtotal >= 5000 ? 0 : 600;
    const tax = 0;
    const total = Math.max(subtotal - discount + shippingFee + tax, 0);

    const address = await tx.address.create({
      data: {
        userId,
        fullName: input.fullName,
        phone: input.phone,
        line1: input.line1,
        line2: input.line2,
        city: input.city,
        state: input.state,
        postalCode: input.postalCode,
        country: input.country,
      },
    });

    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        guestEmail: userId ? null : input.guestEmail,
        status: "PENDING",
        paymentStatus: input.paymentMethod === "COD" ? "PENDING" : "PENDING",
        paymentMethod: input.paymentMethod,
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        couponCode: input.couponCode,
        shippingAddressId: address.id,
        shippingMethod: input.shippingMethod,
        notes: input.notes,
        items: { create: orderItemsData },
        payment: { create: { method: input.paymentMethod, amount: total, status: "PENDING" } },
      },
      include: { items: true },
    });

    if (couponId) {
      await tx.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } });
      await tx.couponUsage.create({ data: { couponId, userId, orderId: order.id } });
    }

    for (const item of items) {
      if (item.variantId) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }
      await tx.product.update({
        where: { id: item.productId },
        data: { soldCount: { increment: item.quantity } },
      });
    }

    if (userId) {
      const cart = await tx.cart.findUnique({ where: { userId } });
      if (cart) await tx.cartItem.deleteMany({ where: { cartId: cart.id, savedForLater: false } });
    }

    return order;
  });
}
