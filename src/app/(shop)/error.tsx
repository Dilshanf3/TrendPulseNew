"use client";

import { Button } from "@/components/ui/button";

export default function ShopError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page flex flex-col items-center py-28 text-center">
      <h1 className="font-display text-3xl">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-muted">We couldn&apos;t load this page. Please try again in a moment.</p>
      <Button className="mt-8" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
