"use client";
import Link from "next/link";
import {
  ArrowUpRight,
  Diamond,
  Grid2X2,
  Sparkles,
  Star,
  MessageSquare,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Database, modules, money } from "@/lib/admin-data";
import { Media, StatusToggle } from "./ui";

export function Dashboard({ db, name, threshold = 10 }: { db: Database; name: string; threshold?: number }) {
  const stats = [
    {
      label: "Total products",
      value: db.products.length,
      meta: `${db.products.filter((p) => p.status === "Active").length} active products`,
      icon: Diamond,
      href: "products",
    },
    {
      label: "Total categories",
      value: db.categories.length,
      meta: "Organize your collection",
      icon: Grid2X2,
      href: "categories",
    },
    {
      label: "New launch",
      value: db["new-launch"].length,
      meta: "Fresh additions to your store",
      icon: Sparkles,
      href: "new-launch",
    },
    {
      label: "Best sellers",
      value: db["best-sellers"].length,
      meta: "Featured customer favourites",
      icon: Star,
      href: "best-sellers",
    },
    {
      label: "Customer reviews",
      value: db.reviews.length,
      meta: `${db.reviews.filter((r) => r.verified).length} verified reviews`,
      icon: MessageSquare,
      href: "reviews",
    },
  ];
  const categories = db.categories
    .map((c) => ({
      ...c,
      count: db.products.filter((p) => p.categoryId === c.id).length,
    }))
    .filter((c) => c.count)
    .sort((a, b) => b.count - a.count);
  const max = Math.max(1, ...categories.map((c) => c.count));
  const active = db.products.filter((p) => p.status === "Active").length;
  const low = db.products.filter(
    (p) => (p.stock || 0) > 0 && (p.stock || 0) <= threshold,
  ).length;
  const out = db.products.filter((p) => !p.stock).length;
  const stocked = db.products.length - low - out;
  const total = Math.max(db.products.length, 1);
  const featured = modules.filter((m) =>
    [
      "new-launch",
      "royally-crafted",
      "pure-silver",
      "best-sellers",
      "trending-looks",
    ].includes(m[0]),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR STORE, AT A GLANCE</div>
          <h1>Welcome back, {name.split(" ")[0]}.</h1>
          <p>A little care today. A beautiful collection tomorrow.</p>
        </div>
        <Link className="button" href="/admin/products/add">
          <Plus size={16} /> Add product
        </Link>
      </div>
      <div className="stat-grid">
        {stats.map((s) => (
          <Link href={`/admin/${s.href}`} className="stat-card" key={s.label}>
            <div className="stat-label">
              <span>{s.label}</span>
              <s.icon size={18} />
            </div>
            <div className="stat-value">
              {s.value}
              <ArrowUpRight size={19} />
            </div>
            <small>{s.meta}</small>
          </Link>
        ))}
      </div>
      <div className="chart-grid">
        <section className="panel category-chart">
          <div className="panel-heading">
            <div>
              <h2>Products by category</h2>
              <p>A balanced view of your collection</p>
            </div>
            <span className="pill">{db.products.length} products</span>
          </div>
          <div
            className="bars"
            role="img"
            aria-label={`Products by category: ${categories.map((c) => `${c.name}: ${c.count}`).join(", ") || "No products"}`}
          >
            {categories.length ? (
              categories.map((c) => (
                <Link
                  href={`/admin/categories/${c.id}/products`}
                  className="bar-row"
                  key={c.id}
                  title={`${c.name}: ${c.count} products`}
                >
                  <span>{c.name}</span>
                  <div className="bar-track">
                    <div style={{ width: `${(c.count / max) * 100}%` }} />
                  </div>
                  <strong>{c.count}</strong>
                </Link>
              ))
            ) : (
              <p>Add products to see category distribution.</p>
            )}
          </div>
          <div className="chart-foot">
            <span className="legend-dot" /> Product count{" "}
            <Link href="/admin/categories">
              Manage categories <ArrowRight size={14} />
            </Link>
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Inventory health</h2>
              <p>Keep your collection ready to shop</p>
            </div>
          </div>
          <div className="donut-wrap">
            <div
              className="donut"
              role="img"
              aria-label={`${stocked} in stock, ${low} low stock, ${out} out of stock`}
              style={{
                background: db.products.length
                  ? `conic-gradient(var(--color-primary) 0 ${(stocked / total) * 100}%, var(--color-gold) ${(stocked / total) * 100}% ${((stocked + low) / total) * 100}%, var(--color-border) ${((stocked + low) / total) * 100}% 100%)`
                  : "var(--color-border)",
              }}
            >
              <div>
                <strong>{db.products.length}</strong>
                <span>Total products</span>
              </div>
            </div>
          </div>
          <div className="inventory-legend">
            {[
              ["In stock", stocked, "primary"],
              [`Low stock (≤${threshold})`, low, "gold"],
              ["Out of stock", out, "neutral"],
            ].map(([label, count, color]) => (
              <div key={label}>
                <span>
                  <i className={`legend-dot ${color}`} />
                  {label}
                </span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="lower-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Your product collection</h2>
              <p>{active} active pieces, thoughtfully curated</p>
            </div>
            <Link className="text-link" href="/admin/products">
              View all <ArrowRight size={15} />
            </Link>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {db.products
                  .slice(-5)
                  .reverse()
                  .map((p) => (
                    <tr key={p.id}>
                      <td>
                        <Link
                          className="product-cell"
                          href={`/admin/products/view/${p.id}`}
                        >
                          <Media src={p.image} alt={p.name} />
                          <span>
                            <strong>{p.name}</strong>
                            <small>{p.sku}</small>
                          </span>
                        </Link>
                      </td>
                      <td>
                        {db.categories.find((c) => c.id === p.categoryId)?.name}
                      </td>
                      <td>{money(p.salePrice)}</td>
                      <td>
                        <StatusToggle status={p.status} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {!db.products.length && (
              <p className="empty-state">
                Your collection is waiting for its first piece.
              </p>
            )}
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Homepage curation</h2>
              <p>Products featured across your store</p>
            </div>
          </div>
          <div className="placement-chart">
            {featured.map(([key, label]) => (
              <Link href={`/admin/${key}`} key={key}>
                <div>
                  <span>{label}</span>
                  <strong>{db[key].length}</strong>
                </div>
                <div className="placement-track">
                  <span
                    style={{
                      width: `${(db[key].length / Math.max(1, ...featured.map(([id]) => db[id].length))) * 100}%`,
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>
          <div className="curation-note">
            <Sparkles size={19} />
            <p>
              One product, many stories. Updates to a product appear across all
              its admin placements.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
