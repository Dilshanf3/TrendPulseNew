"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav-data";
import { MegaMenu } from "@/components/mega-menu/mega-menu";

export function MainNav() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <nav className="relative hidden border-b border-line bg-paper lg:block" onMouseLeave={() => setActiveIndex(null)}>
      <ul className="mx-auto flex max-w-[1400px] items-center justify-center gap-8 px-8">
        {NAV_ITEMS.map((item, i) => (
          <li key={item.label} onMouseEnter={() => setActiveIndex(item.columns ? i : null)}>
            <Link
              href={item.href}
              className={cn(
                "relative flex h-12 items-center text-[13px] font-semibold uppercase tracking-wide text-charcoal-soft transition-colors hover:text-gold-dark",
                item.highlight && "text-gold-dark hover:text-gold-dark"
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {activeIndex !== null && NAV_ITEMS[activeIndex].columns && (
        <MegaMenu columns={NAV_ITEMS[activeIndex].columns!} />
      )}
    </nav>
  );
}
