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
  ChevronUp,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { type Product, imagePath } from "@/lib/catalog";
import { Price } from "./product-card";
import { useShop } from "@/store/shop";

export function ProductDetail({ product }: { product: Product }) {
  const [zoom, setZoom] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("details");
  const [pin, setPin] = useState("");
  const [delivery, setDelivery] = useState("");
  const [added, setAdded] = useState(false);
  const bagQuantity = useShop(
    (s) => s.bag.find((i) => i.id === product.id)?.quantity ?? 0,
  );
  const atLimit = bagQuantity >= 10;
  const [size, setSize] = useState(
    product.category === "Rings" ? "Adjustable" : "Standard",
  );
  const router = useRouter();
  const { add, toggleWishlist, wishlist } = useShop();
  const saved = wishlist.includes(product.id);

  const galleryViews = [
    {
      id: "view-1",
      label: "Model View",
      src: imagePath(product.image),
      className: "object-cover",
    },
    {
      id: "view-2",
      label: "Full View",
      src: imagePath(product.image),
      className: "object-contain",
    },
    {
      id: "view-3",
      label: "Close-up Detail",
      src: imagePath(product.image),
      className: "object-cover scale-125",
    },
    {
      id: "view-4",
      label: "Back & Clasp View",
      src: imagePath(product.image),
      className: "object-cover scale-110",
    },
    {
      id: "view-5",
      label: "Paired Angle",
      src: imagePath(product.image),
      className: "object-cover",
    },
  ];

  const currentView = galleryViews[activeImageIndex] || galleryViews[0];

  function prevImage() {
    setActiveImageIndex((prev) =>
      prev > 0 ? prev - 1 : galleryViews.length - 1,
    );
  }

  function nextImage() {
    setActiveImageIndex((prev) =>
      prev < galleryViews.length - 1 ? prev + 1 : 0,
    );
  }

  function addBag() {
    if (!product.available || atLimit) return;
    add(product.id, Math.min(quantity, 10 - bagQuantity));
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
      <div className="product-gallery">
        <div className="gallery-thumbs-col" aria-label="Product image gallery">
          <button
            type="button"
            className="gallery-nav-btn prev-btn"
            onClick={prevImage}
            aria-label="Previous image"
          >
            <ChevronUp size={18} />
          </button>
          <div className="gallery-thumbs-list">
            {galleryViews.map((view, idx) => (
              <button
                key={view.id}
                type="button"
                className={
                  "gallery-thumb-item" +
                  (activeImageIndex === idx ? " active" : "")
                }
                onClick={() => {
                  setActiveImageIndex(idx);
                  if (idx === 2) setZoom(true);
                  else if (idx === 1) setZoom(false);
                }}
                aria-label={view.label}
              >
                <div className="thumb-image-wrap">
                  <Image
                    src={view.src}
                    alt={view.label}
                    width={72}
                    height={72}
                    className={view.className}
                  />
                </div>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="gallery-nav-btn next-btn"
            onClick={nextImage}
            aria-label="Next image"
          >
            <ChevronDown size={18} />
          </button>
        </div>
        <div
          className="detail-photo"
          onMouseMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            const x = Math.max(
              0,
              Math.min(
                100,
                ((event.clientX - bounds.left) / bounds.width) * 100,
              ),
            );
            const y = Math.max(
              0,
              Math.min(
                100,
                ((event.clientY - bounds.top) / bounds.height) * 100,
              ),
            );
            event.currentTarget.style.setProperty("--zoom-x", `${x}%`);
            event.currentTarget.style.setProperty("--zoom-y", `${y}%`);
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.removeProperty("--zoom-x");
            event.currentTarget.style.removeProperty("--zoom-y");
          }}
        >
          <Image
            key={currentView.id}
            src={currentView.src}
            alt={product.name + " - " + currentView.label}
            fill
            preload
            sizes="(max-width:767px) 100vw, 55vw"
            className={
              (zoom || activeImageIndex === 2 ? "zoomed " : "") +
              (currentView.className || "")
            }
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
          disabled={!product.available || atLimit}
          onClick={() => {
            if (!product.available || atLimit) return;
            add(product.id, Math.min(quantity, 10 - bagQuantity));
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
          role="group"
          aria-label="Product information"
        >
          <button
            aria-pressed={tab === "details"}
            className={tab === "details" ? "active" : ""}
            onClick={() => setTab("details")}
          >
            Product details
          </button>
          <button
            aria-pressed={tab === "reviews"}
            className={tab === "reviews" ? "active" : ""}
            onClick={() => setTab("reviews")}
          >
            Reviews ({product.reviews})
          </button>
        </div>
        <div>
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
