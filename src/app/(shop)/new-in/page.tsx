import { ProductListing } from "@/components/catalog/product-listing";

export const metadata = { title: "New In" };

export default async function NewInPage(props: PageProps<"/new-in">) {
  return (
    <ProductListing
      title="New In"
      description="The latest arrivals, fresh for the season."
      pathname="/new-in"
      searchParams={await props.searchParams}
      scope={{ isNew: true }}
    />
  );
}
