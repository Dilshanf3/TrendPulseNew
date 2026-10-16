import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({ value, className }: { value: number; className?: string }) {
  const rounded = Math.round(value);
  return (
    <span className={cn("inline-flex gap-0.5", className)} role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn("h-3.5 w-3.5", i < rounded ? "fill-accent text-accent" : "text-border")} aria-hidden />
      ))}
    </span>
  );
}
