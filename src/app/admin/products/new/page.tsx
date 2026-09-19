import { prisma } from "@/lib/db/prisma";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-bold">Add Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
