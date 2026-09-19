import Link from "next/link";
import { Heart, User } from "lucide-react";
import { AnnouncementBar } from "./announcement-bar";
import { SearchBar } from "./search-bar";
import { Logo } from "./logo";
import { MainNav } from "@/components/navigation/main-nav";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { CartButton } from "@/components/cart/cart-button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm">
      <AnnouncementBar />

      <div className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 lg:px-8">
          <MobileNav />

          <Logo />

          <div className="hidden flex-1 justify-center lg:flex">
            <SearchBar />
          </div>

          <div className="ml-auto flex items-center gap-1 lg:gap-2">
            <Link href="/account" aria-label="Account" className="hidden h-10 w-10 items-center justify-center text-charcoal-soft transition-colors hover:text-gold-dark lg:flex">
              <User className="h-5 w-5" />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="flex h-10 w-10 items-center justify-center text-charcoal-soft transition-colors hover:text-gold-dark">
              <Heart className="h-5 w-5" />
            </Link>
            <CartButton />
          </div>
        </div>

        <div className="px-4 pb-3 lg:hidden">
          <SearchBar />
        </div>
      </div>

      <MainNav />
    </header>
  );
}
