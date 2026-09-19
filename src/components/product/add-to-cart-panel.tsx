"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VariantSelector } from "./variant-selector";
import { useCartDrawer } from "@/hooks/use-cart-drawer";
import { toast } from "sonner";

export type PlainVariant = {
  id: string;
  productId: string;
  sku: string;
  color: string | null;
  colorHex: string | null;
  size: string | null;
  price: number;
  salePrice: number | null;
  stock: number;
  reservedStock: number;
  image: string | null;
  isActive: boolean;
};

export function AddToCartPanel({ productId, variants }: { productId: string; variants: PlainVariant[] }) {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState<string | null>(variants[0]?.color ?? null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const { open } = useCartDrawer();

  const selectedVariant = variants.find(
    (v) => (!v.color || v.color === selectedColor) && (!v.size || v.size === selectedSize)
  );

  const hasVariants = variants.length > 0;
  const available = selectedVariant ? selectedVariant.stock - selectedVariant.reservedStock : 1;
  const isSubmitting = isAddingToCart || isBuyingNow;

  async function addItemToCart() {
    if (hasVariants && !selectedVariant) {
      toast.error("Please select a size and color");
      return false;
    }
    const res = await fetch("/api/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, variantId: selectedVariant?.id ?? null, quantity }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Could not add to cart");
    }
    return true;
  }

  async function handleAddToCart() {
    setIsAddingToCart(true);
    try {
      const added = await addItemToCart();
      if (added) {
        toast.success("Added to cart");
        open();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsAddingToCart(false);
    }
  }

  async function handleBuyNow() {
    setIsBuyingNow(true);
    try {
      const added = await addItemToCart();
      if (added) {
        router.push("/checkout");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsBuyingNow(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {hasVariants && (
        <VariantSelector
          variants={variants}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          onColorChange={setSelectedColor}
          onSizeChange={setSelectedSize}
        />
      )}

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-charcoal-soft">Quantity</p>
        <div className="flex h-11 w-32 items-center rounded-sm border border-line">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-full w-10 items-center justify-center">
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="flex-1 text-center text-sm">{quantity}</span>
          <button onClick={() => setQuantity((q) => Math.min(20, q + 1))} className="flex h-full w-10 items-center justify-center">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          loading={isAddingToCart}
          disabled={isSubmitting || (hasVariants && available <= 0)}
        >
          {available <= 0 && hasVariants ? "Out of Stock" : "Add to Cart"}
        </Button>
        <Button variant="outline" size="icon" className="h-12 w-12 shrink-0" aria-label="Add to wishlist">
          <Heart className="h-5 w-5" />
        </Button>
      </div>

      <Button
        variant="outline"
        size="lg"
        onClick={handleBuyNow}
        loading={isBuyingNow}
        disabled={isSubmitting || (hasVariants && available <= 0)}
      >
        Buy Now
      </Button>
    </div>
  );
}
