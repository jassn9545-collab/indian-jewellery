import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Gem,
  RotateCcw,
  LockKeyhole,
  Star,
  Check,
} from "lucide-react";
import { products, styles, imagePath } from "@/lib/catalog";
import { ProductCard } from "@/components/product/product-card";
import { Carousel } from "@/components/home/carousel";
function SectionHeading({
  eyebrow,
  title,
  copy,
  href,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  href?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
      {href && (
        <Link href={href} className="text-link">
          View all <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
export function ExistingSections() {
  return (
    <>
      <section className="trust-bar" aria-label="Our assurances">
        {[
          [ShieldCheck, "Authentic quality"],
          [Gem, "Premium craftsmanship"],
          [RotateCcw, "Easy returns"],
          [LockKeyhole, "Secure payments"],
        ].map(([Icon, label]) => {
          const I = Icon as typeof Gem;
          return (
            <div key={String(label)}>
              <I size={21} />
              <span>{String(label)}</span>
            </div>
          );
        })}
      </section>
      <section className="section container arrivals">
        <div className="arrival-intro">
          <span className="eyebrow">JUST ARRIVED</span>
          <h2>
            New pieces.
            <br />
            <em>New possibilities.</em>
          </h2>
          <p>
            Fresh designs crafted for
            <br />
            your newest moments.
          </p>
          <Link href="/collections/new-in" className="text-link">
            Explore new arrivals <ArrowRight size={16} />
          </Link>
          <span className="editorial-number">01 / THE NEW EDIT</span>
        </div>
        <Carousel label="New arrivals">
          <div className="arrival-products">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Carousel>
      </section>
      <section className="craft-section" id="craft">
        <div className="craft-photo">
          <Image
            src="/images/hero.webp"
            alt="Detailed emerald and gold kundan necklace styled with ivory silk"
            fill
            sizes="(max-width:767px) 100vw, 50vw"
          />
        </div>
        <div className="craft-copy">
          <span className="eyebrow">A LOVE LETTER TO INDIAN ARTISTRY</span>
          <h2>
            Royally Crafted
            <br />
            for <em>You.</em>
          </h2>
          <p>
            A beautiful blend of heritage craftsmanship and contemporary design.
            Pieces that carry a little of our past into your every tomorrow.
          </p>
          <Link href="/about/craftsmanship" className="button light">
            Discover our craft <ArrowRight size={17} />
          </Link>
          <div className="craft-values">
            <span>
              Authentic
              <br />
              designs
            </span>
            <span>
              Premium
              <br />
              quality
            </span>
            <span>
              Made for
              <br />
              modern India
            </span>
          </div>
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          eyebrow="DRESS FOR YOUR MOMENT"
          title="Shop by Style"
          copy="Different moods. Beautifully you."
          href="/collections/all"
        />
        <div className="style-grid">
          {styles.map((s) => (
            <Link
              className="style-card"
              href={"/collections/" + s.slug}
              key={s.slug}
            >
              <div className="style-image">
                <Image
                  src={imagePath(s.image)}
                  alt={s.name + " jewellery"}
                  fill
                  sizes="(max-width:767px) 45vw, 30vw"
                />
              </div>
              <div>
                <h3>{s.name}</h3>
                <p>{s.copy}</p>
                <ArrowRight size={19} />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="silver-section">
        <div className="container silver-inner">
          <div className="silver-photo">
            <Image
              src="/images/silver.webp"
              alt="Sculptural sterling silver lotus earrings"
              fill
              sizes="(max-width:767px) 100vw, 50vw"
            />
          </div>
          <div className="silver-copy">
            <span className="eyebrow">THE 925 EDIT</span>
            <h2>
              Pure Silver.
              <br />
              <em>Simply you.</em>
            </h2>
            <p>
              Timeless silver jewellery designed for everyday elegance. Light on
              you. Lasting in your collection.
            </p>
            <Link href="/collections/silver" className="button">
              Shop silver <ArrowRight size={17} />
            </Link>
            <div className="silver-note">
              <Gem size={24} />
              <span>
                925 Sterling Silver
                <br />
                <small>A little luxury, every day.</small>
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          eyebrow="LOVED, WORN, REPEATED"
          title="Best Sellers"
          copy="Pieces our customers keep coming back for."
          href="/collections/best-sellers"
        />
        <div className="product-grid">
          {[products[1], products[5], products[3], products[4]].map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <section className="section looks-section">
        <div className="container">
          <SectionHeading
            eyebrow="THE INDIAN JEWELLERY MUSE"
            title="Trending Looks"
            copy="A little inspiration for your next beautiful moment."
            href="/collections/all"
          />
          <div className="looks-grid">
            {[
              { image: "hero", label: "The modern heirloom", slug: "wedding" },
              {
                image: "earrings",
                label: "A touch of emerald",
                slug: "festive",
              },
              {
                image: "bracelet",
                label: "Everyday, elevated",
                slug: "office",
              },
              { image: "jhumka", label: "In a festive mood", slug: "festive" },
            ].map((look, i) => (
              <Link
                href={"/collections/" + look.slug}
                className={"look look-" + i}
                key={look.label}
              >
                <Image
                  src={imagePath(look.image)}
                  alt={look.label}
                  fill
                  sizes="(max-width:767px) 45vw, 25vw"
                />
                <span>
                  {look.label}
                  <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section container reviews-section">
        <SectionHeading
          eyebrow="LITTLE NOTES OF LOVE"
          title="What Our Customers Say"
        />
        <div className="review-grid">
          {[
            {
              name: "Ananya S.",
              city: "Bengaluru",
              text: "The emerald earrings are even more beautiful in person. Wore them to a wedding and did not stop getting compliments.",
              initial: "A",
            },
            {
              name: "Priya M.",
              city: "Mumbai",
              text: "Absolutely loved the quality and design. The packaging was beautiful. It felt like opening a little gift to myself.",
              initial: "P",
            },
            {
              name: "Meera R.",
              city: "New Delhi",
              text: "Finally found silver earrings I can wear every day. So delicate, comfortable and beautifully finished.",
              initial: "M",
            },
          ].map((r) => (
            <article className="review-card" key={r.name}>
              <div className="review-stars" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star size={13} fill="currentColor" key={i} />
                ))}
              </div>
              <blockquote>&ldquo;{r.text}&rdquo;</blockquote>
              <div className="review-person">
                <span className="avatar">{r.initial}</span>
                <div>
                  <strong>{r.name}</strong>
                  <small>{r.city}</small>
                </div>
                <span className="verified">
                  <Check size={12} /> Verified buyer
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
