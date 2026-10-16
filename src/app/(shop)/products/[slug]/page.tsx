import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronDown, ChevronRight, RotateCcw, Truck } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/server/services/product-service";
import { getSavedProductIds } from "@/server/services/wishlist-service";
import { ImageGallery } from "@/components/product/image-gallery";
import { AddToCartPanel } from "@/components/product/add-to-cart-panel";
import { ReviewsSection } from "@/components/product/reviews-section";
import { ProductRail } from "@/components/home/product-rail";
import { Price } from "@/components/ui/price";
import { RatingStars } from "@/components/ui/rating-stars";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";
import type { ReviewWithUser } from "@/types";

export async function generateMetadata(props: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
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

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, savedIds] = await Promise.all([getRelatedProducts(product.categoryId, product.id), getSavedProductIds()]);

  const basePrice = Number(product.basePrice);
  const salePrice = product.salePrice ? Number(product.salePrice) : null;
  const ratingAvg = Number(product.ratingAvg);

  const { category } = product;
  const parent = category.parent;
  const crumbs = [
    { label: "Home", href: "/" },
    ...(parent ? [{ label: parent.name, href: `/${parent.slug}` }] : []),
    { label: category.name, href: parent ? `/${parent.slug}?category=${category.slug}` : `/${category.slug}` },
  ];

  const variants = product.variants
    .filter((v) => v.isActive)
    .map((v) => ({
      id: v.id,
      color: v.color,
      colorHex: v.colorHex,
      size: v.size,
      stock: v.stock,
      reservedStock: v.reservedStock,
    }));

  const details = [
    { title: "Description", body: [product.description, product.details].filter(Boolean).join("\n\n") },
    {
      title: "Material & care",
      body: [product.material && `Material: ${product.material}`, product.careInstructions && `Care: ${product.careInstructions}`]
        .filter(Boolean)
        .join("\n"),
    },
  ].filter((d) => d.body);

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
    aggregateRating:
      product.ratingCount > 0
        ? { "@type": "AggregateRating", ratingValue: ratingAvg, reviewCount: product.ratingCount }
        : undefined,
  };

  return (
    <>
      <div className="container-page pt-6">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
            {crumbs.map((c) => (
              <li key={c.href} className="flex items-center gap-1.5">
                <Link href={c.href} className="hover:text-foreground">
                  {c.label}
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
            ))}
            <li aria-current="page" className="line-clamp-1 text-foreground">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 pb-16 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
          <ImageGallery images={product.images} productName={product.name} />

          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-sm text-muted">{category.name}</p>
            <h1 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">{product.name}</h1>

            {product.ratingCount > 0 && (
              <a href="#reviews" className="mt-3 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
                <RatingStars value={ratingAvg} />
                {ratingAvg.toFixed(1)} · {product.ratingCount} reviews
              </a>
            )}

            <Price basePrice={basePrice} salePrice={salePrice} size="lg" showDiscount className="mt-5" />

            <div className="mt-8">
              <AddToCartPanel productId={product.id} variants={variants} saved={savedIds.has(product.id)} />
            </div>

            <ul className="mt-8 flex flex-col gap-3 rounded-xl bg-surface-muted p-5 text-sm">
              <li className="flex gap-3">
                <Truck className="h-5 w-5 shrink-0" />
                <span>
                  Free standard shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)}. Cash on delivery available.
                </span>
              </li>
              <li className="flex gap-3">
                <RotateCcw className="h-5 w-5 shrink-0" />
                <span>Free returns within 30 days of delivery.</span>
              </li>
            </ul>

            <div className="mt-8 divide-y divide-border border-y border-border">
              {details.map((d, i) => (
                <details key={d.title} open={i === 0} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                    {d.title}
                    <ChevronDown className="h-4 w-4 text-muted transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="whitespace-pre-line pb-5 text-sm leading-relaxed text-muted">{d.body}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        <ReviewsSection
          reviews={product.reviews as unknown as ReviewWithUser[]}
          ratingAvg={ratingAvg}
          ratingCount={product.ratingCount}
        />
      </div>
      <ProductRail title="You may also like" products={related} />
    </>
  );
}
