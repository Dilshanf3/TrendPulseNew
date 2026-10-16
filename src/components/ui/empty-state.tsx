import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "./button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-muted">
        <Icon className="h-6 w-6" />
      </span>
      <p className="text-base font-medium text-foreground">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p>}
      {action && (
        <Button asChild className="mt-6">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
