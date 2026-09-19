import { prisma } from "@/lib/db/prisma";
import { CategoryManager } from "@/components/admin/category-manager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-bold text-admin-text">Categories</h1>
      <CategoryManager categories={categories} />
    </div>
  );
}
