import { Collection } from "@/components/collection/collection";
import { products } from "@/lib/catalog";
export const metadata = { title: "Search jewellery" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q: rawQuery } = await searchParams;
  const q = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery)?.trim() ?? "";
  const found = products.filter((p) =>
    (p.name + " " + p.category + " " + p.material)
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  return (
    <main id="main" className="listing-container page-shell">
      <div className="page-heading search-page-heading">
        <h1>Find your next favourite</h1>
      </div>
      <form action="/search" className="search-page-form">
        <input
          aria-label="Search jewellery"
          name="q"
          defaultValue={q}
          placeholder="Search jewellery, collections..."
        />
        <button className="button">Search</button>
      </form>
      <Collection items={found} />
    </main>
  );
}
