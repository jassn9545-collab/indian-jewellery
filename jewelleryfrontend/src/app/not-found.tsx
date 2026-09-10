import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="container empty-state">
      <span className="eyebrow">404</span>
      <h1>This piece of the story is missing</h1>
      <p>Let us take you back to something beautiful.</p>
      <Link className="button" href="/collections/all">
        Explore jewellery
      </Link>
    </main>
  );
}
