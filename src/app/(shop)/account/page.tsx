import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const LINKS = [
  { label: "Orders", href: "/account/orders", description: "Track and manage your orders" },
  { label: "Addresses", href: "/account/addresses", description: "Manage shipping addresses" },
  { label: "Profile", href: "/account/profile", description: "Update your personal information" },
  { label: "Wishlist", href: "/wishlist", description: "View your saved items" },
];

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-1 font-serif text-xl font-semibold uppercase tracking-wide">My Account</h1>
      <p className="mb-8 text-sm text-charcoal-soft">Welcome back, {session.user.name ?? session.user.email}</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-sm border border-line bg-paper p-5 shadow-sm hover:border-gold-dark hover:shadow-md">
            <p className="text-sm font-semibold uppercase tracking-wide">{link.label}</p>
            <p className="mt-1 text-xs text-charcoal-soft">{link.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
