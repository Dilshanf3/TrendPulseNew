import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-28 text-center">
      <p className="font-display text-7xl text-accent">404</p>
      <h1 className="mt-4 font-display text-3xl">We couldn&apos;t find that page</h1>
      <p className="mt-2 max-w-sm text-muted">It may have moved, or the link might be out of date.</p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/new-in">Shop new arrivals</Link>
        </Button>
      </div>
    </div>
  );
}
