import { prisma } from "@/lib/db/prisma";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: { product: true, user: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-bold text-admin-text">Reviews ({reviews.length})</h1>

      <div className="flex flex-col divide-y divide-admin-border rounded-sm border border-admin-border bg-admin-surface shadow-sm">
        {reviews.map((review) => (
          <div key={review.id} className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-semibold text-admin-text">{review.product.name}</span>
              <span className="text-xs text-admin-accent">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
            </div>
            {review.body && <p className="text-sm text-admin-text-muted">{review.body}</p>}
            <p className="mt-1 text-xs text-admin-text-muted">by {review.user.name ?? "Anonymous"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
