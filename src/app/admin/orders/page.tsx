import { prisma } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true, user: true, shippingAddress: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-bold text-admin-text">Orders ({orders.length})</h1>

      <div className="overflow-x-auto rounded-sm border border-admin-border bg-admin-surface shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-admin-border text-left text-xs uppercase text-admin-text-muted">
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-admin-border">
                <td className="p-3 font-medium text-admin-text">#{order.orderNumber}</td>
                <td className="p-3 text-admin-text-muted">{order.user?.name ?? order.guestEmail ?? "Guest"}</td>
                <td className="p-3 text-admin-text-muted">{order.items.length}</td>
                <td className="p-3 font-semibold text-admin-text">{formatPrice(Number(order.total))}</td>
                <td className="p-3 text-admin-text-muted">{order.paymentMethod} · {order.paymentStatus}</td>
                <td className="p-3">
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </td>
                <td className="p-3 text-admin-text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
