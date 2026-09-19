import { prisma } from "@/lib/db/prisma";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-bold text-admin-text">Customers ({customers.length})</h1>

      <div className="overflow-x-auto rounded-sm border border-admin-border bg-admin-surface shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-admin-border text-left text-xs uppercase text-admin-text-muted">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-admin-border">
                <td className="p-3 font-medium text-admin-text">{customer.name ?? "—"}</td>
                <td className="p-3 text-admin-text-muted">{customer.email}</td>
                <td className="p-3 text-admin-text-muted">{customer._count.orders}</td>
                <td className="p-3 text-admin-text-muted">{new Date(customer.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
