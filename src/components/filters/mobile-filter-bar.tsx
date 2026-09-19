"use client";

import { useState } from "react";
import { SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import { FilterSidebar } from "./filter-sidebar";
import { Button } from "@/components/ui/button";
import type { SortOption } from "@/types";

export function MobileFilterBar({
  sort,
  onSortChange,
  selectedSizes,
  selectedColors,
  onToggleSize,
  onToggleColor,
  onSaleOnly,
  saleOnly,
  onApply,
}: {
  sort: SortOption;
  onSortChange: (v: SortOption) => void;
  selectedSizes: string[];
  selectedColors: string[];
  onToggleSize: (size: string) => void;
  onToggleColor: (color: string) => void;
  onSaleOnly: (v: boolean) => void;
  saleOnly: boolean;
  onApply: () => void;
}) {
  const [sheet, setSheet] = useState<"none" | "filter" | "sort">("none");

  return (
    <>
      <div className="flex border-y border-line lg:hidden">
        <button onClick={() => setSheet("filter")} className="flex h-11 flex-1 items-center justify-center gap-2 border-r border-line text-xs font-semibold uppercase text-charcoal">
          <SlidersHorizontal className="h-4 w-4" /> Filter
        </button>
        <button onClick={() => setSheet("sort")} className="flex h-11 flex-1 items-center justify-center gap-2 text-xs font-semibold uppercase text-charcoal">
          <ArrowUpDown className="h-4 w-4" /> Sort
        </button>
      </div>

      {sheet !== "none" && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-charcoal/40" onClick={() => setSheet("none")} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-xl bg-paper p-4 shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-bold uppercase text-charcoal">{sheet === "filter" ? "Filter" : "Sort By"}</span>
              <button onClick={() => setSheet("none")} className="text-charcoal-soft hover:text-charcoal">
                <X className="h-5 w-5" />
              </button>
            </div>

            {sheet === "filter" ? (
              <>
                <FilterSidebar
                  selectedSizes={selectedSizes}
                  selectedColors={selectedColors}
                  onToggleSize={onToggleSize}
                  onToggleColor={onToggleColor}
                  onSaleOnly={onSaleOnly}
                  saleOnly={saleOnly}
                />
                <Button
                  className="mt-4 w-full"
                  onClick={() => {
                    onApply();
                    setSheet("none");
                  }}
                >
                  Apply
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-1">
                {(["recommended", "newest", "popular", "rating", "price-asc", "price-desc", "discount"] as SortOption[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      onSortChange(opt);
                      setSheet("none");
                    }}
                    className={`flex h-11 items-center px-2 text-left text-sm ${sort === opt ? "font-bold text-charcoal" : "text-charcoal-soft"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
