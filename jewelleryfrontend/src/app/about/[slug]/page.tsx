import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
const pages: Record<
  string,
  { title: string; copy: string; heading: string; detail: string }
> = {
  story: {
    title: "Jewellery & You",
    copy: "TECHGLOCK is a celebration of modern Indian style. Of the pieces you reach for every morning, and the ones you save for a moment that matters.",
    heading: "Rooted in heritage. Made for today.",
    detail:
      "Our design direction pairs the richness of Indian jewellery traditions with considered, contemporary silhouettes. A little nostalgia. A fresh point of view. Something that feels like you.",
  },
  craftsmanship: {
    title: "Royally Crafted for You",
    copy: "Kundan-inspired settings. Delicate pearl accents. Sculptural silver petals. Our collection draws from a rich vocabulary of Indian ornament.",
    heading: "Beauty is in the details",
    detail:
      "We believe jewellery should feel as considered as it looks. This preview explores intricate motifs, wearable proportions and thoughtful finishing. Final production specifications will be shared before launch.",
  },
  sustainability: {
    title: "Thoughtfully, for Tomorrow",
    copy: "We are building a jewellery brand around considered choices and pieces you want to keep wearing.",
    heading: "Our next steps",
    detail:
      "Materials sourcing, packaging choices and supplier standards are being developed. We will share specific, verified commitments as the collection moves toward launch.",
  },
};
export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: pages[slug]?.title || "Our world" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = pages[slug];
  if (!p) notFound();
  return (
    <main id="main" className="container page-shell prose">
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>Our world</span>
      </nav>
      <h1>{p.title}</h1>
      <p>{p.copy}</p>
      <Image
        src="/images/hero.webp"
        alt="TECHGLOCK emerald kundan jewellery"
        width={1000}
        height={667}
      />
      <h2>{p.heading}</h2>
      <p>{p.detail}</p>
      <Link className="button" href="/collections/all">
        Discover the collection
      </Link>
    </main>
  );
}
