"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { newLaunchItems, type NewLaunchItem } from "@/lib/new-launch";
import styles from "./new-launch.module.css";

export function NewLaunchCard({ item }: { item: NewLaunchItem }) {
  return (
    <article className={styles.card}>
      <Image
        src={item.image}
        alt={item.alt}
        fill
        sizes="(max-width: 767px) 85vw, (max-width: 1023px) 44vw, 30vw"
        draggable={false}
      />
      <div className={styles.copy}>
        <h3>{item.title}</h3>
        <Link
          className={`button ${styles.cta}`}
          href={item.link}
          aria-label={`${item.buttonText}: ${item.title}`}
        >
          {item.buttonText}
        </Link>
      </div>
    </article>
  );
}

export function NewLaunchCarousel({
  items,
}: {
  items: readonly NewLaunchItem[];
}) {
  const id = useId();
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; scroll: number; moved: boolean } | null>(
    null,
  );
  const suppressClick = useRef(false);
  const scrollTo = (left: number) => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    viewport.current?.scrollTo({
      left,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  };
  const move = (direction: number) => {
    const element = viewport.current;
    if (!element) return;
    const first = element.firstElementChild as HTMLElement | null;
    if (!first) return;
    const step =
      first.getBoundingClientRect().width +
      parseFloat(getComputedStyle(element).columnGap);
    const max = element.scrollWidth - element.clientWidth;
    if (max <= 1) return;
    // Rewind at either end; native scrolling keeps touch and focus behavior intact.
    const target =
      direction > 0 && element.scrollLeft >= max - 2
        ? 0
        : direction < 0 && element.scrollLeft <= 2
          ? max
          : element.scrollLeft + direction * step;
    scrollTo(target);
  };
  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const moved = drag.current?.moved;
    drag.current = null;
    delete element.dataset.dragging;
    if (element.hasPointerCapture(event.pointerId))
      element.releasePointerCapture(event.pointerId);
    if (moved) {
      const first = element.firstElementChild as HTMLElement;
      const step =
        first.getBoundingClientRect().width +
        parseFloat(getComputedStyle(element).columnGap);
      scrollTo(Math.round(element.scrollLeft / step) * step);
    }
  };

  return (
    <div className={styles.carousel}>
      <div
        id={id}
        ref={viewport}
        className={styles.viewport}
        role="group"
        aria-label="New launch collections. Swipe or use arrow keys to browse."
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowRight" ? 1 : -1);
          } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            scrollTo(
              event.key === "Home" ? 0 : event.currentTarget.scrollWidth,
            );
          }
        }}
        onPointerDown={(event) => {
          suppressClick.current = false;
          if (event.pointerType !== "mouse" || event.button !== 0) return;
          drag.current = {
            x: event.clientX,
            scroll: event.currentTarget.scrollLeft,
            moved: false,
          };
        }}
        onPointerMove={(event) => {
          const start = drag.current;
          if (!start) return;
          const distance = event.clientX - start.x;
          if (!start.moved && Math.abs(distance) < 6) return;
          start.moved = true;
          suppressClick.current = true;
          event.currentTarget.dataset.dragging = "true";
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.scrollLeft = start.scroll - distance;
          event.preventDefault();
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId))
            drag.current = null;
        }}
        onDragStart={(event) => event.preventDefault()}
        onClickCapture={(event) => {
          if (suppressClick.current && event.detail > 0) {
            event.preventDefault();
            event.stopPropagation();
          }
          suppressClick.current = false;
        }}
      >
        {items.map((item) => (
          <NewLaunchCard key={item.id} item={item} />
        ))}
      </div>
      {items.length > 1 && (
        <>
          <button
            type="button"
            className={`icon-button ${styles.arrow} ${styles.previous}`}
            aria-label="Previous new launch collection"
            aria-controls={id}
            onClick={() => move(-1)}
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`icon-button ${styles.arrow} ${styles.next}`}
            aria-label="Next new launch collection"
            aria-controls={id}
            onClick={() => move(1)}
          >
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}

export function NewLaunchSection({
  items = newLaunchItems,
}: {
  items?: readonly NewLaunchItem[];
}) {
  const headingId = useId();
  if (!items.length) return null;
  return (
    <section
      className={styles.section}
      aria-labelledby={headingId}
      aria-roledescription="carousel"
    >
      <div className={styles.heading}>
        <span aria-hidden="true" />
        <h2 id={headingId}>NEW LAUNCH</h2>
        <span aria-hidden="true" />
      </div>
      <NewLaunchCarousel items={items} />
    </section>
  );
}
