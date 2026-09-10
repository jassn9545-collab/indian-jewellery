"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Minus,
  Plus,
  Star,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { type Product, imagePath } from "@/lib/catalog";
import { Price } from "./product-card";
import { useShop } from "@/store/shop";
export function ProductDetail({ product }: { product: Product }) {
  const [zoom, setZoom] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("details");
  const [pin, setPin] = useState("");
  const [delivery, setDelivery] = useState("");
  const [added, setAdded] = useState(false);
  const [size, setSize] = useState(
    product.category === "Rings" ? "Adjustable" : "Standard",
  );
  const router = useRouter();
  const { add, toggleWishlist, wishlist } = useShop();
  const saved = wishlist.includes(product.id);
  function addBag() {
    add(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  }
  const details = [
    ["Description", product.description],
    [
      "Material & purity",
      product.material +
        ". " +
        (product.material.includes("925")
          ? "925 sterling silver."
          : "Fashion jewellery with a gold-plated finish; not solid gold."),
    ],
    ["Gemstone", product.gemstone],
    [
      "Size & weight",
      "Standard sizing. Exact dimensions, product weight and certification details will be confirmed before launch.",
    ],
    [
      "Care instructions",
      "Store in a dry, separate pouch. Avoid perfume, water and harsh chemicals. Gently wipe with a soft cloth after wearing.",
    ],
    [
      "Shipping & returns",
      "Complimentary shipping on orders above INR 799. Final delivery dates and return eligibility will be confirmed at launch.",
    ],
  ];
  return (
    <div className="product-detail">
      <div>
        <div className="detail-photo">
          <Image
            src={imagePath(product.image)}
            alt={product.name}
            fill
            preload
            sizes="(max-width:767px) 100vw, 50vw"
            className={zoom ? "zoomed" : ""}
          />
          <button
            className="icon-button"
            title={zoom ? "Zoom out" : "Zoom in"}
            aria-label={zoom ? "Zoom out" : "Zoom in"}
            onClick={() => setZoom(!zoom)}
          >
            {zoom ? <ZoomOut /> : <ZoomIn />}
          </button>
        </div>
        <div className="gallery-thumbs">
          <button
            className={!zoom ? "active" : ""}
            onClick={() => setZoom(false)}
            aria-label="View full product"
          >
            <Image
              src={imagePath(product.image)}
              alt="Full product"
              width={72}
              height={72}
            />
            Full view
          </button>
          <button
            className={zoom ? "active" : ""}
            onClick={() => setZoom(true)}
            aria-label="View product detail"
          >
            <Image
              src={imagePath(product.image)}
              alt="Product detail"
              width={72}
              height={72}
            />
            Detail
          </button>
        </div>
      </div>
      <div className="detail-copy">
        <span className="eyebrow">
          {product.badge} / {product.category}
        </span>
        <h1>{product.name}</h1>
        <div className="rating">
          <Star size={14} fill="currentColor" />
          {product.rating} <span>({product.reviews} reviews)</span>
        </div>
        <Price product={product} />
        <p className="tax-note">MRP inclusive of all taxes</p>
        <p>{product.description}</p>
        <label>
          Size{" "}
          <select
            aria-label="Product size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option>
              {product.category === "Rings" ? "Adjustable" : "Standard"}
            </option>
          </select>
        </label>
        <div className="detail-actions">
          <div className="quantity">
            <button
              aria-label="Decrease quantity"
              disabled={quantity === 1}
              onClick={() => setQuantity(quantity - 1)}
            >
              <Minus size={16} />
            </button>
            <span>{quantity}</span>
            <button
              aria-label="Increase quantity"
              disabled={quantity === 10}
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            className="button"
            onClick={addBag}
            disabled={!product.available}
          >
            {added
              ? "Added to bag"
              : product.available
                ? "Add to bag"
                : "Out of stock"}
          </button>
          <button
            className="icon-button"
            title="Wishlist"
            aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={saved}
            onClick={() => toggleWishlist(product.id)}
          >
            <Heart fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        {added && (
          <p className="success" role="status">
            {product.name} added to your bag.
          </p>
        )}
        <button
          className="button secondary full"
          disabled={!product.available}
          onClick={() => {
            add(product.id, quantity);
            router.push("/checkout");
          }}
        >
          Buy now
        </button>
        <div className="delivery-check">
          <label htmlFor="pincode">Delivery to your door</label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDelivery(
                /^[1-9][0-9]{5}$/.test(pin)
                  ? "Pincode format accepted. Delivery availability and dates will be confirmed when the store opens."
                  : "Please enter a valid 6-digit Indian pincode.",
              );
            }}
          >
            <input
              id="pincode"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter pincode"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <button className="button secondary" type="submit">
              Check
            </button>
          </form>
          {delivery && (
            <p role="status" className="fine-print">
              {delivery}
            </p>
          )}
        </div>
        <div className="shipping-progress">
          <ShieldCheck size={17} />
          Quality assured <RotateCcw size={17} />
          Easy returns
        </div>
        <div
          className="detail-tabs"
          role="tablist"
          aria-label="Product information"
        >
          <button
            role="tab"
            aria-selected={tab === "details"}
            className={tab === "details" ? "active" : ""}
            onClick={() => setTab("details")}
          >
            Product details
          </button>
          <button
            role="tab"
            aria-selected={tab === "reviews"}
            className={tab === "reviews" ? "active" : ""}
            onClick={() => setTab("reviews")}
          >
            Reviews ({product.reviews})
          </button>
        </div>
        <div role="tabpanel">
          {tab === "details" ? (
            <div className="details-list">
              {details.map(([title, copy]) => (
                <details key={title}>
                  <summary>
                    {title}
                    <ChevronDown size={16} />
                  </summary>
                  <p>{copy}</p>
                </details>
              ))}
            </div>
          ) : (
            <div className="notice" style={{ marginTop: 20 }}>
              The ratings shown are sample catalogue content. Customer reviews
              will be available after launch.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
