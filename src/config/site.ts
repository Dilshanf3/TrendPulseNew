/**
 * Static brand configuration only. Anything catalog-related (categories, navigation, filter
 * options, merchandising) comes from the database — see server/services/storefront-service.ts.
 */

export const SITE = {
  name: "TrendPulse",
  tagline: "Online Fashion Store",
  description: "Shop the latest trends in women's, men's, and kids' fashion at TrendPulse.",
} as const;

export type NavLink = { label: string; href: string; highlight?: boolean };

/** Links to app pages (not catalog data), shown in the footer. */
export const ACCOUNT_LINKS: NavLink[] = [
  { label: "My account", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Shopping bag", href: "/cart" },
];
