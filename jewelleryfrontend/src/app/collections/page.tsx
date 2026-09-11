import { CollectionPage } from "@/components/collection/collection-page";
import { collectionProducts } from "@/lib/catalog";
export const metadata = { title: "All Jewellery" };
export default function Page() {
  return (
    <CollectionPage title="All Jewellery" items={collectionProducts("all")} />
  );
}
