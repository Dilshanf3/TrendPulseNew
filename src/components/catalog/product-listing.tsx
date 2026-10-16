import { SearchX } from "lucide-react";
import { listProducts, type ListProductsParams } from "@/server/services/product-service";
import { getListingFacets } from "@/server/services/storefront-service";
import { parseListingQuery, type RawSearchParams } from "@/lib/catalog";
import { PageHeader } from "@/components/ui/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductGrid } from "./product-grid";
import { ListingToolbar } from "./listing-toolbar";
import { Pagination } from "./pagination";

/**
 * The one catalog page layout. Category, New In, Sale and Search pages differ only in their
 * title and fixed `scope`; everything the shopper changes (filters, sort, page) comes from the URL.
 */
export async function ProductListing({
  title,
  description,
  pathname,
  searchParams,
  scope = {},
  subcategories = [],
}: {
  title: string;
  description?: string;
  pathname: string;
  searchParams: RawSearchParams;
  scope?: Pick<ListProductsParams, "categorySlug" | "search" | "isNew" | "onSale">;
  subcategories?: { slug: string; name: string }[];
}) {
  const query = parseListingQuery(searchParams);
  // Only honour ?category= when it is one of this page's own sub-categories.
  if (!subcategories.some((s) => s.slug === query.category)) query.category = "";

  const [{ items, total, pageCount }, facets] = await Promise.all([
    listProducts({
      ...scope,
      categorySlug: query.category || scope.categorySlug,
      sizes: query.sizes,
      colors: query.colors,
      onSale: scope.onSale || query.sale,
      sort: query.sort,
      page: query.page,
    }),
    getListingFacets(scope),
  ]);

  return (
    <div className="container-page py-10 sm:py-14">
      <PageHeader title={title} description={description} />
      <ListingToolbar
        pathname={pathname}
        query={query}
        total={total}
        subcategories={subcategories}
        facets={facets}
      />
      {items.length > 0 ? (
        <ProductGrid products={items} />
      ) : (
        <EmptyState
          icon={SearchX}
          title="No products match"
          description="Try removing a filter or browsing a different category."
          action={{ label: "Browse new arrivals", href: "/new-in" }}
        />
      )}
      <Pagination pathname={pathname} query={query} pageCount={pageCount} />
    </div>
  );
}
