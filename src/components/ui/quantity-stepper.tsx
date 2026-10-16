"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  pending = false,
  size = "default",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  pending?: boolean;
  size?: "default" | "sm";
}) {
  const box = size === "sm" ? "h-8 w-8" : "h-11 w-11";
  return (
    <div className={cn("inline-flex items-center rounded-lg border border-border bg-surface", pending && "opacity-60")}>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(value - 1)}
        disabled={pending || value <= min}
        className={cn(box, "flex items-center justify-center text-muted transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40")}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="flex min-w-6 items-center justify-center text-sm tabular-nums" aria-live="polite">
        {pending ? <Spinner className="h-3.5 w-3.5" /> : value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        disabled={pending || value >= max}
        className={cn(box, "flex items-center justify-center text-muted transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40")}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
