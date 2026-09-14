"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Star, Eye } from "lucide-react";
import { useState } from "react";
import { type Product, money, imagePath } from "@/lib/catalog";
import { useShop } from "@/store/shop";
import { Modal } from "@/components/ui/modal";
export function Price({ product }: { product: Product }) {
  return (
    <div className="price">
      <strong>{money(product.price)}</strong>
      <s>{money(product.mrp)}</s>
      <span>{Math.round((1 - product.price / product.mrp) * 100)}% off</span>
    </div>
  );
}
export function ProductCard({ product }: { product: Product }) {
  const saved = useShop((s) => s.wishlist.includes(product.id));
  const toggle = useShop((s) => s.toggleWishlist);
  const add = useShop((s) => s.add);
  const [quick, setQuick] = useState(false);
  const [added, setAdded] = useState(false);
  const bagQuantity = useShop(
    (s) => s.bag.find((i) => i.id === product.id)?.quantity ?? 0,
  );
  const atLimit = bagQuantity >= 10;
  function addToBag() {
    if (!product.available || atLimit) return;
    add(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }
  return (
    <article className="product-card">
      <div className="product-image">
        <Link href={"/products/" + product.id} aria-label={product.name}>
          <Image
            src={imagePath(product.image)}
            alt={product.name}
            fill
            sizes="(max-width: 767px) 45vw, (max-width: 1023px) 30vw, 24vw"
          />
        </Link>
        <span className={"badge " + product.badge.toLowerCase()}>
          {product.available ? product.badge : "Out of stock"}
        </span>
        <button
          className={"icon-button heart " + (saved ? "selected" : "")}
          title={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-label={
            (saved ? "Remove " : "Save ") +
            product.name +
            (saved ? " from wishlist" : " to wishlist")
          }
          aria-pressed={saved}
          onClick={() => toggle(product.id)}
        >
          <Heart fill={saved ? "currentColor" : "none"} />
        </button>
        <button className="quick-view" onClick={() => setQuick(true)}>
          <Eye size={16} /> Quick view
        </button>
      </div>
      <div className="product-info">
        <p className="product-category">{product.material}</p>
        <Link href={"/products/" + product.id}>
          <h3>{product.name}</h3>
        </Link>
        <div className="rating">
          <Star size={12} fill="currentColor" />
          {product.rating}
          <span>({product.reviews})</span>
        </div>
        <Price product={product} />
        <button
          className="quick-add"
          onClick={addToBag}
          disabled={!product.available || atLimit}
        >
          <Plus size={15} />
          {added
            ? "Added to bag"
            : atLimit
              ? "Maximum added"
              : product.available
                ? "Add to bag"
                : "Out of stock"}
        </button>
      </div>
      {quick && (
        <Modal title="A closer look" onClose={() => setQuick(false)} wide>
          <div className="quick-product">
            <div className="quick-image">
              <Image
                src={imagePath(product.image)}
                alt={product.name}
                fill
                sizes="(max-width:767px) 80vw, 400px"
              />
            </div>
            <div>
              <span className="eyebrow">{product.category}</span>
              <h2>{product.name}</h2>
              <Price product={product} />
              <p>{product.description}</p>
              <button
                className="button"
                onClick={addToBag}
                disabled={!product.available || atLimit}
              >
                {added
                  ? "Added to bag"
                  : atLimit
                    ? "Maximum added"
                    : product.available
                      ? "Add to bag"
                      : "Out of stock"}
              </button>
              <Link
                className="text-link"
                href={"/products/" + product.id}
                onClick={() => setQuick(false)}
              >
                View full details
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </article>
  );
}
