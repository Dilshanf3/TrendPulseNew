import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryWithChildren } from "@/server/services/product-service";
import { ProductListing } from "@/components/catalog/product-listing";

export async function generateMetadata(props: PageProps<"/[category]">): Promise<Metadata> {
  const { category: slug } = await props.params;
  const category = await getCategoryWithChildren(slug);
  return category ? { title: category.name, description: category.description ?? undefined } : {};
}

export default async function CategoryPage(props: PageProps<"/[category]">) {
  const { category: slug } = await props.params;
  const category = await getCategoryWithChildren(slug);
  if (!category) notFound();

  return (
    <ProductListing
      title={category.name}
      description={category.description ?? undefined}
      pathname={`/${slug}`}
      searchParams={await props.searchParams}
      scope={{ categorySlug: slug }}
      subcategories={category.children}
    />
  );
}
