import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/lib/catalog";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductCard } from "@/components/product/product-card";
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = products.find((p) => p.id === slug);
  return {
    title: p?.name || "Product not found",
    description: p?.description,
    alternates: { canonical: "/products/" + slug },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.id === slug);
  if (!product) notFound();
  return (
    <main id="main" className="container page-shell">
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href={"/collections/" + product.category.toLowerCase()}>
          {product.category}
        </Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>
      <ProductDetail product={product} />
      <section className="section">
        <div className="section-heading">
          <h2>A beautiful pairing</h2>
        </div>
        <div className="product-grid">
          {products
            .filter((p) => p.id !== slug)
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
    </main>
  );
}
