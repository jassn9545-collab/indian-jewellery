"use client";
import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal, SearchX } from "lucide-react";
import { type Product, money } from "@/lib/catalog";
import { BestSellerCard } from "@/components/product/best-seller-card";
import { Modal } from "@/components/ui/modal";
export function Collection({ items }: { items: Product[] }) {
  const [notice, setNotice] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  function added() {
    clearTimeout(timer.current);
    setNotice("Added to cart");
    timer.current = setTimeout(() => setNotice(""), 2400);
  }
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [max, setMax] = useState(10000);
  const [sort, setSort] = useState("featured");
  const [open, setOpen] = useState(false);
  const [stock, setStock] = useState(false);
  const groups: {
    title: string;
    key: "category" | "material" | "gemstone" | "occasion" | "badge";
    options: string[];
  }[] = [
    {
      title: "Category",
      key: "category",
      options: [...new Set(items.map((p) => p.category))],
    },
    {
      title: "Material & purity",
      key: "material",
      options: [...new Set(items.map((p) => p.material))],
    },
    {
      title: "Gemstone",
      key: "gemstone",
      options: [...new Set(items.map((p) => p.gemstone))],
    },
    {
      title: "Occasion",
      key: "occasion",
      options: [...new Set(items.map((p) => p.occasion))],
    },
    {
      title: "Collection",
      key: "badge",
      options: [...new Set(items.map((p) => p.badge))],
    },
  ];
  const shown = items
    .filter(
      (p) =>
        p.price <= max &&
        (!stock || p.available) &&
        groups.every(
          (g) => !selected[g.key]?.length || selected[g.key].includes(p[g.key]),
        ),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : sort === "bestselling"
            ? b.reviews - a.reviews
            : sort === "newest"
              ? Number(b.badge === "New") - Number(a.badge === "New")
              : 0,
    );
  function reset() {
    setSelected({});
    setMax(10000);
    setStock(false);
  }
  const filters = (
    <div className="filters">
      {groups.map((g) => (
        <fieldset key={g.key}>
          <legend>{g.title}</legend>
          {g.options.map((value) => (
            <label key={value}>
              <input
                type="checkbox"
                checked={selected[g.key]?.includes(value) || false}
                onChange={() =>
                  setSelected((s) => ({
                    ...s,
                    [g.key]: s[g.key]?.includes(value)
                      ? s[g.key].filter((v) => v !== value)
                      : [...(s[g.key] || []), value],
                  }))
                }
              />
              {value}
            </label>
          ))}
        </fieldset>
      ))}
      <fieldset>
        <legend>Price</legend>
        <label htmlFor={open ? "price-mobile" : "price-desktop"}>
          Up to {money(max)}
        </label>
        <input
          id={open ? "price-mobile" : "price-desktop"}
          type="range"
          min="500"
          max="10000"
          step="100"
          value={max}
          onChange={(e) => setMax(Number(e.target.value))}
        />
      </fieldset>
      <fieldset>
        <legend>Availability</legend>
        <label>
          <input
            type="checkbox"
            checked={stock}
            onChange={(e) => setStock(e.target.checked)}
          />
          In stock only
        </label>
      </fieldset>
      <button onClick={reset}>Clear all filters</button>
    </div>
  );
  return (
    <>
      <div className="collection-toolbar">
        <span aria-live="polite">{shown.length} pieces</span>
        <button className="mobile-filter-button" onClick={() => setOpen(true)}>
          <SlidersHorizontal size={16} />
          Filter
        </button>
        <label>
          Sort by{" "}
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="bestselling">Bestselling</option>
          </select>
        </label>
      </div>
      <div className="collection-layout">
        <aside className="desktop-filters" aria-label="Product filters">
          {!open && filters}
        </aside>
        {shown.length ? (
          <div className="listing-grid">
            {shown.map((p) => (
              <BestSellerCard product={p} key={p.id} onAdded={added} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <SearchX size={36} />
            <h2>A little more to discover</h2>
            <p>No pieces match these filters. Try a different selection.</p>
            <button className="button secondary" onClick={reset}>
              Clear filters
            </button>
          </div>
        )}
      </div>
      <div
        role="status"
        aria-live="polite"
        className={"sf-toast " + (notice ? "is-visible" : "")}
      >
        {notice}
      </div>
      {open && (
        <Modal title="Refine your collection" onClose={() => setOpen(false)}>
          {filters}
          <button className="button full" onClick={() => setOpen(false)}>
            Show {shown.length} pieces
          </button>
        </Modal>
      )}
    </>
  );
}
