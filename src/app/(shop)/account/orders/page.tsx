import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/orders");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 font-serif text-xl font-semibold uppercase tracking-wide">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-sm text-charcoal-soft">You haven&apos;t placed any orders yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded-sm border border-line bg-paper p-4 shadow-sm hover:shadow-md">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-charcoal">#{order.orderNumber}</span>
                <span className="rounded-sm border border-line px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-charcoal-soft">
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-charcoal-soft">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""} · {formatPrice(Number(order.total))} ·{" "}
                {order.paymentMethod === "COD" ? "Cash on Delivery" : "Card"}
              </p>
              <p className="mt-1 text-xs text-charcoal-soft/60">{new Date(order.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
