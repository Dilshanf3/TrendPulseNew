import { cn, formatPrice, calcDiscountPercent } from "@/lib/utils";

export function Price({
  basePrice,
  salePrice,
  size = "sm",
  showDiscount = false,
  className,
}: {
  basePrice: number;
  salePrice: number | null;
  size?: "sm" | "lg";
  showDiscount?: boolean;
  className?: string;
}) {
  const onSale = salePrice !== null && salePrice < basePrice;
  const main = size === "lg" ? "text-2xl font-semibold" : "text-sm font-medium";
  const struck = size === "lg" ? "text-base" : "text-xs";

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2", className)}>
      <span className={cn(main, onSale ? "text-sale" : "text-foreground")}>{formatPrice(onSale ? salePrice : basePrice)}</span>
      {onSale && (
        <>
          <span className={cn(struck, "text-muted line-through")}>{formatPrice(basePrice)}</span>
          {showDiscount && (
            <span className={cn(struck, "font-medium text-sale")}>Save {calcDiscountPercent(basePrice, salePrice)}%</span>
          )}
        </>
      )}
    </div>
  );
}
