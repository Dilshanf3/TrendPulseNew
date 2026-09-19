import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true, images: { take: 1, orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-admin-text">Products ({products.length})</h1>
        <Link href="/admin/products/new" className="rounded-sm bg-admin-accent px-4 py-2 text-xs font-bold uppercase text-white hover:bg-admin-accent-hover">
          Add Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-sm border border-admin-border bg-admin-surface shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-admin-border text-left text-xs uppercase text-admin-text-muted">
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Sold</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-admin-border">
                <td className="flex items-center gap-3 p-3">
                  {product.images[0] && (
                    <Image src={product.images[0].url} alt="" width={32} height={40} className="h-10 w-8 rounded-sm object-cover" />
                  )}
                  <span className="line-clamp-1 text-admin-text">{product.name}</span>
                </td>
                <td className="p-3 text-admin-text-muted">{product.category.name}</td>
                <td className="p-3 text-admin-text">{formatPrice(Number(product.salePrice ?? product.basePrice))}</td>
                <td className="p-3">
                  <span className="rounded-sm border border-admin-border px-2 py-0.5 text-[10px] font-bold uppercase text-admin-text-muted">{product.status}</span>
                </td>
                <td className="p-3 text-admin-text-muted">{product.soldCount}</td>
                <td className="p-3 text-right">
                  <Link href={`/admin/products/${product.id}`} className="text-xs font-semibold text-admin-accent underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
