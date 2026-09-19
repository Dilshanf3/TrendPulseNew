import Link from "next/link";
import Image from "next/image";
import { pickCategoryImage } from "@/lib/image-pool";

export function PromoBanner({
  title,
  subtitle,
  href,
  categorySlug,
}: {
  title: string;
  subtitle: string;
  href: string;
  categorySlug: string;
}) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8">
      <Link href={href} className="group relative block h-56 overflow-hidden rounded-sm bg-cream-dark shadow-sm transition-shadow duration-300 hover:shadow-md sm:h-72">
        <Image
          src={pickCategoryImage(categorySlug, `promo-${categorySlug}`, 1400, 500)}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex flex-col items-start justify-center bg-charcoal/40 px-8 text-cream">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-light">{subtitle}</p>
          <h3 className="mt-1 font-serif text-3xl font-semibold sm:text-5xl">{title}</h3>
          <span className="mt-3 border-b border-gold pb-0.5 text-xs font-bold uppercase tracking-wide text-cream">Shop Now</span>
        </div>
      </Link>
    </section>
  );
}
