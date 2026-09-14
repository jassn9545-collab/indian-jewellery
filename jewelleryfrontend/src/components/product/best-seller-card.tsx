"use client";
import Image from "next/image";
import Link from "next/link";
import { imagePath, money, type Product } from "@/lib/catalog";
import { useShop } from "@/store/shop";
import {
  Badge,
  Button,
  WishlistButton,
} from "@/components/storefront/primitives";
export function BestSellerCard({
  product,
  onAdded,
}: {
  product: Product;
  onAdded?: () => void;
}) {
  const add = useShop((s) => s.add);
  const quantity = useShop(
    (s) => s.bag.find((i) => i.id === product.id)?.quantity ?? 0,
  );
  return (
    <article className="sf-product sf-bestseller-card">
      <div className="sf-product-photo">
        <Link href={"/product/" + product.id} aria-label={product.name}>
          <Image
            src={imagePath(product.image)}
            alt={product.name}
            fill
            sizes="(max-width:767px) 46vw, (max-width:1023px) 44vw, 23vw"
          />
        </Link>
        <Badge>{product.badge}</Badge>
        <WishlistButton id={product.id} name={product.name} />
      </div>
      <div className="sf-product-info">
        <span className="sf-product-category">{product.category}</span>
        <Link className="sf-product-name" href={"/product/" + product.id}>
          {product.name}
        </Link>
        <div className="sf-product-price">
          <strong>{money(product.price)}</strong>
          <s>{money(product.mrp)}</s>
          <span>
            {Math.round((1 - product.price / product.mrp) * 100)}% OFF
          </span>
        </div>
        <Button
          disabled={!product.available || quantity >= 10}
          onClick={() => {
            add(product.id);
            onAdded?.();
          }}
        >
          {!product.available
            ? "Out of stock"
            : quantity >= 10
              ? "Maximum added"
              : "Add to cart"}
        </Button>
      </div>
    </article>
  );
}
