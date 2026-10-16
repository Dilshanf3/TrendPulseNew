import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium", {
  variants: {
    variant: {
      default: "bg-surface text-foreground",
      sale: "bg-sale text-white",
      dark: "bg-primary text-primary-foreground",
      outline: "border border-border text-muted",
      success: "bg-emerald-50 text-emerald-700",
      warning: "bg-amber-50 text-amber-800",
      danger: "bg-red-50 text-red-700",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
