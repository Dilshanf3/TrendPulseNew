import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import type { ShopCategory } from "@/server/services/storefront-service";

export function CategoryGrid({ categories }: { categories: ShopCategory[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="container-page py-12 sm:py-16">
      <SectionHeader title="Shop by category" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/${category.slug}`}
            className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-surface-muted sm:aspect-[4/3]"
          >
            {category.image && (
              <Image
                src={category.image}
                alt=""
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-white sm:p-5">
              <div>
                <h3 className="font-display text-xl sm:text-2xl">{category.name}</h3>
                {category.description && <p className="mt-0.5 hidden text-sm text-white/80 sm:block">{category.description}</p>}
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
