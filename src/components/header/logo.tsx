import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex shrink-0 items-center gap-2", className)}>
      <span className="relative h-9 w-9 overflow-hidden rounded-full bg-cream sm:h-10 sm:w-10">
        <Image
          src="/images/logo.jpg"
          alt="TrendPulse"
          fill
          className="scale-[2.1] object-cover"
          style={{ objectPosition: "50% 30%" }}
          priority
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-lg font-semibold tracking-wide text-charcoal sm:text-xl">TrendPulse</span>
        <span className="hidden text-[9px] font-medium uppercase tracking-[0.25em] text-gold-dark sm:block">
          Online Fashion Store
        </span>
      </span>
    </Link>
  );
}
