import { Search } from "lucide-react";
import type { Metadata } from "next";
import { ProductListing } from "@/components/catalog/product-listing";
import { EmptyState } from "@/components/ui/empty-state";
import { parseListingQuery } from "@/lib/catalog";

export async function generateMetadata(props: PageProps<"/search">): Promise<Metadata> {
  const { q } = parseListingQuery(await props.searchParams);
  return { title: q ? `Search: ${q}` : "Search" };
}

export default async function SearchPage(props: PageProps<"/search">) {
  const searchParams = await props.searchParams;
  const { q } = parseListingQuery(searchParams);

  if (!q) {
    return (
      <div className="container-page py-10">
        <EmptyState icon={Search} title="What are you looking for?" description="Use the search icon at the top of the page to find products." />
      </div>
    );
  }

  return (
    <ProductListing
      title={`Results for “${q}”`}
      pathname="/search"
      searchParams={searchParams}
      scope={{ search: q }}
    />
  );
}
