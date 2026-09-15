"use client";
import { useEffect, useId, useRef, useState } from "react";
import { SlidersHorizontal, SearchX, ChevronDown } from "lucide-react";
import { type Product, money } from "@/lib/catalog";
import { CollectionResults } from "./collection-results";
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
  const [expandedFilter, setExpandedFilter] = useState<string | null>(
    "category",
  );
  const filterId = useId();
  const [stock, setStock] = useState(false);
  const [columns, setColumns] = useState<4 | 5>(4);
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
        <fieldset key={g.key} className="filter-accordion">
          <legend>
            <button
              type="button"
              className="filter-accordion-trigger"
              aria-expanded={expandedFilter === g.key}
              aria-controls={`${filterId}-${g.key}`}
              onClick={() =>
                setExpandedFilter((current) =>
                  current === g.key ? null : g.key,
                )
              }
            >
              <span>{g.title}</span>
              <ChevronDown size={16} aria-hidden="true" />
            </button>
          </legend>
          <div id={`${filterId}-${g.key}`} hidden={expandedFilter !== g.key}>
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
          </div>
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
        <button className="mobile-filter-button" onClick={() => setOpen(true)}>
          <SlidersHorizontal size={15} />
          <span>Filter</span>
        </button>
        <div className="collection-toolbar-sort">
          <label>
            <span className="sort-label-text">Sort by</span>
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
        <span className="collection-count" aria-live="polite">
          {shown.length} pieces
        </span>
        <div
          className="collection-view"
          role="group"
          aria-label="Product grid layout"
        >
          <span>View as</span>
          {([4, 5] as const).map((count) => (
            <button
              key={count}
              type="button"
              aria-label={`${count} columns`}
              aria-pressed={columns === count}
              aria-controls="collection-products"
              title={`${count} columns`}
              onClick={() => setColumns(count)}
            >
              <span className="grid-choice-icon" aria-hidden="true">
                {Array.from({ length: count }, (_, index) => (
                  <span key={index} />
                ))}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="collection-layout">
        <aside className="desktop-filters" aria-label="Product filters">
          {!open && filters}
        </aside>
        {shown.length ? (
          <CollectionResults
            key={shown.map((product) => product.id).join("|")}
            items={shown}
            columns={columns}
            onAdded={added}
          />
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
        <Modal
          title="Filters"
          className="collection-filter-modal"
          side="left"
          onClose={() => setOpen(false)}
          footer={(close) => (
            <button className="button full" onClick={() => close()}>
              Show {shown.length} pieces
            </button>
          )}
        >
          {filters}
        </Modal>
      )}
    </>
  );
}
