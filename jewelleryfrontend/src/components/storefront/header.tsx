"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search as SearchIcon,
  Menu,
  UserRound,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { navigation, type NavItem } from "@/lib/storefront";
import { products, money, imagePath } from "@/lib/catalog";
import { useShop } from "@/store/shop";
import { Modal } from "@/components/ui/modal";
import { Bag } from "@/components/cart/bag";
import { Logo, WishlistButton, CartButton } from "./primitives";
import { useAutoplay } from "./use-autoplay";
const announcements = [
  { text: "SUMMER SALE ? UP TO 20% OFF", href: "/collections/offers" },
  {
    text: "INTRODUCING LAB GROWN DIAMONDS",
    href: "/precious/lab-grown-diamonds",
  },
];
export function AnnouncementBar() {
  const { root, index } = useAutoplay(announcements.length);
  return (
    <div ref={root} className="sf-ribbon" aria-label="Store announcements">
      <div
        className="sf-ribbon-track"
        style={{ transform: "translateX(-" + index * 100 + "%)" }}
      >
        {announcements.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            inert={i !== index}
            aria-hidden={i !== index}
            className="sf-ribbon-message"
          >
            {item.text}
            <span>Shop now</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
export function MegaMenu({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  return (
    <div id={"sf-menu-" + item.label} className="sf-mega">
      <div className="sf-mega-columns">
        {item.columns?.map((column) => (
          <div key={column.title}>
            <h3>{column.title}</h3>
            {column.links.map((link) => (
              <Link key={link.href} href={link.href} onClick={onNavigate}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <Link href="/wedding" className="sf-menu-feature" onClick={onNavigate}>
        <Image
          src="/images/necklace.webp"
          alt="Pearl and kundan necklace"
          width={240}
          height={160}
        />
        <span>
          The Wedding Edit <ArrowRight size={16} />
        </span>
      </Link>
    </div>
  );
}
export function Search({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const results = products
    .filter((p) =>
      (p.name + " " + p.category).toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 5);
  return (
    <div className="sf-search">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/search?q=" + encodeURIComponent(query));
          onClose();
        }}
      >
        <label htmlFor="sf-search-input" className="sr-only">
          Search jewellery
        </label>
        <input
          id="sf-search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jewellery, collections?"
          autoFocus
        />
        <button className="sf-icon" aria-label="View search results">
          <SearchIcon />
        </button>
      </form>
      <p className="sf-eyebrow">
        {query ? "Matching pieces" : "Popular right now"}
      </p>
      {results.length ? (
        results.map((p) => (
          <Link
            key={p.id}
            className="sf-search-result"
            href={"/product/" + p.id}
            onClick={onClose}
          >
            <Image
              src={imagePath(p.image)}
              width={56}
              height={56}
              alt={p.name}
            />
            <span>
              {p.name}
              <small>{p.category}</small>
            </span>
            <strong>{money(p.price)}</strong>
          </Link>
        ))
      ) : (
        <p>No pieces found. Try rings, pearl or earrings.</p>
      )}
    </div>
  );
}
export function Navbar() {
  const [active, setActive] = useState<string | null>(null);
  const [overlay, setOverlay] = useState<"search" | "bag" | "menu" | null>(
    null,
  );
  const navRef = useRef<HTMLElement>(null);
  const close = () => setOverlay(null);
  useEffect(() => {
    useShop.persist.rehydrate();
    const nav = navRef.current;
    const ribbon = document.querySelector(".sf-ribbon");
    const measure = () =>
      document.documentElement.style.setProperty(
        "--store-header-height",
        (nav?.getBoundingClientRect().height || 72) +
          (ribbon?.getBoundingClientRect().height || 32) +
          "px",
      );
    const observer = new ResizeObserver(measure);
    if (nav) observer.observe(nav);
    if (ribbon) observer.observe(ribbon);
    measure();
    return () => observer.disconnect();
  }, []);
  const selected = navigation.find((item) => item.label === active);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <AnnouncementBar />
      <header
        ref={navRef}
        className="sf-header"
        onMouseLeave={() => setActive(null)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node))
            setActive(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setActive(null);
            navRef.current
              ?.querySelector<HTMLButtonElement>('[aria-expanded="true"]')
              ?.focus();
          }
        }}
      >
        <div className="sf-nav-inner">
          <button
            className="sf-icon sf-hamburger"
            aria-label="Open navigation menu"
            onClick={() => setOverlay("menu")}
          >
            <Menu />
          </button>
          <Logo />
          <nav className="sf-desktop-nav" aria-label="Main navigation">
            {navigation.map((item) =>
              item.columns ? (
                <button
                  key={item.label}
                  onMouseEnter={() => setActive(item.label)}
                  onClick={() =>
                    setActive(active === item.label ? null : item.label)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActive(item.label);
                      requestAnimationFrame(() =>
                        document
                          .getElementById("sf-menu-" + item.label)
                          ?.querySelector<HTMLAnchorElement>("a")
                          ?.focus(),
                      );
                    }
                  }}
                  aria-expanded={active === item.label}
                  aria-controls={"sf-menu-" + item.label}
                >
                  {item.label}
                  <ChevronDown size={11} />
                </button>
              ) : (
                <Link
                  href={item.href}
                  key={item.label}
                  onMouseEnter={() => setActive(null)}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
          <div className="sf-nav-actions">
            <button
              className="sf-icon sf-desktop-action"
              aria-label="Search jewellery"
              onClick={() => {
                setActive(null);
                setOverlay("search");
              }}
            >
              <SearchIcon />
            </button>
            <WishlistButton />
            <Link
              className="sf-icon sf-desktop-action"
              href="/account"
              aria-label="Account"
            >
              <UserRound />
            </Link>
            <CartButton
              onClick={() => {
                setActive(null);
                setOverlay("bag");
              }}
            />
          </div>
        </div>
        {selected?.columns && (
          <MegaMenu item={selected} onNavigate={() => setActive(null)} />
        )}
      </header>
      {overlay && (
        <Modal
          title={
            overlay === "search"
              ? "Find your next favourite"
              : overlay === "bag"
                ? "Your shopping bag"
                : "Explore Indian Jewellery"
          }
          onClose={close}
          wide={overlay === "search"}
        >
          {overlay === "search" ? (
            <Search onClose={close} />
          ) : overlay === "bag" ? (
            <Bag onNavigate={close} />
          ) : (
            <nav className="sf-mobile-nav" aria-label="Mobile navigation">
              <button
                className="sf-mobile-search"
                onClick={() => setOverlay("search")}
              >
                <SearchIcon size={18} />
                Search jewellery
              </button>
              {navigation.map((item) =>
                item.columns ? (
                  <details key={item.label}>
                    <summary>
                      {item.label}
                      <ChevronDown size={16} />
                    </summary>
                    <Link href={item.href} onClick={close}>
                      View all {item.label.toLowerCase()}
                    </Link>
                    {item.columns.map((col) => (
                      <div key={col.title}>
                        <h3>{col.title}</h3>
                        {col.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={close}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </details>
                ) : (
                  <Link href={item.href} key={item.label} onClick={close}>
                    {item.label}
                  </Link>
                ),
              )}
              <Link href="/account" onClick={close}>
                My account
              </Link>
            </nav>
          )}
        </Modal>
      )}
    </>
  );
}
