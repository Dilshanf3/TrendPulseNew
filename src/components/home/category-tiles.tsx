import Link from "next/link";
import Image from "next/image";
import { pickCategoryTileImage } from "@/lib/image-pool";

const TILES = [
  { label: "Women", href: "/women", slug: "women" },
  { label: "Men", href: "/men", slug: "men" },
  { label: "Kids", href: "/kids", slug: "kids" },
  { label: "Beauty", href: "/beauty", slug: "beauty" },
  { label: "Home", href: "/home", slug: "home" },
];

export function CategoryTiles() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 lg:px-8">
      <h2 className="mb-5 text-center font-serif text-2xl font-semibold tracking-wide text-charcoal sm:text-3xl">Shop by Category</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {TILES.map((tile) => (
          <Link key={tile.label} href={tile.href} className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-cream-dark shadow-sm transition-shadow duration-300 hover:shadow-md">
            <Image
              src={pickCategoryTileImage(tile.slug)}
              alt={tile.label}
              fill
              sizes="(max-width: 640px) 50vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-charcoal/60 to-transparent p-4">
              <span className="text-sm font-bold uppercase tracking-wide text-cream">{tile.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
