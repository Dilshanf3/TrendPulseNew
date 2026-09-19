import { prisma } from "@/lib/db/prisma";

export default async function AdminInventoryPage() {
  const variants = await prisma.productVariant.findMany({
    include: { product: true },
    orderBy: { stock: "asc" },
    take: 100,
  });

  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-bold text-admin-text">Inventory</h1>

      <div className="overflow-x-auto rounded-sm border border-admin-border bg-admin-surface shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-admin-border text-left text-xs uppercase text-admin-text-muted">
              <th className="p-3">SKU</th>
              <th className="p-3">Product</th>
              <th className="p-3">Variant</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Reserved</th>
              <th className="p-3">Available</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => {
              const available = v.stock - v.reservedStock;
              return (
                <tr key={v.id} className="border-b border-admin-border">
                  <td className="p-3 text-admin-text-muted">{v.sku}</td>
                  <td className="p-3 line-clamp-1 font-medium text-admin-text">{v.product.name}</td>
                  <td className="p-3 text-admin-text-muted">{[v.color, v.size].filter(Boolean).join(" / ")}</td>
                  <td className="p-3 text-admin-text">{v.stock}</td>
                  <td className="p-3 text-admin-text">{v.reservedStock}</td>
                  <td className={`p-3 font-semibold ${available <= 5 ? "text-red-600" : "text-admin-text"}`}>{available}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
