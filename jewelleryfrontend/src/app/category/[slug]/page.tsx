import { notFound } from "next/navigation";
import { storefrontCategories } from "@/lib/storefront";
import { collectionProducts } from "@/lib/catalog";
import { CollectionPage } from "@/components/collection/collection-page";
export function generateStaticParams() {
  return storefrontCategories.map((c) => ({ slug: c.slug }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = storefrontCategories.find((c) => c.slug === slug);
  if (!category) notFound();
  return (
    <CollectionPage title={category.name} items={collectionProducts(slug)} />
  );
}
