import { CollectionPage } from "@/components/collection/collection-page";
import { collectionProducts } from "@/lib/catalog";
export const metadata = { title: "Best Sellers" };
export default function Page() {
  return (
    <CollectionPage
      title="Best Sellers"
      items={collectionProducts("best-sellers")}
    />
  );
}
