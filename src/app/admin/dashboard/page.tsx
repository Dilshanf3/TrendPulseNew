import { prisma } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [revenueAgg, orderCount, customerCount, productCount, lowStockCount, recentOrders, topProducts] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count(),
    prisma.productVariant.count({ where: { stock: { lte: 5 } } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { items: true } }),
    prisma.product.findMany({ orderBy: { soldCount: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Revenue", value: formatPrice(Number(revenueAgg._sum.total ?? 0)) },
    { label: "Orders", value: orderCount.toLocaleString() },
    { label: "Customers", value: customerCount.toLocaleString() },
    { label: "Products", value: productCount.toLocaleString() },
    { label: "Low Stock Variants", value: lowStockCount.toLocaleString() },
  ];

  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-bold text-admin-text">Dashboard</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-sm border border-admin-border bg-admin-surface p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-admin-text-muted">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-admin-text">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-sm border border-admin-border bg-admin-surface p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-admin-text">Recent Orders</h2>
          <ul className="flex flex-col divide-y divide-admin-border">
            {recentOrders.length === 0 && <p className="py-4 text-sm text-admin-text-muted">No orders yet.</p>}
            {recentOrders.map((order) => (
              <li key={order.id} className="flex items-center justify-between py-2.5 text-sm">
                <span className="font-medium text-admin-text">#{order.orderNumber}</span>
                <span className="text-admin-text-muted">{order.items.length} items</span>
                <span className="font-semibold text-admin-text">{formatPrice(Number(order.total))}</span>
                <span className="text-xs uppercase text-admin-text-muted">{order.status}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-sm border border-admin-border bg-admin-surface p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-admin-text">Top Products</h2>
          <ul className="flex flex-col divide-y divide-admin-border">
            {topProducts.map((product) => (
              <li key={product.id} className="flex items-center justify-between py-2.5 text-sm">
                <span className="line-clamp-1 font-medium text-admin-text">{product.name}</span>
                <span className="text-admin-text-muted">{product.soldCount} sold</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
