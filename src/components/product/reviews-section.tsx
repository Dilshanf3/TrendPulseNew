import { Star } from "lucide-react";
import Image from "next/image";
import type { ReviewWithUser } from "@/types";

export function ReviewsSection({
  reviews,
  ratingAvg,
  ratingCount,
}: {
  reviews: ReviewWithUser[];
  ratingAvg: number;
  ratingCount: number;
}) {
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <section className="border-t border-line py-10">
      <h2 className="mb-6 font-serif text-lg font-semibold uppercase tracking-wide text-charcoal">Reviews ({ratingCount})</h2>

      <div className="mb-8 flex flex-col gap-8 sm:flex-row">
        <div className="flex shrink-0 flex-col items-center gap-1 sm:w-48">
          <span className="text-4xl font-black text-charcoal">{ratingAvg.toFixed(1)}</span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.round(ratingAvg) ? "fill-gold text-gold" : "text-charcoal-soft/30"}`} />
            ))}
          </div>
          <span className="text-xs text-charcoal-soft">{ratingCount} reviews</span>
        </div>

        <div className="flex-1">
          {distribution.map(({ star, count }) => (
            <div key={star} className="mb-1.5 flex items-center gap-2">
              <span className="w-10 text-xs text-charcoal-soft">{star} star</span>
              <div className="h-2 flex-1 rounded-sm bg-cream-dark">
                <div
                  className="h-2 rounded-sm bg-gold"
                  style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%" }}
                />
              </div>
              <span className="w-6 text-right text-xs text-charcoal-soft/70">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col divide-y divide-line">
        {reviews.length === 0 && <p className="py-6 text-sm text-charcoal-soft/70">No reviews yet. Be the first to review this product.</p>}
        {reviews.map((review) => (
          <div key={review.id} className="py-5">
            <div className="mb-1 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-gold text-gold" : "text-charcoal-soft/30"}`} />
                ))}
              </div>
              {review.isVerifiedPurchase && (
                <span className="text-[10px] font-semibold uppercase text-emerald-600">Verified Purchase</span>
              )}
            </div>
            {review.title && <p className="mb-1 text-sm font-semibold text-charcoal">{review.title}</p>}
            {review.body && <p className="text-sm text-charcoal-soft">{review.body}</p>}
            {review.images.length > 0 && (
              <div className="mt-2 flex gap-2">
                {review.images.map((img) => (
                  <div key={img.id} className="relative h-16 w-16 overflow-hidden rounded-sm bg-cream-dark">
                    <Image src={img.url} alt="Review photo" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
            <p className="mt-2 text-xs text-charcoal-soft/60">{review.user.name ?? "Anonymous"}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
