import Link from "next/link";
import { Collection } from "./collection";
import type { Product } from "@/lib/catalog";
export function CollectionPage({
  title,
  items,
}: {
  title: string;
  items: Product[];
}) {
  return (
    <main id="main" className="container page-shell">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>{title}</span>
      </nav>
      <div className="page-heading">
        <span className="eyebrow">THE INDIAN JEWELLERY COLLECTION</span>
        <h1>{title}</h1>
        <p>Thoughtfully chosen pieces for your everyday and extraordinary.</p>
      </div>
      <Collection items={items} />
    </main>
  );
}
