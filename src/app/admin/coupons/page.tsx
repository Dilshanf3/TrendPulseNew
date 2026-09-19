import { prisma } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-bold text-admin-text">Coupons</h1>

      <div className="overflow-x-auto rounded-sm border border-admin-border bg-admin-surface shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-admin-border text-left text-xs uppercase text-admin-text-muted">
              <th className="p-3">Code</th>
              <th className="p-3">Type</th>
              <th className="p-3">Value</th>
              <th className="p-3">Used</th>
              <th className="p-3">Valid Through</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b border-admin-border">
                <td className="p-3 font-mono font-medium text-admin-text">{coupon.code}</td>
                <td className="p-3 text-admin-text-muted">{coupon.type}</td>
                <td className="p-3 text-admin-text">{coupon.type === "PERCENTAGE" ? `${coupon.value}%` : formatPrice(Number(coupon.value))}</td>
                <td className="p-3 text-admin-text-muted">{coupon.usedCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}</td>
                <td className="p-3 text-admin-text-muted">{new Date(coupon.endDate).toLocaleDateString()}</td>
                <td className="p-3">
                  <span className={`rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase ${coupon.isActive ? "border border-emerald-300 text-emerald-700" : "border border-admin-border text-admin-text-muted"}`}>
                    {coupon.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
