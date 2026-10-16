import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type HeroProps = {
  title: string | null;
  subtitle: string | null;
  link: string | null;
  images: { url: string; altText: string | null }[];
  showSaleLink: boolean;
};

/** Uses the active HERO banner from admin when there is one; otherwise brand copy over product photos. */
export function Hero({ title, subtitle, link, images, showSaleLink }: HeroProps) {
  const [main, secondary] = images;

  return (
    <section className="container-page grid items-center gap-10 pb-16 pt-8 sm:pt-12 lg:grid-cols-2 lg:gap-16 lg:pb-24">
      <div className="order-2 lg:order-1">
        <p className="mb-4 text-sm font-medium text-accent-strong">New season collection</p>
        <h1 className="font-display text-[2.75rem] leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          {title ?? (
            <>
              Effortless style,
              <br />
              <span className="italic text-accent">every day.</span>
            </>
          )}
        </h1>
        <p className="mt-6 max-w-md text-base text-muted sm:text-lg">
          {subtitle ?? "Considered essentials and fresh-season pieces — delivered to your door, with cash on delivery."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={link ?? "/new-in"}>{link ? "Shop now" : "Shop new arrivals"}</Link>
          </Button>
          {showSaleLink && (
            <Button asChild size="lg" variant="outline">
              <Link href="/sale">Explore the sale</Link>
            </Button>
          )}
        </div>
      </div>

      {main && (
        <div className="relative order-1 lg:order-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-muted sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image src={main.url} alt={main.altText ?? ""} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
          {secondary && (
            <div className="absolute -bottom-6 -left-6 hidden aspect-[3/4] w-40 overflow-hidden rounded-xl border-4 border-background bg-surface-muted shadow-lg xl:block">
              <Image src={secondary.url} alt="" fill sizes="160px" className="object-cover" />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
