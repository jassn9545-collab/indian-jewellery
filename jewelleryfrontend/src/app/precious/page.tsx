import { CollectionPage } from "@/components/collection/collection-page";
import { collectionProducts } from "@/lib/catalog";
export const metadata = { title: "Precious Jewellery" };
export default function Page() {
  return (
    <CollectionPage
      title="Precious Jewellery"
      items={collectionProducts("precious")}
    />
  );
}
