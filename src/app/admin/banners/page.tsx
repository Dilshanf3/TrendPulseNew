import Image from "next/image";
import { prisma } from "@/lib/db/prisma";

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-bold">Banners ({banners.length})</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {banners.map((banner) => (
          <div key={banner.id} className="rounded-sm border border-admin-border bg-admin-surface shadow-sm">
            <div className="relative h-32 w-full">
              <Image src={banner.image} alt={banner.title} fill className="object-cover" />
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-admin-text">{banner.title}</p>
              <p className="text-xs text-admin-text-muted">{banner.placement}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
