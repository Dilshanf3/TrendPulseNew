import Link from "next/link";
import type { MegaMenuColumn } from "@/lib/nav-data";

export function MegaMenu({ columns }: { columns: MegaMenuColumn[] }) {
  return (
    <div className="absolute left-0 top-full z-40 w-full border-t border-line bg-paper shadow-xl">
      <div className="mx-auto grid max-w-[1400px] grid-cols-4 gap-8 px-8 py-8">
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-gold-dark">{col.title}</h3>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-charcoal-soft transition-colors hover:text-charcoal hover:underline decoration-gold underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
