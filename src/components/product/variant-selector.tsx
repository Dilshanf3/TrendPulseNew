"use client";

import { cn } from "@/lib/utils";

type Variant = {
  id: string;
  color: string | null;
  colorHex: string | null;
  size: string | null;
  stock: number;
  reservedStock: number;
};

export function VariantSelector({
  variants,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
}: {
  variants: Variant[];
  selectedColor: string | null;
  selectedSize: string | null;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
}) {
  const colors = Array.from(new Map(variants.filter((v) => v.color).map((v) => [v.color, v])).values());
  const sizesForColor = variants.filter((v) => !selectedColor || v.color === selectedColor);
  const sizes = Array.from(new Set(sizesForColor.filter((v) => v.size).map((v) => v.size!)));

  return (
    <div className="flex flex-col gap-5">
      {colors.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-charcoal-soft">
            Color{selectedColor ? `: ${selectedColor}` : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((v) => (
              <button
                key={v.color}
                onClick={() => onColorChange(v.color!)}
                title={v.color!}
                className={cn(
                  "h-9 w-9 rounded-full border-2 transition-transform",
                  selectedColor === v.color ? "border-gold-dark scale-105" : "border-line"
                )}
                style={{ backgroundColor: v.colorHex ?? "#ccc" }}
              />
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-charcoal-soft">
            Size{selectedSize ? `: ${selectedSize}` : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const variant = sizesForColor.find((v) => v.size === size);
              const available = variant ? variant.stock - variant.reservedStock : 0;
              return (
                <button
                  key={size}
                  disabled={available <= 0}
                  onClick={() => onSizeChange(size)}
                  className={cn(
                    "flex h-10 min-w-10 items-center justify-center rounded-sm border px-3 text-sm transition-colors",
                    selectedSize === size ? "border-charcoal bg-charcoal text-white" : "border-line",
                    available <= 0 && "cursor-not-allowed border-cream-dark text-charcoal-soft/50 line-through"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
