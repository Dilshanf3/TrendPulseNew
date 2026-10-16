import { redirect } from "next/navigation";
import { Heart } from "lucide-react";
import { auth } from "@/lib/auth";
import { getWishlistProducts } from "@/server/services/wishlist-service";
import { ProductGrid } from "@/components/catalog/product-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/section-header";

export const metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/wishlist");

  const products = await getWishlistProducts(session.user.id);

  return (
    <div className="container-page py-10 sm:py-14">
      <PageHeader
        title="Wishlist"
        description={products.length ? `${products.length} saved ${products.length === 1 ? "item" : "items"}` : undefined}
      />
      {products.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Nothing saved yet"
          description="Tap the heart on any product to keep it here for later."
          action={{ label: "Discover new arrivals", href: "/new-in" }}
        />
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
