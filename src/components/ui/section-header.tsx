import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Heading row for a page section: serif title, optional subtitle, optional "view all" link. */
export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "View all",
  className,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex items-end justify-between gap-4 sm:mb-8", className)}>
      <div>
        <h2 className="font-display text-2xl text-foreground sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent-strong"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

/** Title block at the top of a page. */
export function PageHeader({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-3xl text-foreground sm:text-4xl">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">{description}</p>}
      {children}
    </div>
  );
}
