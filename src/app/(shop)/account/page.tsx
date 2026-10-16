import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight, Heart, Package, ShoppingBag } from "lucide-react";
import { auth } from "@/lib/auth";
import { PageHeader } from "@/components/ui/section-header";
import { SignOutButton } from "@/components/account/sign-out-button";

export const metadata = { title: "My account" };

const LINKS = [
  { label: "Orders", href: "/account/orders", description: "Track and review your orders", icon: Package },
  { label: "Wishlist", href: "/wishlist", description: "Pieces you've saved for later", icon: Heart },
  { label: "Shopping bag", href: "/cart", description: "Review what's in your bag", icon: ShoppingBag },
];

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");

  const name = session.user.name?.split(" ")[0];

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <PageHeader title={name ? `Hi, ${name}` : "My account"} description={session.user.email ?? undefined} />

        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {LINKS.map(({ label, href, description, icon: Icon }) => (
            <li key={href}>
              <Link href={href} className="flex items-center gap-4 p-5 transition-colors hover:bg-surface-muted/60">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-muted">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="block text-sm text-muted">{description}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-muted" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
