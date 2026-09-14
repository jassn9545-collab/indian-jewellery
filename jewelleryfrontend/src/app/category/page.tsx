import { CollectionPage } from "@/components/collection/collection-page";
import { collectionProducts } from "@/lib/catalog";

export const metadata = { title: "Category - All Jewellery" };

export default function CategoryPage() {
  return (
    <CollectionPage title="All Categories" items={collectionProducts("all")} />
  );
}
