import Image from "next/image";
import { cn } from "@/lib/utils";
import { FALLBACK_IMAGE } from "@/lib/image-pool";

/**
 * Swipeable strip on mobile, editorial grid on desktop (first image full width).
 * Pure CSS — no client JavaScript needed.
 */
export function ImageGallery({ images, productName }: { images: { url: string; altText: string | null }[]; productName: string }) {
  const list = images.length > 0 ? images : [{ url: FALLBACK_IMAGE, altText: productName }];

  return (
    <div
      className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-3 lg:overflow-visible lg:px-0"
      aria-label={`${productName} images`}
    >
      {list.map((img, i) => (
        <div
          key={img.url + i}
          className={cn(
            "relative aspect-[3/4] w-[85%] shrink-0 snap-center overflow-hidden rounded-xl bg-surface-muted sm:w-[60%] lg:w-auto",
            i === 0 && list.length % 2 === 1 && "lg:col-span-2"
          )}
        >
          <Image
            src={img.url}
            alt={img.altText ?? `${productName} — image ${i + 1}`}
            fill
            priority={i === 0}
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 60vw, 30vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
