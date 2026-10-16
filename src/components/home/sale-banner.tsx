import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

/** Only rendered when products are actually on sale; the headline uses the real deepest discount. */
export function SaleBanner({ maxDiscount, image }: { maxDiscount: number; image: string | null }) {
  return (
    <section className="container-page py-12 sm:py-16">
      <div className="grid overflow-hidden rounded-2xl bg-primary text-primary-foreground md:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
          <p className="mb-3 text-sm font-medium text-accent">On sale now</p>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">Up to {maxDiscount}% off</h2>
          <p className="mt-4 max-w-sm text-primary-foreground/70">Selected favourites at reduced prices, while stock lasts.</p>
          <Button asChild size="lg" className="mt-8 w-fit bg-primary-foreground text-foreground hover:bg-primary-foreground/90">
            <Link href="/sale">Shop the sale</Link>
          </Button>
        </div>
        {image && (
          <div className="relative min-h-64 md:min-h-96">
            <Image src={image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
