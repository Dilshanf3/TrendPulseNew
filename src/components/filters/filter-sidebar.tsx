"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#DC2626" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Green", hex: "#16A34A" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Beige", hex: "#D6C7A1" },
  { name: "Gray", hex: "#6B7280" },
];

function FilterGroup({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line py-4">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-charcoal">{title}</span>
        <ChevronDown className={cn("h-4 w-4 text-charcoal-soft transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export function FilterSidebar({
  selectedSizes,
  selectedColors,
  onToggleSize,
  onToggleColor,
  onSaleOnly,
  saleOnly,
}: {
  selectedSizes: string[];
  selectedColors: string[];
  onToggleSize: (size: string) => void;
  onToggleColor: (color: string) => void;
  onSaleOnly: (v: boolean) => void;
  saleOnly: boolean;
}) {
  return (
    <div className="w-full">
      <FilterGroup title="Size">
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onToggleSize(size)}
              className={cn(
                "flex h-9 items-center justify-center rounded-sm border text-xs transition-colors",
                selectedSizes.includes(size) ? "border-charcoal bg-charcoal text-paper" : "border-line text-charcoal hover:border-gold-dark"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Color">
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color.name}
              title={color.name}
              onClick={() => onToggleColor(color.name)}
              className={cn(
                "h-8 w-8 rounded-full border-2",
                selectedColors.includes(color.name) ? "border-gold-dark" : "border-line"
              )}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Discount">
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input type="checkbox" checked={saleOnly} onChange={(e) => onSaleOnly(e.target.checked)} className="h-4 w-4 rounded-sm accent-gold-dark" />
          On Sale
        </label>
      </FilterGroup>
    </div>
  );
}
