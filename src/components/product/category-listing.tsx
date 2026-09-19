"use client";

import { useState, useMemo } from "react";
import { FilterSidebar } from "@/components/filters/filter-sidebar";
import { MobileFilterBar } from "@/components/filters/mobile-filter-bar";
import { SortDropdown } from "@/components/filters/sort-dropdown";
import { ProductGrid } from "@/components/product-grid/product-grid";
import type { ProductCardData, SortOption } from "@/types";

function sortProducts(products: ProductCardData[], sort: SortOption): ProductCardData[] {
  const arr = [...products];
  switch (sort) {
    case "price-asc":
      return arr.sort((a, b) => (a.salePrice ?? a.basePrice) - (b.salePrice ?? b.basePrice));
    case "price-desc":
      return arr.sort((a, b) => (b.salePrice ?? b.basePrice) - (a.salePrice ?? a.basePrice));
    case "rating":
      return arr.sort((a, b) => b.ratingAvg - a.ratingAvg);
    case "discount":
      return arr.sort((a, b) => {
        const da = a.salePrice ? (a.basePrice - a.salePrice) / a.basePrice : 0;
        const db = b.salePrice ? (b.basePrice - b.salePrice) / b.basePrice : 0;
        return db - da;
      });
    case "newest":
      return arr.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    default:
      return arr;
  }
}

export function CategoryListing({
  title,
  description,
  products,
}: {
  title: string;
  description?: string;
  products: ProductCardData[];
}) {
  const [sort, setSort] = useState<SortOption>("recommended");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [saleOnly, setSaleOnly] = useState(false);

  function toggleSize(size: string) {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
  }
  function toggleColor(color: string) {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]));
  }

  const filtered = useMemo(() => {
    let result = products;
    if (selectedColors.length) {
      result = result.filter((p) => p.colors.some((c) => selectedColors.includes(c)));
    }
    if (saleOnly) {
      result = result.filter((p) => p.salePrice !== null);
    }
    return sortProducts(result, sort);
  }, [products, selectedColors, saleOnly, sort]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8">
      <div className="mb-4">
        <h1 className="font-serif text-xl font-semibold uppercase tracking-wide text-charcoal sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-charcoal-soft">{description}</p>}
        <p className="mt-2 text-xs text-charcoal-soft/70">{filtered.length} items</p>
      </div>

      <MobileFilterBar
        sort={sort}
        onSortChange={setSort}
        selectedSizes={selectedSizes}
        selectedColors={selectedColors}
        onToggleSize={toggleSize}
        onToggleColor={toggleColor}
        onSaleOnly={setSaleOnly}
        saleOnly={saleOnly}
        onApply={() => {}}
      />

      <div className="flex gap-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <FilterSidebar
            selectedSizes={selectedSizes}
            selectedColors={selectedColors}
            onToggleSize={toggleSize}
            onToggleColor={toggleColor}
            onSaleOnly={setSaleOnly}
            saleOnly={saleOnly}
          />
        </aside>

        <div className="flex-1">
          <div className="mb-4 hidden justify-end lg:flex">
            <SortDropdown value={sort} onChange={setSort} />
          </div>
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}
