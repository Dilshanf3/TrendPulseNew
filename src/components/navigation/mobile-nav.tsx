"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, ChevronLeft } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav-data";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const close = () => {
    setOpen(false);
    setActiveItem(null);
  };

  return (
    <>
      <button aria-label="Open menu" onClick={() => setOpen(true)} className="flex h-10 w-10 items-center justify-center lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-charcoal/40" onClick={close} />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-paper">
            <div className="flex h-14 items-center justify-between border-b border-line px-4">
              <span className="font-serif text-sm font-semibold uppercase tracking-wide text-charcoal">Menu</span>
              <button aria-label="Close menu" onClick={close}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {activeItem === null ? (
              <ul>
                {NAV_ITEMS.map((item, i) => (
                  <li key={item.label} className="border-b border-line">
                    {item.columns ? (
                      <button
                        onClick={() => setActiveItem(i)}
                        className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-medium uppercase tracking-wide text-charcoal"
                      >
                        {item.label}
                        <ChevronRight className="h-4 w-4 text-charcoal-soft/60" />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={close}
                        className={cn(
                          "flex w-full items-center justify-between px-4 py-3.5 text-sm font-medium uppercase tracking-wide",
                          item.highlight ? "text-gold-dark" : "text-charcoal"
                        )}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                <button
                  onClick={() => setActiveItem(null)}
                  className="flex w-full items-center gap-2 border-b border-line px-4 py-3.5 text-sm font-semibold text-charcoal"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {NAV_ITEMS[activeItem].label}
                </button>
                {NAV_ITEMS[activeItem].columns!.map((col) => (
                  <div key={col.title} className="border-b border-line px-4 py-3">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-gold-dark">{col.title}</p>
                    <ul className="flex flex-col gap-2.5">
                      {col.links.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} onClick={close} className="text-sm text-charcoal-soft">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
