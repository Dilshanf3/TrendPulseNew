import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { listingHref, type ListingQuery } from "@/lib/catalog";

const pageLink = "inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-surface px-4 text-sm transition-colors hover:border-foreground";

export function Pagination({ pathname, query, pageCount }: { pathname: string; query: ListingQuery; pageCount: number }) {
  if (pageCount <= 1) return null;
  const { page } = query;

  return (
    <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-4">
      {page > 1 ? (
        <Link href={listingHref(pathname, { ...query, page: page - 1 })} className={pageLink}>
          <ChevronLeft className="h-4 w-4" /> Previous
        </Link>
      ) : (
        <span className={cn(pageLink, "pointer-events-none opacity-40")}>
          <ChevronLeft className="h-4 w-4" /> Previous
        </span>
      )}
      <span className="text-sm text-muted">
        Page {page} of {pageCount}
      </span>
      {page < pageCount ? (
        <Link href={listingHref(pathname, { ...query, page: page + 1 })} className={pageLink}>
          Next <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={cn(pageLink, "pointer-events-none opacity-40")}>
          Next <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
