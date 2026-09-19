import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Truck, RotateCcw } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/server/services/product-service";
import { toProductCard } from "@/lib/utils/map-product";
import { ImageGallery } from "@/components/product/image-gallery";
import { AddToCartPanel } from "@/components/product/add-to-cart-panel";
import { ReviewsSection } from "@/components/product/reviews-section";
import { ProductSection } from "@/components/home/product-section";
import { formatPrice, calcDiscountPercent } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.metaDescription ?? product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);

  const basePrice = Number(product.basePrice);
  const salePrice = product.salePrice ? Number(product.salePrice) : null;
  const discount = salePrice ? calcDiscountPercent(basePrice, salePrice) : 0;

  const plainVariants = product.variants.map((v) => ({
    id: v.id,
    productId: v.productId,
    sku: v.sku,
    color: v.color,
    colorHex: v.colorHex,
    size: v.size,
    price: Number(v.price),
    salePrice: v.salePrice ? Number(v.salePrice) : null,
    stock: v.stock,
    reservedStock: v.reservedStock,
    image: v.image,
    isActive: v.isActive,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => i.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "LKR",
      price: salePrice ?? basePrice,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: product.ratingCount > 0 ? {
      "@type": "AggregateRating",
      ratingValue: Number(product.ratingAvg),
      reviewCount: product.ratingCount,
    } : undefined,
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-4 flex items-center gap-1 text-xs text-charcoal-soft">
        <Link href="/" className="hover:text-gold-dark">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/${product.category.slug}`} className="hover:text-gold-dark">{product.category.name}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 pb-16 lg:grid-cols-2">
        <ImageGallery images={product.images} productName={product.name} />

        <div>
          <h1 className="font-serif text-xl font-semibold tracking-wide text-charcoal sm:text-2xl">{product.name}</h1>

          {product.ratingCount > 0 && (
            <p className="mt-1 text-sm text-charcoal-soft">
              ★ {Number(product.ratingAvg).toFixed(1)} ({product.ratingCount} reviews)
            </p>
          )}

          <div className="mt-4 flex items-baseline gap-3">
            {salePrice ? (
              <>
                <span className="text-2xl font-bold text-gold-dark">{formatPrice(salePrice)}</span>
                <span className="text-base text-charcoal-soft/60 line-through">{formatPrice(basePrice)}</span>
                <span className="rounded-sm bg-gold px-1.5 py-0.5 text-xs font-bold text-charcoal">-{discount}%</span>
              </>
            ) : (
              <span className="text-2xl font-bold text-charcoal">{formatPrice(basePrice)}</span>
            )}
          </div>

          <div className="mt-6 border-t border-line pt-6">
            <AddToCartPanel productId={product.id} variants={plainVariants} />
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-line pt-6 text-sm text-charcoal-soft">
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Free standard shipping on orders over Rs. 5,000. Cash on delivery available.</span>
            </div>
            <div className="flex items-start gap-3">
              <RotateCcw className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Free returns within 30 days of delivery.</span>
            </div>
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-charcoal">Description</h2>
            <p className="text-sm text-charcoal-soft">{product.description}</p>
            {product.details && <p className="mt-2 text-sm text-charcoal-soft">{product.details}</p>}
            {product.material && (
              <p className="mt-3 text-xs text-charcoal-soft/70">
                <span className="font-semibold text-charcoal">Material:</span> {product.material}
              </p>
            )}
            {product.careInstructions && (
              <p className="mt-1 text-xs text-charcoal-soft/70">
                <span className="font-semibold text-charcoal">Care:</span> {product.careInstructions}
              </p>
            )}
          </div>
        </div>
      </div>

      <ReviewsSection
        reviews={product.reviews as unknown as import("@/types").ReviewWithUser[]}
        ratingAvg={Number(product.ratingAvg)}
        ratingCount={product.ratingCount}
      />

      <ProductSection title="You May Also Like" products={related.map(toProductCard)} />
    </div>
  );
}
