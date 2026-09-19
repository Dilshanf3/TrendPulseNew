"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FALLBACK_IMAGE } from "@/lib/image-pool";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function ImageGallery({ images, productName }: { images: { url: string; altText: string | null }[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const safeImages = images.length > 0 ? images : [{ url: FALLBACK_IMAGE, altText: productName }];

  function next() {
    setActiveIndex((i) => (i + 1) % safeImages.length);
  }
  function prev() {
    setActiveIndex((i) => (i - 1 + safeImages.length) % safeImages.length);
  }

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row">
      <div className="flex gap-2 overflow-x-auto lg:w-20 lg:flex-col lg:overflow-y-auto">
        {safeImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-sm border lg:w-full",
              i === activeIndex ? "border-gold-dark" : "border-transparent"
            )}
          >
            <Image src={img.url} alt={img.altText ?? productName} fill className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>

      <div className="relative flex-1">
        <button
          onClick={() => setFullscreen(true)}
          className="relative block aspect-[3/4] w-full overflow-hidden rounded-sm bg-cream-dark"
        >
          <Image
            src={safeImages[activeIndex].url}
            alt={safeImages[activeIndex].altText ?? productName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </button>

        {safeImages.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 shadow-sm"
            >
              <ChevronLeft className="h-4 w-4 text-charcoal" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 shadow-sm"
            >
              <ChevronRight className="h-4 w-4 text-charcoal" />
            </button>
          </>
        )}
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/95">
          <button onClick={() => setFullscreen(false)} aria-label="Close" className="absolute right-4 top-4 text-white">
            <X className="h-6 w-6" />
          </button>
          <div className="relative h-[85vh] w-[90vw] max-w-2xl">
            <Image
              src={safeImages[activeIndex].url}
              alt={safeImages[activeIndex].altText ?? productName}
              fill
              className="object-contain"
            />
          </div>
          {safeImages.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 text-white">
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
