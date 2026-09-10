"use client";
import { useRef, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
export function Carousel({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="carousel">
      <div
        ref={ref}
        className="carousel-scroll"
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </div>
      <div className="carousel-controls">
        <button
          className="icon-button"
          aria-label={"Previous " + label}
          title="Previous"
          onClick={() =>
            ref.current?.scrollBy({ left: -350, behavior: "smooth" })
          }
        >
          <ArrowLeft size={16} />
        </button>
        <button
          className="icon-button"
          aria-label={"Next " + label}
          title="Next"
          onClick={() =>
            ref.current?.scrollBy({ left: 350, behavior: "smooth" })
          }
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
