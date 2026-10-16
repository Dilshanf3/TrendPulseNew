"use client";

import { cn } from "@/lib/utils";

const CLOTHING_SIZE = /^(XXS|XS|S|M|L|XL|XXL|XXXL|\d+)$/i;

/** "Size" for apparel, "Option" for anything else (e.g. Salt / Pepper). */
export function optionLabel(variants: { size: string | null }[]) {
  const values = variants.map((v) => v.size).filter((s): s is string => !!s);
  return values.every((s) => CLOTHING_SIZE.test(s)) ? "Size" : "Option";
}

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
    <div className="flex flex-col gap-6">
      {colors.length > 0 && (
        <fieldset>
          <legend className="mb-3 text-sm">
            <span className="font-medium">Colour</span>
            {selectedColor && <span className="text-muted"> · {selectedColor}</span>}
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {colors.map((v) => {
              const active = selectedColor === v.color;
              return (
                <button
                  key={v.color}
                  type="button"
                  onClick={() => onColorChange(v.color!)}
                  aria-label={v.color!}
                  aria-pressed={active}
                  className={cn(
                    "h-9 w-9 rounded-full ring-offset-2 ring-offset-background transition-shadow",
                    active ? "ring-2 ring-foreground" : "ring-1 ring-border hover:ring-muted"
                  )}
                  style={{ backgroundColor: v.colorHex ?? "#ccc" }}
                />
              );
            })}
          </div>
        </fieldset>
      )}

      {sizes.length > 0 && (
        <fieldset>
          <legend className="mb-3 text-sm">
            <span className="font-medium">{optionLabel(variants)}</span>
            {selectedSize && <span className="text-muted"> · {selectedSize}</span>}
          </legend>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {sizes.map((size) => {
              const variant = sizesForColor.find((v) => v.size === size);
              const available = variant ? variant.stock - variant.reservedStock : 0;
              const active = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  disabled={available <= 0}
                  onClick={() => onSizeChange(size)}
                  aria-pressed={active}
                  className={cn(
                    "h-11 rounded-lg border text-sm transition-colors",
                    active ? "border-foreground bg-foreground text-primary-foreground" : "border-border bg-surface hover:border-foreground",
                    available <= 0 && "cursor-not-allowed text-muted/50 line-through hover:border-border"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );
}
