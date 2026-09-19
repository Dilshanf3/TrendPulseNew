import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-bold">Edit Product</h1>
      <ProductForm
        categories={categories}
        productId={product.id}
        initialData={{
          name: product.name,
          slug: product.slug,
          description: product.description,
          basePrice: Number(product.basePrice),
          salePrice: product.salePrice ? Number(product.salePrice) : null,
          categoryId: product.categoryId,
          status: product.status,
          isNew: product.isNew,
          isFeatured: product.isFeatured,
        }}
      />
    </div>
  );
}
