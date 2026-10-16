/** Skeleton shown while a shop page's data loads. */
export default function Loading() {
  return (
    <div className="container-page animate-pulse py-10 sm:py-14" aria-busy="true" aria-label="Loading">
      <div className="mb-3 h-9 w-48 rounded-lg bg-surface-muted" />
      <div className="mb-10 h-4 w-72 rounded bg-surface-muted" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i}>
            <div className="aspect-[3/4] rounded-xl bg-surface-muted" />
            <div className="mt-3 h-4 w-3/4 rounded bg-surface-muted" />
            <div className="mt-2 h-4 w-1/3 rounded bg-surface-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
