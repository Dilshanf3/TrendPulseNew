import Link from "next/link";

export function AuthHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-3xl sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </div>
  );
}

export function AuthFooter({ prompt, linkLabel, href }: { prompt?: string; linkLabel: string; href: string }) {
  return (
    <p className="mt-8 text-center text-sm text-muted">
      {prompt}{" "}
      <Link href={href} className="font-medium text-foreground underline underline-offset-4 hover:text-accent-strong">
        {linkLabel}
      </Link>
    </p>
  );
}
