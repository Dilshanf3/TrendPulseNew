import Link from "next/link";
import { Banknote, RotateCcw, Truck } from "lucide-react";
import { Logo } from "./logo";
import { ACCOUNT_LINKS, SITE } from "@/config/site";
import { getMainNav } from "@/server/services/navigation";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";

const PROMISES = [
  { icon: Truck, title: "Free shipping", text: `On orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)}` },
  { icon: Banknote, title: "Cash on delivery", text: "Pay when your order arrives" },
  { icon: RotateCcw, title: "30-day returns", text: "Free returns, no questions asked" },
];

export async function SiteFooter() {
  const columns = [
    { title: "Shop", links: await getMainNav() },
    { title: "Account", links: ACCOUNT_LINKS },
  ];

  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container-page grid gap-6 border-b border-border py-10 sm:grid-cols-3">
        {PROMISES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-muted">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium">{title}</p>
              <p className="text-sm text-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted">{SITE.description}</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 text-sm font-medium">{col.title}</h3>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container-page border-t border-border py-6">
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
