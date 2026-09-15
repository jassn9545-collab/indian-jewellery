"use client";
import { useEffect, useRef, useState } from "react";
import { BestSellerCard } from "@/components/product/best-seller-card";
import type { Product } from "@/lib/catalog";

const BATCH_SIZE = 4;

export function CollectionResults({
  items,
  columns,
  onAdded,
}: {
  items: Product[];
  columns: 4 | 5;
  onAdded: () => void;
}) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinel = useRef<HTMLDivElement>(null);
  const more = visibleCount < items.length;
  useEffect(() => {
    if (!more || !sentinel.current || !("IntersectionObserver" in window))
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          setVisibleCount((count) =>
            Math.min(count + BATCH_SIZE, items.length),
          );
        }
      },
      { rootMargin: "0px 0px 160px 0px" },
    );
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [more, visibleCount, items.length]);

  return (
    <div className="collection-results" data-columns={columns}>
      <div className="listing-grid" id="collection-products">
        {items.slice(0, visibleCount).map((product) => (
          <BestSellerCard
            key={product.id}
            product={product}
            onAdded={onAdded}
          />
        ))}
      </div>
      <div className="collection-load-more" ref={sentinel}>
        <p role="status">
          Showing {Math.min(visibleCount, items.length)} of {items.length}{" "}
          pieces
        </p>
        {more ? (
          <button
            type="button"
            className="button secondary"
            aria-controls="collection-products"
            onClick={() =>
              setVisibleCount((count) =>
                Math.min(count + BATCH_SIZE, items.length),
              )
            }
          >
            Load more pieces
          </button>
        ) : (
          <span>You&apos;ve seen all the pieces in this selection.</span>
        )}
      </div>
    </div>
  );
}
