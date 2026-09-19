import Link from "next/link";
import Image from "next/image";
import { HERO_IMAGE } from "@/lib/image-pool";

export function HeroBanner() {
  return (
    <section className="relative flex h-[60vh] min-h-[420px] w-full items-end overflow-hidden bg-charcoal sm:h-[75vh]">
      <Image
        src={HERO_IMAGE}
        alt="The new season"
        fill
        priority
        className="object-cover opacity-75"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
      <div className="relative z-10 w-full px-6 pb-12 text-cream sm:px-12 sm:pb-16">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-light">New Season</p>
        <h1 className="mb-4 max-w-lg font-serif text-4xl font-semibold leading-tight sm:text-6xl">The New Season</h1>
        <p className="mb-6 max-w-md text-sm text-cream/80 sm:text-base">Discover the latest trends, curated for every style.</p>
        <Link
          href="/new-in"
          className="inline-flex h-12 items-center rounded-sm bg-gold px-8 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-gold-dark"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
