import { Placeholder } from "@/components/storefront/placeholder";
import { navigation } from "@/lib/storefront";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categories,
  styles,
  collectionProducts,
  collectionTitle,
} from "@/lib/catalog";
import { Collection } from "@/components/collection/collection";
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
      <Placeholder
        title={collectionTitle(slug)}
        category={collectionTitle(slug)}
      />
    );
  }
  return (
    <main id="main" className="container page-shell">
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>{collectionTitle(slug)}</span>
      </nav>
      <div className="page-heading">
        <span className="eyebrow">THE INDIAN JEWELLERY COLLECTION</span>
        <h1>{collectionTitle(slug)}</h1>
        <p>Thoughtfully chosen pieces for your everyday and extraordinary.</p>
      </div>
      <Collection items={collectionProducts(slug)} />
    </main>
  );
}
