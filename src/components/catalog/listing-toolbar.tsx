"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { optionLabel } from "@/components/product/variant-selector";
import { SORT_OPTIONS, activeFilterCount, listingHref, type ListingQuery } from "@/lib/catalog";
import type { SortOption } from "@/types";

type Subcategory = { slug: string; name: string };
export type ListingFacets = { sizes: string[]; colors: { name: string; hex: string }[]; hasSale: boolean };

const chip = "shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors";

export function ListingToolbar({
  pathname,
  query,
  total,
  subcategories = [],
  facets,
}: {
  pathname: string;
  query: ListingQuery;
  total: number;
  subcategories?: Subcategory[];
  facets: ListingFacets;
}) {
  const router = useRouter();
  const navigate = (next: Partial<ListingQuery>) =>
    router.push(listingHref(pathname, { ...query, page: 1, ...next }), { scroll: false });

  const filterCount = activeFilterCount(query);

  return (
    <div className="mb-8 flex flex-col gap-5">
      {subcategories.length > 0 && (
        <nav aria-label="Categories" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {[{ slug: "", name: "All" }, ...subcategories].map((sub) => {
            const active = query.category === sub.slug;
            return (
              <Link
                key={sub.slug || "all"}
                href={listingHref(pathname, { ...query, category: sub.slug, page: 1 })}
                scroll={false}
                aria-current={active ? "page" : undefined}
                className={cn(
                  chip,
                  active ? "border-foreground bg-foreground text-primary-foreground" : "border-border bg-surface hover:border-foreground"
                )}
              >
                {sub.name}
              </Link>
            );
          })}
        </nav>
      )}

      <div className="flex items-center justify-between gap-3 border-y border-border py-3">
        <p className="text-sm text-muted">
          {total} {total === 1 ? "product" : "products"}
        </p>
        <div className="flex items-center gap-2">
          {(facets.sizes.length > 0 || facets.colors.length > 1 || facets.hasSale || filterCount > 0) && (
            <FilterSheet query={query} filterCount={filterCount} facets={facets} onApply={navigate} />
          )}
          <label className="relative">
            <span className="sr-only">Sort by</span>
            <select
              value={query.sort}
              onChange={(e) => navigate({ sort: e.target.value as SortOption })}
              className="h-9 cursor-pointer appearance-none rounded-full border border-border bg-surface pl-4 pr-9 text-sm outline-none transition-colors hover:border-foreground"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </label>
        </div>
      </div>

      {filterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {query.sizes.map((s) => (
            <ActivePill key={`s-${s}`} label={s} onRemove={() => navigate({ sizes: query.sizes.filter((x) => x !== s) })} />
          ))}
          {query.colors.map((c) => (
            <ActivePill key={`c-${c}`} label={c} onRemove={() => navigate({ colors: query.colors.filter((x) => x !== c) })} />
          ))}
          {query.sale && <ActivePill label="On sale" onRemove={() => navigate({ sale: false })} />}
          <button onClick={() => navigate({ sizes: [], colors: [], sale: false })} className="ml-1 text-sm text-muted underline underline-offset-4 hover:text-foreground">
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

function ActivePill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      aria-label={`Remove filter: ${label}`}
      className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted py-1 pl-3 pr-2 text-sm transition-colors hover:bg-border"
    >
      {label}
      <X className="h-3.5 w-3.5" />
    </button>
  );
}

function FilterSheet({
  query,
  filterCount,
  facets,
  onApply,
}: {
  query: ListingQuery;
  filterCount: number;
  facets: ListingFacets;
  onApply: (next: Partial<ListingQuery>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ sizes: query.sizes, colors: query.colors, sale: query.sale });

  const toggle = (key: "sizes" | "colors", value: string) =>
    setDraft((d) => ({ ...d, [key]: d[key].includes(value) ? d[key].filter((v) => v !== value) : [...d[key], value] }));

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (next) setDraft({ sizes: query.sizes, colors: query.colors, sale: query.sale });
        setOpen(next);
      }}
    >
      <SheetTrigger className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm transition-colors hover:border-foreground">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {filterCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[11px] text-primary-foreground">
            {filterCount}
          </span>
        )}
      </SheetTrigger>

      <SheetContent side="right" title="Filters">
        <div className="flex-1 overflow-y-auto px-5 py-6">
          {facets.sizes.length > 0 && (
            <fieldset>
              <legend className="mb-3 text-sm font-medium">{optionLabel(facets.sizes.map((size) => ({ size })))}</legend>
              <div className="grid grid-cols-3 gap-2">
                {facets.sizes.map((size) => {
                  const on = draft.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle("sizes", size)}
                      className={cn(
                        "h-11 rounded-lg border text-sm transition-colors",
                        on ? "border-foreground bg-foreground text-primary-foreground" : "border-border hover:border-foreground"
                      )}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {facets.colors.length > 1 && (
            <fieldset className="mt-8">
              <legend className="mb-3 text-sm font-medium">Colour</legend>
              <div className="grid grid-cols-2 gap-2">
                {facets.colors.map((color) => {
                  const on = draft.colors.includes(color.name);
                  return (
                    <button
                      key={color.name}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle("colors", color.name)}
                      className={cn(
                        "flex h-11 items-center gap-2.5 rounded-lg border px-3 text-sm transition-colors",
                        on ? "border-foreground bg-surface-muted" : "border-border hover:border-foreground"
                      )}
                    >
                      <span className="h-4 w-4 rounded-full ring-1 ring-border" style={{ backgroundColor: color.hex }} />
                      {color.name}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {facets.hasSale && (
            <label className="mt-8 flex cursor-pointer items-center justify-between rounded-lg border border-border px-4 py-3.5 text-sm">
              On sale only
              <input
                type="checkbox"
                checked={draft.sale}
                onChange={(e) => setDraft((d) => ({ ...d, sale: e.target.checked }))}
                className="h-4 w-4 accent-foreground"
              />
            </label>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-border p-5">
          <Button variant="outline" onClick={() => setDraft({ sizes: [], colors: [], sale: false })}>
            Clear
          </Button>
          <Button
            onClick={() => {
              onApply(draft);
              setOpen(false);
            }}
          >
            Show results
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
