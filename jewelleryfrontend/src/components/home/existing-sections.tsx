"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Gem,
  Star,
  Leaf,
  Sparkles,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { imagePath } from "@/lib/catalog";

export function SilverSection() {
  return (
    <section className="silver-section" aria-label="Pure Silver Collection">
      <div className="container silver-inner">
        {/* Left Column: Editorial Photo */}
        <div className="silver-photo-wrap">
          <div className="silver-photo">
            <Image
              src="/images/silver.webp"
              alt="Sculptural 925 sterling silver lotus earrings on warm stone"
              fill
              quality={95}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              className="silver-img"
            />
            <div className="silver-photo-tag">
              <span className="silver-tag-text">CRAFTED FOR TODAY</span>
              <span className="silver-tag-line" />
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Copy */}
        <div className="silver-copy">
          <div className="silver-watermark-badge">
            <span className="silver-badge-text">SILVER FOR A BRIGHTER YOU</span>
          </div>

          <div className="silver-eyebrow-wrap">
            <span className="silver-eyebrow">THE 925 EDIT</span>
            <span className="silver-gold-line" />
          </div>

          <h2 className="silver-title">
            Pure Silver.
            <br />
            <em>Simply You.</em>
          </h2>

          <p className="silver-desc">
            Timeless silver jewellery designed for everyday elegance. Light on
            you. Lasting in your collection.
          </p>

          <div className="silver-actions">
            <Link href="/collections/silver" className="silver-btn">
              <span>Shop Silver</span>
              <ArrowRight size={16} className="silver-btn-icon" />
            </Link>
          </div>

          <div className="silver-benefits">
            <div className="silver-benefit-item">
              <div className="silver-benefit-icon">
                <Gem size={20} strokeWidth={1.5} />
              </div>
              <div className="silver-benefit-text">
                <span className="silver-benefit-title">
                  925 Sterling Silver
                </span>
                <span className="silver-benefit-sub">
                  A little luxury, every day.
                </span>
              </div>
            </div>

            <div className="silver-benefit-divider" />

            <div className="silver-benefit-item">
              <div className="silver-benefit-icon">
                <Leaf size={20} strokeWidth={1.5} />
              </div>
              <div className="silver-benefit-text">
                <span className="silver-benefit-title">Skin Friendly</span>
                <span className="silver-benefit-sub">
                  Comfort for all-day wear.
                </span>
              </div>
            </div>

            <div className="silver-benefit-divider" />

            <div className="silver-benefit-item">
              <div className="silver-benefit-icon">
                <Sparkles size={20} strokeWidth={1.5} />
              </div>
              <div className="silver-benefit-text">
                <span className="silver-benefit-title">Timeless Design</span>
                <span className="silver-benefit-sub">Always in style.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrendingLooksSection() {
  return (
    <section className="sf-looks-section" aria-labelledby="sf-looks-heading">
      <div className="sf-section-heading">
        <h2 id="sf-looks-heading">Trending Looks</h2>
        <span className="sf-gold-rule" />
        <p>A little inspiration for your next beautiful moment.</p>
      </div>

      <div className="sf-looks-grid">
        {[
          {
            image: "hero",
            label: "The Modern Heirloom",
            subtitle: "Wedding Edit",
            slug: "wedding",
            tag: "Bridal",
          },
          {
            image: "earrings",
            label: "A Touch of Emerald",
            subtitle: "Festive Glamour",
            slug: "festive",
            tag: "Festive",
          },
          {
            image: "necklace",
            label: "Royal Kundan Grandeur",
            subtitle: "Heritage Chokers",
            slug: "wedding",
            tag: "Royal",
          },
          {
            image: "bracelet",
            label: "Everyday Elevated",
            subtitle: "Modern Minimal",
            slug: "office",
            tag: "Everyday",
          },
          {
            image: "jhumka",
            label: "Festive Traditions",
            subtitle: "Meenakari Magic",
            slug: "festive",
            tag: "Statement",
          },
          {
            image: "silver",
            label: "The Silver Symphony",
            subtitle: "Pure 925 Edit",
            slug: "silver",
            tag: "Silver",
          },
        ].map((look, i) => (
          <Link
            href={"/collections/" + look.slug}
            className={"sf-look sf-look-" + i}
            key={look.label}
          >
            <div className="sf-look-media">
              <Image
                src={imagePath(look.image)}
                alt={look.label}
                fill
                quality={95}
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
              />
              <span className="sf-look-tag">{look.tag}</span>
            </div>
            <div className="sf-look-content">
              <small>{look.subtitle}</small>
              <h3>{look.label}</h3>
              <span className="sf-look-cta">
                Explore look <ArrowRight size={13} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/collections"
        className="sf-view-all"
        style={{ marginTop: 28 }}
      >
        Explore all looks <ArrowRight size={16} />
      </Link>
    </section>
  );
}

export interface CustomerReview {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  review: string;
}

export const customerReviews: CustomerReview[] = [
  {
    id: 1,
    name: "Ananya S.",
    location: "Bengaluru",
    image: "/images/reviews/ananya.jpg",
    rating: 5,
    review:
      "The emerald earrings are even more beautiful in person. Wore them to a wedding and did not stop getting compliments.",
  },
  {
    id: 2,
    name: "Priya M.",
    location: "Mumbai",
    image: "/images/reviews/priya.jpg",
    rating: 5,
    review:
      "Absolutely loved the quality and design. The packaging was beautiful. It felt like opening a little gift to myself.",
  },
  {
    id: 3,
    name: "Meera R.",
    location: "New Delhi",
    image: "/images/reviews/meera.jpg",
    rating: 5,
    review:
      "Finally found silver earrings I can wear every day. So delicate, comfortable and beautifully finished.",
  },
  {
    id: 4,
    name: "Riya D.",
    location: "Jaipur",
    image: "/images/reviews/riya.jpg",
    rating: 5,
    review:
      "The craftsmanship is exquisite. Feels so lightweight on the skin yet looks truly royal and timeless.",
  },
];

export function CustomerReviewCard({ review }: { review: CustomerReview }) {
  return (
    <article className="sf-review-card">
      <div className="sf-review-avatar-col">
        <div className="sf-review-avatar-frame">
          <Image
            src={review.image}
            alt={review.name}
            width={64}
            height={64}
            quality={95}
            className="sf-review-avatar-img"
          />
        </div>
      </div>

      <div className="sf-review-body">
        <div className="sf-review-top-row">
          <div
            className="sf-review-stars"
            aria-label={`${review.rating} out of 5 stars`}
          >
            {Array.from({ length: review.rating }, (_, i) => (
              <Star key={i} size={12} fill="#C69C45" stroke="#C69C45" />
            ))}
          </div>
          <Quote size={16} className="sf-review-quote-icon" />
        </div>

        <blockquote className="sf-review-quote">
          &ldquo;{review.review}&rdquo;
        </blockquote>

        <div className="sf-review-footer">
          <div className="sf-review-author">
            <strong className="sf-review-name">{review.name}</strong>
            <span className="sf-review-location">{review.location}</span>
          </div>

          <span className="sf-review-verified">Sample review</span>
        </div>
      </div>
    </article>
  );
}

export function CustomerReviewsSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTo = (index: number) => {
    if (!carouselRef.current) return;
    const cards = carouselRef.current.querySelectorAll<HTMLElement>(
      ".sf-review-card-wrapper",
    );
    if (cards[index]) {
      cards[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
      setActiveIndex(index);
    }
  };

  const handlePrev = () => {
    const nextIdx = Math.max(0, activeIndex - 1);
    scrollTo(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(customerReviews.length - 1, activeIndex + 1);
    scrollTo(nextIdx);
  };

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const width = carouselRef.current.offsetWidth;
    const newIdx = Math.round(scrollLeft / (width * 0.85 || 1));
    setActiveIndex(Math.min(customerReviews.length - 1, Math.max(0, newIdx)));
  };

  return (
    <section className="sf-reviews-section" aria-labelledby="sf-reviews-title">
      <div className="sf-reviews-container">
        {/* Editorial Centered Header */}
        <div className="sf-reviews-header">
          <div className="sf-reviews-eyebrow-wrap">
            <span className="sf-reviews-line" />
            <span className="sf-reviews-eyebrow">LITTLE NOTES OF LOVE</span>
            <span className="sf-reviews-line" />
          </div>

          <h2 id="sf-reviews-title" className="sf-reviews-title">
            What Our Customers Say
          </h2>

          <div className="sf-reviews-divider">
            <span className="sf-reviews-divider-line" />
            <span className="sf-reviews-divider-icon">✦</span>
            <span className="sf-reviews-divider-line" />
          </div>
        </div>

        {/* Reviews Grid / Carousel Track */}
        <div className="sf-reviews-carousel-wrap">
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="sf-reviews-track"
          >
            {customerReviews.map((r, index) => (
              <div
                className={`sf-review-card-wrapper ${
                  index === activeIndex ? "is-active" : ""
                }`}
                key={r.id}
              >
                <CustomerReviewCard review={r} />
              </div>
            ))}
          </div>

          {/* Navigation Controls (Mobile / Swipe) */}
          <div className="sf-reviews-controls">
            <button
              type="button"
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className="sf-reviews-nav-btn sf-reviews-prev"
              aria-label="Previous review"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="sf-reviews-dots">
              {customerReviews.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollTo(i)}
                  className={`sf-reviews-dot ${
                    i === activeIndex ? "is-active" : ""
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={activeIndex === customerReviews.length - 1}
              className="sf-reviews-nav-btn sf-reviews-next"
              aria-label="Next review"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
