import { CollectionPage } from "@/components/collection/collection-page";
import { collectionProducts } from "@/lib/catalog";
export const metadata = { title: "Lab Grown Diamonds" };
export default function Page() {
  return (
    <CollectionPage
      title="Lab Grown Diamonds"
      items={collectionProducts("lab-grown-diamonds")}
    />
  );
}
