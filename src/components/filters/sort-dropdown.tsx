"use client";

import { ChevronDown } from "lucide-react";
import type { SortOption } from "@/types";

const SORT_LABELS: Record<SortOption, string> = {
  recommended: "Recommended",
  newest: "Newest",
  popular: "Most Popular",
  rating: "Best Rated",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  discount: "Biggest Discount",
};

export function SortDropdown({ value, onChange }: { value: SortOption; onChange: (v: SortOption) => void }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="h-10 appearance-none rounded-sm border border-line bg-paper pl-3 pr-8 text-xs font-medium uppercase tracking-wide text-charcoal outline-none"
      >
        {Object.entries(SORT_LABELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-soft" />
    </div>
  );
}
