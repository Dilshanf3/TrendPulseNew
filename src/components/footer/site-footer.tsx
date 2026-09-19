import Link from "next/link";
import Image from "next/image";

const FOOTER_COLUMNS = [
  {
    title: "Help",
    links: [
      { label: "Contact Us", href: "#" },
      { label: "Shipping Info", href: "#" },
      { label: "Returns & Refunds", href: "#" },
      { label: "Size Guide", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
  {
    title: "About TrendPulse",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Sustainability", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "New In", href: "/new-in" },
      { label: "Women", href: "/women" },
      { label: "Men", href: "/men" },
      { label: "Sale", href: "/sale" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-gold-dark/30 bg-charcoal text-cream/80">
      <div className="mx-auto max-w-[1400px] px-4 py-12 lg:px-8">
        <div className="mb-10 max-w-md">
          <h3 className="mb-1 font-serif text-lg font-semibold tracking-wide text-cream">Subscribe & Save 10%</h3>
          <p className="mb-3 text-sm text-cream/60">Sign up for exclusive offers, new arrivals, and trend updates.</p>
          <form className="flex h-11 rounded-sm border border-cream/20 bg-charcoal focus-within:border-gold">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-transparent px-4 text-sm text-cream outline-none placeholder:text-cream/40"
            />
            <button type="submit" className="shrink-0 rounded-r-sm bg-gold px-6 text-xs font-bold uppercase text-white transition-colors hover:bg-gold-light">
              Subscribe
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-gold-light">{col.title}</h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-cream/60 transition-colors hover:text-cream">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="relative h-8 w-8 overflow-hidden rounded-full bg-cream">
              <Image
                src="/images/logo.jpg"
                alt="TrendPulse"
                fill
                className="scale-[2.1] object-cover"
                style={{ objectPosition: "50% 30%" }}
              />
            </span>
            <span className="font-serif text-lg font-semibold tracking-wide text-cream">TrendPulse</span>
          </div>
          <p className="text-xs text-cream/40">© {new Date().getFullYear()} TrendPulse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
