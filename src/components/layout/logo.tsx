import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE } from "@/config/site";

/** Typographic wordmark — echoes the gold serif of the brand mark without a cropped bitmap. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label={`${SITE.name} home`} className={cn("inline-flex shrink-0 items-baseline", className)}>
      <span className="font-display text-[22px] font-semibold tracking-tight text-foreground sm:text-2xl">
        Trend<span className="text-accent">Pulse</span>
      </span>
    </Link>
  );
}
