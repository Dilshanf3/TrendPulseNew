import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { auth } from "@/lib/auth";
import { AdminUserMenu } from "./admin-user-menu";

export async function AdminTopbar() {
  const session = await auth();

  return (
    <header className="flex h-14 items-center justify-between border-b border-admin-border bg-admin-surface px-6">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-1.5 text-xs font-medium text-admin-text-muted hover:text-admin-accent"
      >
        View Storefront
        <ExternalLink className="h-3.5 w-3.5" />
      </Link>

      <AdminUserMenu name={session?.user?.name ?? null} email={session?.user?.email ?? null} role={session?.user?.role ?? null} />
    </header>
  );
}
