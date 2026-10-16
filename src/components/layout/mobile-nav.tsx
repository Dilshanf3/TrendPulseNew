"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ChevronRight, User, Heart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { NavLink } from "@/config/site";
import { cn } from "@/lib/utils";

export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-muted lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>

      <SheetContent side="left" title="Menu">
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-2 py-3">
          <ul>
            {links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-3.5 text-[15px] transition-colors hover:bg-surface-muted",
                    item.highlight ? "text-sale" : "text-foreground"
                  )}
                >
                  {item.label}
                  <ChevronRight className="h-4 w-4 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="grid grid-cols-2 gap-2 border-t border-border p-4">
          <Link href="/account" onClick={close} className="flex items-center justify-center gap-2 rounded-lg bg-surface-muted py-3 text-sm">
            <User className="h-4 w-4" /> Account
          </Link>
          <Link href="/wishlist" onClick={close} className="flex items-center justify-center gap-2 rounded-lg bg-surface-muted py-3 text-sm">
            <Heart className="h-4 w-4" /> Wishlist
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
