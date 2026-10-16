"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { WishlistButton } from "@/components/catalog/wishlist-button";
import { VariantSelector, optionLabel } from "./variant-selector";
import { SignInRequiredError, useCart } from "@/hooks/use-cart";

export type PlainVariant = {
  id: string;
  color: string | null;
  colorHex: string | null;
  size: string | null;
  stock: number;
  reservedStock: number;
};

export function AddToCartPanel({
  productId,
  variants,
  saved,
}: {
  productId: string;
  variants: PlainVariant[];
  saved: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const addItem = useCart((s) => s.addItem);
  const setCartOpen = useCart((s) => s.setOpen);

  const [selectedColor, setSelectedColor] = useState<string | null>(variants[0]?.color ?? null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [pendingAction, setPendingAction] = useState<"add" | "buy" | null>(null);

  const hasVariants = variants.length > 0;
  const selectedVariant = variants.find(
    (v) => (!v.color || v.color === selectedColor) && (!v.size || v.size === selectedSize)
  );
  const available = selectedVariant ? selectedVariant.stock - selectedVariant.reservedStock : Infinity;
  const needsSelection = hasVariants && !selectedVariant;
  const soldOut = available <= 0;

  async function submit(action: "add" | "buy") {
    setPendingAction(action);
    try {
      await addItem({ productId, variantId: selectedVariant?.id ?? null, quantity });
      if (action === "buy") {
        router.push("/checkout");
      } else {
        setCartOpen(true);
      }
    } catch (err) {
      if (err instanceof SignInRequiredError) {
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
        return;
      }
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPendingAction(null);
    }
  }

  const disabled = pendingAction !== null || needsSelection || soldOut;

  return (
    <div className="flex flex-col gap-6">
      {hasVariants && (
        <VariantSelector
          variants={variants}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          onColorChange={setSelectedColor}
          onSizeChange={setSelectedSize}
        />
      )}

      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <QuantityStepper value={quantity} onChange={setQuantity} max={Math.min(20, available)} />
          <Button size="lg" className="flex-1" onClick={() => submit("add")} loading={pendingAction === "add"} disabled={disabled}>
            {soldOut ? "Out of stock" : needsSelection ? `Select ${optionLabel(variants) === "Size" ? "a size" : "an option"}` : "Add to bag"}
          </Button>
          <WishlistButton productId={productId} initialSaved={saved} variant="outline" />
        </div>
        <Button size="lg" variant="outline" onClick={() => submit("buy")} loading={pendingAction === "buy"} disabled={disabled}>
          Buy now
        </Button>
      </div>
    </div>
  );
}
