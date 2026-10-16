"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Search, X } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";

type Suggestion = { id: string; name: string; slug: string };

export function SearchDialog({ popular }: { popular: Suggestion[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=6`, { signal: controller.signal });
        if (res.ok) setSuggestions((await res.json()).products ?? []);
      } catch {
        // aborted or offline — keep the previous suggestions
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 200);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  const hasQuery = query.trim().length > 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Search"
        className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-muted"
      >
        <Search className="h-5 w-5" />
      </SheetTrigger>

      <SheetContent side="top" title="Search products" hideHeader className="border-b border-border">
        <div className="container-page py-4 sm:py-6">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (hasQuery) go(`/search?q=${encodeURIComponent(query.trim())}`);
            }}
            className="flex items-center gap-3 border-b-2 border-foreground pb-3"
          >
            <Search className="h-5 w-5 shrink-0 text-muted" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products"
              aria-label="Search for products"
              className="w-full bg-transparent text-lg outline-none placeholder:text-muted/70 sm:text-xl"
            />
            {isSearching && <Spinner className="h-4 w-4 text-muted" />}
            <SheetClose aria-label="Close search" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-surface-muted">
              <X className="h-5 w-5" />
            </SheetClose>
          </form>

          <div className="py-5">
            {hasQuery ? (
              suggestions.length > 0 ? (
                <ul className="flex flex-col">
                  {suggestions.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/products/${p.slug}`}
                        onClick={() => setOpen(false)}
                        className="group flex items-center justify-between rounded-lg px-2 py-2.5 text-sm hover:bg-surface-muted"
                      >
                        {p.name}
                        <ArrowUpRight className="h-4 w-4 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                !isSearching && <p className="px-2 text-sm text-muted">Press Enter to search for &ldquo;{query.trim()}&rdquo;</p>
              )
            ) : (
              <>
                {popular.length > 0 && <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">Popular right now</p>}
                <div className="flex flex-wrap gap-2">
                  {popular.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => go(`/products/${p.slug}`)}
                      className="rounded-full border border-border px-4 py-1.5 text-sm transition-colors hover:border-foreground"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
