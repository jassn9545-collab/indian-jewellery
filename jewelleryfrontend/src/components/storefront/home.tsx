"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Landmark, Feather, HandHeart, Gem, ArrowRight } from "lucide-react";
import {
  heroSlides,
  storefrontCategories,
  featuredProducts,
} from "@/lib/storefront";
import { imagePath, money, type Product } from "@/lib/catalog";
import { useShop } from "@/store/shop";
import { Badge, Button, WishlistButton } from "./primitives";
import { useAutoplay } from "./use-autoplay";
export function HeroSlide({
  slide,
  index,
  active,
}: {
  slide: (typeof heroSlides)[number];
  index: number;
  active: boolean;
}) {
  const Heading = index === 0 ? "h1" : "h2";
  return (
    <article
      className="sf-hero-slide"
      inert={!active}
      aria-hidden={!active}
      aria-label={index + 1 + " of 3"}
    >
      <Image
        src={imagePath(slide.image)}
        alt={slide.alt}
        fill
        sizes="100vw"
        preload={index === 0}
        loading={index === 0 ? undefined : "eager"}
      />
      <div className="sf-hero-copy">
        <span className="sf-eyebrow">{slide.eyebrow}</span>
        <Heading>
          {slide.title[0]}
          <br />
          {slide.title[1]}
        </Heading>
        <p>{slide.copy}</p>
        <Button href={slide.href}>{slide.cta}</Button>
      </div>
    </article>
  );
}
export function HeroCarousel() {
  const { root, index, setIndex } = useAutoplay(heroSlides.length);
  return (
    <section
      className="sf-hero"
      aria-label="Featured jewellery collections"
      aria-roledescription="carousel"
    >
      <div ref={root} className="sf-hero-inner">
        <div
          className="sf-hero-track"
          style={{ transform: "translateX(-" + index * 100 + "%)" }}
        >
          {heroSlides.map((slide, i) => (
            <HeroSlide
              key={slide.image}
              slide={slide}
              index={i}
              active={index === i}
            />
          ))}
        </div>
        <div className="sf-dots" role="group" aria-label="Choose hero image">
          {heroSlides.map((slide, i) => (
            <button
              key={slide.image}
              aria-label={"Show slide " + (i + 1)}
              aria-pressed={index === i}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
export function CategoryCard({
  category,
}: {
  category: (typeof storefrontCategories)[number];
}) {
  return (
    <Link href={"/category/" + category.slug} className="sf-category">
      <div className="sf-category-photo">
        {"referenceLeft" in category ? (
          <span
            role="img"
            aria-label={category.name}
            className="sf-category-reference"
            style={{
              backgroundPosition:
                ((category.referenceLeft ?? 0) / 952) * 100 +
                "% " +
                (392 / 1464) * 100 +
                "%",
            }}
          />
        ) : (
          <Image
            src={imagePath(category.image!)}
            alt={category.name}
            fill
            sizes="(max-width:767px) 80px, 96px"
          />
        )}
      </div>
      <span>{category.name}</span>
    </Link>
  );
}
export function CategorySection() {
  return (
    <section className="sf-categories" aria-label="Shop by jewellery category">
      <div
        className="sf-category-row"
        tabIndex={0}
        aria-label="Scroll jewellery categories"
      >
        {storefrontCategories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </section>
  );
}
const assurances = [
  { icon: Landmark, first: "Handcrafted", second: "in Jaipur" },
  { icon: Feather, first: "Light", second: "Weight" },
  { icon: HandHeart, first: "Skin", second: "Friendly" },
  { icon: Gem, first: "Brass", second: "Jewellery" },
];
export function LocalBrand() {
  return (
    <section
      className="sf-local-brand"
      aria-label="Our jewellery craftsmanship"
    >
      <ul>
        {assurances.map(({ icon: Icon, first, second }) => (
          <li key={first}>
            <Icon aria-hidden="true" />
            <span>
              {first}
              <br />
              {second}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
export function ProductCard({
  product,
  onAdded,
}: {
  product: Product;
  onAdded: () => void;
}) {
  const add = useShop((s) => s.add);
  const quantity = useShop(
    (s) => s.bag.find((i) => i.id === product.id)?.quantity ?? 0,
  );
  return (
    <article className="sf-product">
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
          disabled={quantity >= 10}
          onClick={() => {
            add(product.id);
            onAdded();
          }}
        >
          {quantity >= 10 ? "Maximum added" : "Add to cart"}
        </Button>
      </div>
    </article>
  );
}
export function FeaturedProducts() {
  const [toast, setToast] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const added = () => {
    clearTimeout(timer.current);
    setToast(true);
    timer.current = setTimeout(() => setToast(false), 2400);
  };
  return (
    <section className="sf-featured" aria-labelledby="sf-featured-heading">
      <div className="sf-section-heading">
        <h2 id="sf-featured-heading">Crafted Locally, Loved Everywhere</h2>
        <span className="sf-gold-rule" />
        <p>
          Discover jewellery inspired by Indian craftsmanship and designed for
          the modern you.
        </p>
      </div>
      <div className="sf-product-grid">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAdded={added} />
        ))}
      </div>
      <Link href="/collections" className="sf-view-all">
        View all products <ArrowRight size={16} />
      </Link>
      <div
        role="status"
        aria-live="polite"
        className={"sf-toast " + (toast ? "is-visible" : "")}
      >
        {toast ? "Added to cart" : ""}
      </div>
    </section>
  );
}
