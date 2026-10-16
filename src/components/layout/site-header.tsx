import Link from "next/link";
import { Heart, User } from "lucide-react";
import { Logo } from "./logo";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import { SearchDialog } from "./search-dialog";
import { CartButton } from "@/components/cart/cart-button";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";
import { getMainNav } from "@/server/services/navigation";
import { getPopularProducts } from "@/server/services/storefront-service";

const iconLink = "hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-muted sm:flex";

export async function SiteHeader() {
  const [links, popular] = await Promise.all([getMainNav(), getPopularProducts()]);

  return (
    <>
      <p className="bg-primary px-4 py-2 text-center text-xs text-primary-foreground/90">
        Free shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)} · Cash on delivery available
      </p>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container-page grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 lg:flex lg:justify-between">
          <div className="flex items-center lg:hidden">
            <MobileNav links={links} />
          </div>
          <Logo />
          <DesktopNav links={links} />
          <div className="flex items-center justify-end gap-0.5">
            <SearchDialog popular={popular} />
            <Link href="/account" aria-label="Account" className={iconLink}>
              <User className="h-5 w-5" />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className={iconLink}>
              <Heart className="h-5 w-5" />
            </Link>
            <CartButton />
          </div>
        </div>
      </header>
    </>
  );
}
