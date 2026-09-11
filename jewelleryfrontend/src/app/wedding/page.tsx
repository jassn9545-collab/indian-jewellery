import { CollectionPage } from "@/components/collection/collection-page";
import { collectionProducts } from "@/lib/catalog";
export const metadata = { title: "Wedding" };
export default function Page() {
  return (
    <CollectionPage title="Wedding" items={collectionProducts("wedding")} />
  );
}
