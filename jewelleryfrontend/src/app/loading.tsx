export default function Loading() {
  return (
    <main
      id="main"
      className="container page-shell"
      aria-label="Loading jewellery"
    >
      <div className="skeleton loading-heading" />
      <div className="product-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton" />
        ))}
      </div>
    </main>
  );
}
