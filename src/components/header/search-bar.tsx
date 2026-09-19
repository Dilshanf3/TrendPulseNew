"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const POPULAR_SEARCHES = ["Summer Dress", "Oversized Hoodie", "Denim Jacket", "Sneakers", "Sunglasses"];

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }
    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.products ?? []);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  const visibleSuggestions = query.trim() ? suggestions : [];

  function submitSearch(q: string) {
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setFocused(false);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitSearch(query);
        }}
        className="flex h-10 items-center rounded-sm border border-line bg-cream-dark/60 px-3 transition-colors focus-within:border-gold focus-within:bg-paper"
      >
        <Search className="h-4 w-4 text-charcoal-soft" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search products, categories..."
          className="ml-2 h-full w-full bg-transparent text-sm outline-none placeholder:text-charcoal-soft/60"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
            <X className="h-4 w-4 text-charcoal-soft" />
          </button>
        )}
      </form>

      {focused && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-sm border border-line bg-paper shadow-lg">
          {query.trim() ? (
            <div className="max-h-96 overflow-y-auto py-2">
              {isSearching ? (
                <div className="flex items-center justify-center py-6">
                  <Spinner className="h-4 w-4 text-charcoal-soft/60" />
                </div>
              ) : visibleSuggestions.length > 0 ? (
                visibleSuggestions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      router.push(`/products/${p.slug}`);
                      setFocused(false);
                    }}
                    className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-cream-dark"
                  >
                    <Search className="mr-2 h-3.5 w-3.5 text-charcoal-soft" />
                    {p.name}
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 text-sm text-charcoal-soft/70">No matches yet — press Enter to search &ldquo;{query}&rdquo;</p>
              )}
            </div>
          ) : (
            <div className="p-4">
              <p className="mb-2 text-xs font-bold uppercase text-charcoal-soft/70">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => submitSearch(term)}
                    className="rounded-sm border border-line px-3 py-1 text-xs text-charcoal-soft transition-colors hover:border-gold hover:text-gold-dark"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
