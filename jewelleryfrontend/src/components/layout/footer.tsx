"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Newsletter } from "@/components/home/newsletter";
import { Logo } from "@/components/storefront/primitives";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

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

function UpiIcon({ height = 14 }: { height?: number }) {
  return (
    <svg
      height={height}
      viewBox="0 0 52 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="UPI"
      role="img"
    >
      <path d="M10.5 1.5L5.5 16.5H1L6 1.5H10.5Z" fill="#0B9F43" />
      <path d="M15.5 1.5L10.5 16.5H6L11 1.5H15.5Z" fill="#F47920" />
      <text
        x="18"
        y="14"
        fill="currentColor"
        fontFamily="sans-serif"
        fontWeight="800"
        fontSize="13"
        letterSpacing="0.04em"
      >
        UPI
      </text>
    </svg>
  );
}

function VisaIcon({ height = 13 }: { height?: number }) {
  return (
    <svg
      height={height}
      viewBox="0 0 48 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Visa"
      role="img"
    >
      <path
        d="M18.8 1.4L12.3 15.4H8.1L4.9 4.5C4.7 3.7 4.5 3.3 3.8 2.9C2.9 2.3 1.4 1.9 0 1.5L0.1 1.1H6.9C7.8 1.1 8.6 1.7 8.8 2.7L10.5 11.3L14.6 1.4H18.8ZM35.3 10.5C35.4 6.4 29.7 6.3 29.8 4.5C29.8 3.9 30.4 3.4 31.5 3.2C32.1 3.1 33.6 3.1 35.3 3.8L36 0.8C35 0.5 33.7 0.2 32 0.2C28.1 0.2 25.3 2.2 25.3 5.2C25.2 7.5 27.2 8.7 28.7 9.4C30.3 10.2 30.7 10.6 30.7 11.4C30.7 12.4 29.4 12.9 28.2 12.9C26.3 12.9 25.1 12.6 23.6 12L22.9 15.1C24.5 15.8 26.3 16.1 28.1 16.1C32.3 16.1 35.2 14 35.3 10.5ZM45.7 15.4H49.3L46.2 1.4H42.8C41.9 1.4 41.1 2 40.8 2.8L34.8 15.4H39.2L40.1 13H44.5L45 15.4H45.7ZM41.3 9.7L43.2 4.5L44.2 9.7H41.3ZM24.4 1.4L21.1 15.4H17L20.3 1.4H24.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MastercardIcon({ height = 18 }: { height?: number }) {
  return (
    <svg
      height={height}
      viewBox="0 0 32 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Mastercard"
      role="img"
    >
      <circle cx="10" cy="10" r="9" fill="#EB001B" />
      <circle cx="22" cy="10" r="9" fill="#F79E1B" fillOpacity="0.95" />
      <path
        d="M16 3.8C17.6 5.5 18.5 7.7 18.5 10C18.5 12.3 17.6 14.5 16 16.2C14.4 14.5 13.5 12.3 13.5 10C13.5 7.7 14.4 5.5 16 3.8Z"
        fill="#FF5F00"
      />
    </svg>
  );
}

function RazorpayIcon({ height = 15 }: { height?: number }) {
  return (
    <svg
      height={height}
      viewBox="0 0 74 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Razorpay"
      role="img"
    >
      <path
        d="M11.5 1.5L4.5 9.8L7.6 10.2L2.5 16.8L12.8 6.2L9.4 5.8L11.5 1.5Z"
        fill="#3395FF"
      />
      <text
        x="16"
        y="13.5"
        fill="currentColor"
        fontFamily="sans-serif"
        fontWeight="700"
        fontSize="11.5"
        letterSpacing="-0.01em"
      >
        Razorpay
      </text>
    </svg>
  );
}

export function Footer() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <>
      <Newsletter />
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>
              Modern Indian jewellery.
              <br />
              Timeless stories. Beautifully yours.
            </p>
            <div className="social-links">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
              >
                <InstagramIcon size={20} />
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook"
              >
                <FacebookIcon size={20} />
              </a>
            </div>
          </div>
          {columns.map((c) => {
            const isOpen = !!openSections[c.title];
            return (
              <div key={c.title} className="footer-column">
                <button
                  type="button"
                  className="footer-heading-btn"
                  onClick={() => toggleSection(c.title)}
                  aria-expanded={isOpen}
                  aria-controls={`footer-col-${c.title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <h3>{c.title}</h3>
                  <ChevronDown
                    size={16}
                    className={`footer-chevron ${isOpen ? "open" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={`footer-col-${c.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`footer-column-content ${isOpen ? "is-open" : ""}`}
                >
                  {c.links.map(([name, href]) => (
                    <Link key={name} href={href}>
                      {name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          <div className="footer-column">
            <button
              type="button"
              className="footer-heading-btn"
              onClick={() => toggleSection("LET'S TALK")}
              aria-expanded={!!openSections["LET'S TALK"]}
              aria-controls="footer-col-lets-talk"
            >
              <h3>LET&apos;S TALK</h3>
              <ChevronDown
                size={16}
                className={`footer-chevron ${openSections["LET'S TALK"] ? "open" : ""}`}
                aria-hidden="true"
              />
            </button>
            <div
              id="footer-col-lets-talk"
              className={`footer-column-content ${openSections["LET'S TALK"] ? "is-open" : ""}`}
            >
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
          <div className="payments" aria-label="Accepted payment methods">
            <span className="payment-badge" title="UPI">
              <UpiIcon />
            </span>
            <span className="payment-badge" title="Visa">
              <VisaIcon />
            </span>
            <span className="payment-badge" title="Mastercard">
              <MastercardIcon />
            </span>
            <span className="payment-badge" title="Razorpay">
              <RazorpayIcon />
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
