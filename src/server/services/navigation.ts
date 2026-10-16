import type { NavLink } from "@/config/site";
import { getSaleSummary, getShopCategories } from "./storefront-service";

/** Main navigation: New In, every category that has products, and Sale when something is on sale. */
export async function getMainNav(): Promise<NavLink[]> {
  const [categories, sale] = await Promise.all([getShopCategories(), getSaleSummary()]);
  return [
    { label: "New In", href: "/new-in" },
    ...categories.map((c) => ({ label: c.name, href: `/${c.slug}` })),
    ...(sale.count > 0 ? [{ label: "Sale", href: "/sale", highlight: true }] : []),
  ];
}
