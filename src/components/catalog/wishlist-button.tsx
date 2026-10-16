"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function WishlistButton({
  productId,
  initialSaved = false,
  variant = "floating",
  className,
}: {
  productId: string;
  initialSaved?: boolean;
  variant?: "floating" | "outline";
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = !saved;
    setSaved(next); // optimistic

    const res = next
      ? await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        })
      : await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });

    if (res.status === 401) {
      setSaved(!next);
      toast("Sign in to save favourites", {
        action: { label: "Sign in", onClick: () => router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`) },
      });
      return;
    }
    if (!res.ok) {
      setSaved(!next);
      toast.error("Couldn't update your wishlist");
      return;
    }
    if (next) toast.success("Saved to wishlist");
    if (pathname === "/wishlist") startTransition(() => router.refresh());
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      className={cn(
        "flex items-center justify-center rounded-full transition-all",
        variant === "floating"
          ? "h-9 w-9 bg-surface/90 shadow-sm backdrop-blur hover:scale-105"
          : "h-12 w-12 shrink-0 border border-border bg-surface hover:border-foreground",
        className
      )}
    >
      <Heart className={cn("h-[18px] w-[18px] transition-colors", saved ? "fill-sale text-sale" : "text-foreground")} />
    </button>
  );
}
