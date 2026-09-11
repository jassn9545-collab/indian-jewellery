import ProductPage, {
  generateMetadata as productMetadata,
} from "@/app/products/[slug]/page";
import { products } from "@/lib/catalog";
export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return productMetadata({ params: Promise.resolve({ slug: id }) });
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductPage params={Promise.resolve({ slug: id })} />;
}
