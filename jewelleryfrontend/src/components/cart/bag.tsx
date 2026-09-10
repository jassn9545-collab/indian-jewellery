"use client";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Heart, Truck } from "lucide-react";
import { useState } from "react";
import { useShop } from "@/store/shop";
import { products, imagePath, money } from "@/lib/catalog";
export function Bag({ onNavigate }: { onNavigate?: () => void }) {
  const { bag, quantity, remove, toggleWishlist, wishlist } = useShop();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");
  const items = bag.flatMap((item) => {
    const product = products.find((p) => p.id === item.id);
    return product ? [{ ...item, product }] : [];
  });
  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );
  const discount = applied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal >= 799 ? 0 : 79;
  if (!items.length)
    return (
      <div className="empty-state">
        <ShoppingBag size={40} />
        <h2>Your bag is waiting</h2>
        <p>Find something you will love wearing.</p>
        <Link className="button" href="/collections/all" onClick={onNavigate}>
          Explore jewellery
        </Link>
      </div>
    );
  return (
    <div className="bag-content">
      <div className="shipping-progress">
        <Truck size={18} />
        <span>
          {subtotal >= 799
            ? "Your order qualifies for free shipping."
            : "Add " + money(799 - subtotal) + " for free shipping."}
        </span>
        <progress value={Math.min(subtotal, 799)} max={799} />
      </div>
      <div className="bag-items">
        {items.map(({ product, quantity: count, id }) => (
          <article className="bag-item" key={id}>
            <Link href={"/products/" + id} onClick={onNavigate}>
              <Image
                src={imagePath(product.image)}
                width={100}
                height={125}
                alt={product.name}
              />
            </Link>
            <div>
              <Link href={"/products/" + id} onClick={onNavigate}>
                <h3>{product.name}</h3>
              </Link>
              <p>{product.material}</p>
              <strong>{money(product.price)}</strong>
              <div className="quantity-row">
                <div className="quantity">
                  <button
                    aria-label={"Decrease " + product.name + " quantity"}
                    disabled={count <= 1}
                    onClick={() => quantity(id, count - 1)}
                  >
                    <Minus size={14} />
                  </button>
                  <span>{count}</span>
                  <button
                    aria-label={"Increase " + product.name + " quantity"}
                    disabled={count >= 10}
                    onClick={() => quantity(id, count + 1)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  className="icon-button"
                  title="Save for later"
                  aria-label={"Save " + product.name + " for later"}
                  onClick={() => {
                    if (!wishlist.includes(id)) toggleWishlist(id);
                    remove(id);
                  }}
                >
                  <Heart size={16} />
                </button>
                <button
                  className="icon-button"
                  title="Remove item"
                  aria-label={"Remove " + product.name}
                  onClick={() => remove(id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <form
        className="coupon"
        onSubmit={(e) => {
          e.preventDefault();
          if (coupon.trim().toUpperCase() === "WELCOME10") {
            setApplied(true);
            setError("");
          } else {
            setError("Enter WELCOME10 for 10% off.");
            setApplied(false);
          }
        }}
      >
        <label className="sr-only" htmlFor="coupon">
          Offer code
        </label>
        <input
          id="coupon"
          placeholder="Offer code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
        />
        <button type="submit" className="button secondary">
          Apply
        </button>
      </form>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      {applied && <p className="success">WELCOME10 applied</p>}
      <dl className="summary">
        <div>
          <dt>Subtotal</dt>
          <dd>{money(subtotal)}</dd>
        </div>
        <div>
          <dt>Discount</dt>
          <dd>-{money(discount)}</dd>
        </div>
        <div>
          <dt>Shipping</dt>
          <dd>{shipping ? money(shipping) : "Complimentary"}</dd>
        </div>
        <div>
          <dt>Taxes</dt>
          <dd>Included in MRP</dd>
        </div>
        <div className="total">
          <dt>Total</dt>
          <dd>{money(subtotal - discount + shipping)}</dd>
        </div>
      </dl>
      <Link
        href={"/checkout" + (applied ? "?offer=WELCOME10" : "")}
        className="button full"
        onClick={onNavigate}
      >
        Proceed to checkout
      </Link>
      <p className="fine-print">Secure checkout. Thoughtfully packaged.</p>
    </div>
  );
}
