"use client";
import Link from "next/link";
import { Heart, ShoppingBag, Gem } from "lucide-react";
import type { ReactNode } from "react";
import { useShop } from "@/store/shop";
export function Logo() {
  return (
    <Link href="/" className="sf-logo" aria-label="Indian Jewellery home">
      <Gem aria-hidden="true" />
      <span>
        INDIAN<small>JEWELLERY</small>
      </span>
    </Link>
  );
}
export function Button({
  children,
  href,
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return href ? (
    <Link className="sf-button" href={href}>
      {children}
    </Link>
  ) : (
    <button
      type="button"
      className="sf-button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
export function Badge({ children }: { children: ReactNode }) {
  return <span className="sf-badge">{children}</span>;
}
export function WishlistButton({ id, name }: { id?: string; name?: string }) {
  const saved = useShop((s) => (id ? s.wishlist.includes(id) : false));
  const count = useShop((s) => s.wishlist.length);
  const toggle = useShop((s) => s.toggleWishlist);
  return id ? (
    <button
      type="button"
      className={"sf-icon sf-save " + (saved ? "is-saved" : "")}
      aria-label={
        (saved ? "Remove " : "Save ") +
        name +
        (saved ? " from wishlist" : " to wishlist")
      }
      aria-pressed={saved}
      onClick={() => toggle(id)}
    >
      <Heart fill={saved ? "currentColor" : "none"} />
    </button>
  ) : (
    <Link
      href="/wishlist"
      className="sf-icon"
      aria-label={"Wishlist, " + count + " items"}
    >
      <Heart />
      {count > 0 && <span className="sf-count">{count}</span>}
    </Link>
  );
}
export function CartButton({ onClick }: { onClick: () => void }) {
  const count = useShop((s) =>
    s.bag.reduce((total, item) => total + item.quantity, 0),
  );
  return (
    <button
      type="button"
      className="sf-icon"
      onClick={onClick}
      aria-label={"Open shopping bag, " + count + " items"}
    >
      <ShoppingBag />
      {count > 0 && <span className="sf-count">{count}</span>}
    </button>
  );
}
