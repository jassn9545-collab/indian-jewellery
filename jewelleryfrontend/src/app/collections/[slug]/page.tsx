import { CollectionPage } from "@/components/collection/collection-page";
import { navigation } from "@/lib/storefront";
import { notFound } from "next/navigation";
import {
  categories,
  styles,
  collectionProducts,
  collectionTitle,
} from "@/lib/catalog";
const slugs = [
  ...new Set([
    "all",
    "new-in",
    "offers",
    "best-sellers",
    ...categories.map((c) => c.slug),
    ...styles.map((s) => s.slug),
  ]),
];
export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: collectionTitle(slug),
    alternates: { canonical: "/collections/" + slug },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slugs.includes(slug)) {
    const known = navigation
      .flatMap((n) => [
        n.href,
        ...(n.columns?.flatMap((c) => c.links.map((l) => l.href)) ?? []),
      ])
      .includes("/collections/" + slug);
    if (!known) notFound();
    return (
      <CollectionPage
        title={collectionTitle(slug)}
        items={collectionProducts(slug)}
      />
    );
  }
  return (
    <CollectionPage
      title={collectionTitle(slug)}
      items={collectionProducts(slug)}
    />
  );
}
