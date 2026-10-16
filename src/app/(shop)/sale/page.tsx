import { ProductListing } from "@/components/catalog/product-listing";

export const metadata = { title: "Sale" };

export default async function SalePage(props: PageProps<"/sale">) {
  return (
    <ProductListing
      title="Sale"
      description="Limited-time prices across the collection."
      pathname="/sale"
      searchParams={await props.searchParams}
      scope={{ onSale: true }}
    />
  );
}
