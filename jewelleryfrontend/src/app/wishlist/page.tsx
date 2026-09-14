"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useShop } from "@/store/shop";
import { products } from "@/lib/catalog";
import { BestSellerCard } from "@/components/product/best-seller-card";
export default function Page() {
  const saved = useShop((s) => s.wishlist);
  const items = products.filter((p) => saved.includes(p.id));
  return (
    <main id="main" className="listing-container page-shell">
      <div className="page-heading">
        <h1>Your little collection of loves</h1>
        <p>{items.length} saved pieces</p>
      </div>
      {items.length ? (
        <div className="listing-grid">
          {items.map((p) => (
            <BestSellerCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Heart size={40} />
          <h2>Your jewellery wishlist is waiting.</h2>
          <p>Keep the pieces that catch your eye, all in one place.</p>
          <Link className="button" href="/collections/all">
            Explore collections
          </Link>
        </div>
      )}
    </main>
  );
}
