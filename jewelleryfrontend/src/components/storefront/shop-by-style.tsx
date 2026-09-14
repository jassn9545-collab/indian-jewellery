"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Flower2 } from "lucide-react";
import { useId, useRef, type KeyboardEvent } from "react";
import { shopByStyle, type ShopByStyleItem } from "@/lib/shop-by-style";
import styles from "./shop-by-style.module.css";

export function ShopByStyleCard({ item }: { item: ShopByStyleItem }) {
  return (
    <article className={styles.card}>
      <div className={styles.image}>
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="(max-width: 767px) 85vw, (max-width: 1023px) 46vw, 24vw"
        />
      </div>
      <div className={styles.content}>
        <Flower2 className={styles.ornament} size={24} strokeWidth={1} aria-hidden="true" />
        <h3>{item.title}</h3>
        <span className={styles.divider} aria-hidden="true" />
        <Link className={styles.explore} href={item.link} aria-label={`Explore ${item.title}`}>
          {item.buttonText} <ArrowRight size={19} strokeWidth={1.4} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export function ShopByStyleSection({ items = shopByStyle }: { items?: ShopByStyleItem[] }) {
  const id = useId();
  const viewport = useRef<HTMLDivElement>(null);

  function scroll(direction: number) {
    const element = viewport.current;
    if (!element) return;
    const card = element.querySelector("article");
    if (!card) return;
    const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(element).columnGap);
    element.scrollBy({
      left: direction * step,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const element = viewport.current;
    if (!element || element.scrollWidth <= element.clientWidth) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      scroll(event.key === "ArrowRight" ? 1 : -1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      element.scrollTo({ left: event.key === "Home" ? 0 : element.scrollWidth });
    }
  }

  if (!items.length) return null;

  return (
    <section className={styles.section} aria-labelledby={id}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <span aria-hidden="true" />
          <h2 id={id}>SHOP BY STYLE</h2>
          <span aria-hidden="true" />
        </div>
        <p>Different Styles. Same Timeless Beauty.</p>
      </header>
      <div ref={viewport} className={styles.grid} role="group" aria-label="Jewellery styles" tabIndex={0} onKeyDown={onKeyDown}>
        {items.map((item) => <ShopByStyleCard key={item.id} item={item} />)}
      </div>
      {items.length > 1 && (
        <div className={styles.controls}>
          <button type="button" onClick={() => scroll(-1)} aria-label="Previous jewellery style"><ArrowLeft size={18} /></button>
          <button type="button" onClick={() => scroll(1)} aria-label="Next jewellery style"><ArrowRight size={18} /></button>
        </div>
      )}
    </section>
  );
}
