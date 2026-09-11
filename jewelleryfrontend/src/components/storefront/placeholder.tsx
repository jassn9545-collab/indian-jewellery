import Link from "next/link";
export function Placeholder({
  title,
  category,
}: {
  title: string;
  category?: string;
}) {
  return (
    <main id="main" className="sf-placeholder">
      <span className="sf-eyebrow">INDIAN JEWELLERY</span>
      <h1>{title}</h1>
      {category && <p>Selected category: {category}</p>}
      <p>
        This collection is coming soon. Discover our featured pieces on the
        homepage.
      </p>
      <Link className="sf-button" href="/">
        Back to home
      </Link>
    </main>
  );
}
