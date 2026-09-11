import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Newsletter } from "@/components/home/newsletter";
const columns = [
  {
    title: "SHOP",
    links: [
      ["All Jewellery", "/collections/all"],
      ["New Arrivals", "/collections/new-in"],
      ["Best Sellers", "/collections/best-sellers"],
      ["Earrings", "/collections/earrings"],
      ["Necklaces", "/collections/necklaces"],
      ["Rings", "/collections/rings"],
      ["Silver", "/collections/silver"],
    ],
  },
  {
    title: "HERE TO HELP",
    links: [
      ["Track Order", "/account"],
      ["Shipping & Delivery", "/help/shipping"],
      ["Returns & Refunds", "/help/returns"],
      ["FAQs", "/help/faqs"],
      ["Contact Us", "/help/contact"],
    ],
  },
  {
    title: "OUR WORLD",
    links: [
      ["Our Story", "/about/story"],
      ["Craftsmanship", "/about/craftsmanship"],
      ["Jewellery Care", "/help/care"],
      ["Sustainability", "/about/sustainability"],
    ],
  },
];
export function Footer() {
  return (
    <>
      <Newsletter />
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Link href="/" className="wordmark">
              INDIAN JEWELLERY<span>JEWELLERY &amp; YOU</span>
            </Link>
            <p>
              Modern Indian jewellery.
              <br />
              Timeless stories. Beautifully yours.
            </p>
            <div className="social-links">
              <a
                href="https://www.instagram.com/"
                aria-label="Instagram"
                title="Instagram"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/"
                aria-label="Facebook"
                title="Facebook"
              >
                Facebook
              </a>
            </div>
          </div>
          {columns.map((c) => (
            <div key={c.title}>
              <h3>{c.title}</h3>
              {c.links.map(([name, href]) => (
                <Link key={name} href={href}>
                  {name}
                </Link>
              ))}
            </div>
          ))}
          <div>
            <h3>LET&apos;S TALK</h3>
            <Link href="/help/contact">
              Customer care <ArrowUpRight size={13} />
            </Link>
            <p>
              Monday - Saturday
              <br />
              10:00 AM - 6:00 PM IST
            </p>
            <Link href="/help/contact">Send us a note</Link>
            <p>Made with love in India.</p>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>
            &copy; {new Date().getFullYear()} INDIAN JEWELLERY. All rights
            reserved.
          </span>
          <div>
            <Link href="/help/privacy">Privacy</Link>
            <Link href="/help/terms">Terms</Link>
          </div>
          <div className="payments">
            <span>UPI</span>
            <span>VISA</span>
            <span>Mastercard</span>
            <span>Razorpay</span>
          </div>
        </div>
      </footer>
    </>
  );
}
