import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { RatingStars } from "@/components/ui/rating-stars";
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
    <section id="reviews" className="scroll-mt-24 border-t border-border py-16">
      <h2 className="mb-10 font-display text-2xl sm:text-3xl">Reviews</h2>

      <div className="grid gap-12 lg:grid-cols-[18rem_1fr]">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-semibold tracking-tight">{ratingAvg.toFixed(1)}</span>
            <span className="text-sm text-muted">out of 5</span>
          </div>
          <RatingStars value={ratingAvg} className="mt-2" />
          <p className="mt-1 text-sm text-muted">Based on {ratingCount} reviews</p>

          <dl className="mt-6 flex flex-col gap-2">
            {distribution.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-3 text-sm">
                <dt className="w-3 text-muted">{star}</dt>
                <dd className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-muted">
                  <div className="h-full rounded-full bg-accent" style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%" }} />
                </dd>
                <dd className="w-6 text-right text-muted tabular-nums">{count}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col divide-y divide-border">
          {reviews.length === 0 && <p className="text-sm text-muted">No reviews yet.</p>}
          {reviews.map((review) => (
            <article key={review.id} className="py-6 first:pt-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <RatingStars value={review.rating} />
                <span className="text-sm font-medium">{review.user.name ?? "Anonymous"}</span>
                {review.isVerifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified purchase
                  </span>
                )}
              </div>
              {review.title && <p className="mt-3 font-medium">{review.title}</p>}
              {review.body && <p className="mt-1 text-sm leading-relaxed text-muted">{review.body}</p>}
              {review.images.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {review.images.map((img) => (
                    <div key={img.id} className="relative h-20 w-20 overflow-hidden rounded-lg bg-surface-muted">
                      <Image src={img.url} alt="Photo from review" fill sizes="80px" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
