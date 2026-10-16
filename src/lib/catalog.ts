import type { SortOption } from "@/types";

/**
 * Listing state lives in the URL (?category=&size=&color=&sale=1&sort=&page=) so filtered views
 * are shareable, survive refresh, and work with the back button. This module is the only place
 * that knows the URL format — pages parse with it, the toolbar and pagination build links with it.
 */

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most popular" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const DEFAULT_SORT: SortOption = "newest";

export type ListingQuery = {
  q: string;
  category: string;
  sizes: string[];
  colors: string[];
  sale: boolean;
  sort: SortOption;
  page: number;
};

export type RawSearchParams = Record<string, string | string[] | undefined>;

const asList = (v: string | string[] | undefined) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);
const asString = (v: string | string[] | undefined) => asList(v)[0] ?? "";

export function parseListingQuery(sp: RawSearchParams): ListingQuery {
  const sort = asString(sp.sort) as SortOption;
  const page = Number.parseInt(asString(sp.page), 10);
  return {
    q: asString(sp.q).trim(),
    category: asString(sp.category),
    sizes: asList(sp.size),
    colors: asList(sp.color),
    sale: asString(sp.sale) === "1",
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : DEFAULT_SORT,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/** Builds a listing URL, omitting defaults so links stay short. */
export function listingHref(pathname: string, query: Partial<ListingQuery>) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  query.sizes?.forEach((s) => params.append("size", s));
  query.colors?.forEach((c) => params.append("color", c));
  if (query.sale) params.set("sale", "1");
  if (query.sort && query.sort !== DEFAULT_SORT) params.set("sort", query.sort);
  if (query.page && query.page > 1) params.set("page", String(query.page));
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export const activeFilterCount = (q: ListingQuery) => q.sizes.length + q.colors.length + (q.sale ? 1 : 0);
