import { notFound } from "next/navigation";
import { products } from "@/lib/catalog";
import { Placeholder } from "@/components/storefront/placeholder";
export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
  return <Placeholder title={product.name} category={product.category} />;
}
