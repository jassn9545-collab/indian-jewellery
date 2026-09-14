"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Heart,
  UserRound,
  ShoppingBag,
  Menu,
  ChevronDown,
  ArrowRight,
  Moon,
  Sun,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useShop } from "@/store/shop";
import { categories, products, imagePath, money } from "@/lib/catalog";
import { Modal } from "@/components/ui/modal";
import { Bag } from "@/components/cart/bag";
const links = [
  ["New In", "new-in"],
  ["Earrings", "earrings"],
  ["Necklaces", "necklaces"],
  ["Rings", "rings"],
  ["Bracelets", "bracelets"],
  ["Mangalsutra", "mangalsutra"],
  ["Silver", "silver"],
];
function subscribeTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("techglock-theme", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("techglock-theme", callback);
  };
}
function readTheme() {
  return localStorage.getItem("techglock-theme") === "dark";
}
export function Navbar() {
  const router = useRouter();
  const [overlay, setOverlay] = useState<"search" | "bag" | "menu" | null>(
    null,
  );
  const isCartOpen = useShop((s) => s.isCartOpen);
  const openCart = useShop((s) => s.openCart);
  const closeCart = useShop((s) => s.closeCart);
  const [mega, setMega] = useState(false);
  const [query, setQuery] = useState("");
  const dark = useSyncExternalStore(subscribeTheme, readTheme, () => false);
  const bag = useShop((s) => s.bag);
  const wishlist = useShop((s) => s.wishlist);
  const close = () => {
    setOverlay(null);
    closeCart();
  };
  useEffect(() => {
    useShop.persist.rehydrate();
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);
  function theme() {
    const next = !dark;
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("techglock-theme", next ? "dark" : "light");
    window.dispatchEvent(new Event("techglock-theme"));
  }
  const results = products
    .filter((p) =>
      (p.name + " " + p.category + " " + p.material)
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .slice(0, 5);
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="announcement">
        <span>
          YOUR FIRST SPARKLE, ON US. 10% OFF WITH <strong>WELCOME10</strong>
        </span>
        <span className="ribbon-assurance">
          <ShieldCheck size={12} /> Secure payments <span>|</span>
          <Truck size={13} /> Free shipping above &#8377;799
        </span>
      </div>
      <header
        className="site-header"
        onKeyDown={(event) => {
          if (event.key === "Escape") setMega(false);
        }}
      >
        <div className="header-inner">
          <button
            className="icon-button mobile-menu"
            aria-label="Open menu"
            title="Menu"
            onClick={() => setOverlay("menu")}
          >
            <Menu />
          </button>
          <Link
            href="/"
            className="wordmark"
            aria-label="Indian Jewellery home"
          >
            INDIAN JEWELLERY<span>JEWELLERY &amp; YOU</span>
          </Link>
          <nav
            className="desktop-nav"
            aria-label="Main navigation"
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("a")) setMega(false);
            }}
          >
            {links.map(([name, slug]) => (
              <Link key={slug} href={"/collections/" + slug}>
                {name}
              </Link>
            ))}
            <button
              onClick={() => setMega(!mega)}
              aria-expanded={mega}
              aria-controls="mega-menu"
            >
              Collections <ChevronDown size={12} />
            </button>
            <Link href="/collections/offers">Offers</Link>
          </nav>
          <div className="header-actions">
            <button
              className="icon-button"
              title="Search"
              aria-label="Search jewellery"
              onClick={() => setOverlay("search")}
            >
              <Search />
            </button>
            <Link
              href="/wishlist"
              className="icon-button desktop-action"
              title="Wishlist"
              aria-label={"Wishlist, " + wishlist.length + " items"}
            >
              <Heart />
              {wishlist.length > 0 && (
                <span className="count">{wishlist.length}</span>
              )}
            </Link>
            <Link
              href="/account"
              className="icon-button desktop-action"
              aria-label="Account"
              title="Account"
            >
              <UserRound />
            </Link>
            <button
              className="icon-button"
              title="Shopping bag"
              aria-label={
                "Open shopping bag, " +
                bag.reduce((s, i) => s + i.quantity, 0) +
                " items"
              }
              onClick={() => {
                setOverlay(null);
                openCart();
              }}
            >
              <ShoppingBag />
              {bag.length > 0 && (
                <span className="count">
                  {bag.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
            <button
              className="icon-button theme-switch desktop-action"
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              title={dark ? "Light mode" : "Dark mode"}
              onClick={theme}
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>
        {mega && (
          <div
            id="mega-menu"
            className="mega-menu"
            onKeyDown={(e) => {
              if (e.key === "Escape") setMega(false);
            }}
          >
            <div>
              <h3>JEWELLERY</h3>
              {categories.slice(0, 6).map((c) => (
                <Link
                  key={c.slug}
                  onClick={() => setMega(false)}
                  href={"/collections/" + c.slug}
                >
                  {c.name}
                </Link>
              ))}
            </div>
            <div>
              <h3>BY OCCASION</h3>
              {["Everyday", "Festive", "Wedding", "Office", "Party"].map(
                (c) => (
                  <Link
                    key={c}
                    onClick={() => setMega(false)}
                    href={"/collections/" + c.toLowerCase()}
                  >
                    {c}
                  </Link>
                ),
              )}
            </div>
            <div>
              <h3>THE EDITS</h3>
              {[
                ["New Arrivals", "new-in"],
                ["Best Sellers", "best-sellers"],
                ["Gifts to Treasure", "gifts"],
                ["Ethnic Essentials", "ethnic"],
              ].map(([name, slug]) => (
                <Link
                  key={slug}
                  onClick={() => setMega(false)}
                  href={"/collections/" + slug}
                >
                  {name}
                </Link>
              ))}
            </div>
            <Link
              href="/collections/wedding"
              className="menu-feature"
              onClick={() => setMega(false)}
            >
              <Image
                src="/images/necklace.webp"
                alt="Pearl and kundan necklace"
                width={260}
                height={140}
              />
              <span>
                The Wedding Edit <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        )}
      </header>
      {(overlay || isCartOpen) && (
        <Modal
          title={
            overlay === "search"
              ? "Find your next favourite"
              : overlay === "menu"
                ? "Explore Indian Jewellery"
                : "Your shopping bag"
          }
          onClose={close}
          wide={overlay === "search"}
        >
          {isCartOpen || overlay === "bag" ? (
            <Bag onNavigate={close} />
          ) : overlay === "menu" ? (
            <nav className="mobile-nav">
              {[
                ...links,
                ["All Jewellery", "all"],
                ["Best Sellers", "best-sellers"],
              ].map(([name, slug]) => (
                <Link
                  key={slug}
                  href={"/collections/" + slug}
                  onClick={() => setOverlay(null)}
                >
                  {name}
                  <ArrowRight size={16} />
                </Link>
              ))}
              <Link href="/wishlist" onClick={() => setOverlay(null)}>
                Wishlist <Heart size={18} />
              </Link>
              <Link href="/account" onClick={() => setOverlay(null)}>
                My account <UserRound size={18} />
              </Link>
              <button onClick={theme}>
                {dark ? "Light appearance" : "Dark appearance"}
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </nav>
          ) : (
            <div className="search-panel">
              <form
                action="/search"
                onSubmit={(event) => {
                  event.preventDefault();
                  setOverlay(null);
                  router.push("/search?q=" + encodeURIComponent(query));
                }}
              >
                <Search size={20} />
                <input
                  name="q"
                  aria-label="Search jewellery"
                  placeholder="Search jewellery, collections..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
                <button
                  className="icon-button"
                  type="submit"
                  title="View search results"
                  aria-label="View search results"
                >
                  <ArrowRight />
                </button>
              </form>
              <p className="eyebrow">
                {query ? "PRODUCTS" : "POPULAR RIGHT NOW"}
              </p>
              {results.length ? (
                results.map((p) => (
                  <Link
                    key={p.id}
                    href={"/products/" + p.id}
                    className="search-result"
                    onClick={() => setOverlay(null)}
                  >
                    <Image
                      src={imagePath(p.image)}
                      alt={p.name}
                      width={64}
                      height={64}
                    />
                    <span>
                      {p.name}
                      <small>{p.category}</small>
                    </span>
                    <strong>{money(p.price)}</strong>
                    <ArrowRight size={16} />
                  </Link>
                ))
              ) : (
                <p>
                  No pieces found. Try &quot;pearl&quot;, &quot;silver&quot; or
                  &quot;earrings&quot;.
                </p>
              )}
              <p className="eyebrow">CATEGORIES &amp; COLLECTIONS</p>
              <div className="search-categories">
                {categories
                  .slice(0, 6)
                  .filter(
                    (c) =>
                      !query ||
                      c.name.toLowerCase().includes(query.toLowerCase()),
                  )
                  .map((c) => (
                    <Link
                      href={"/collections/" + c.slug}
                      key={c.slug}
                      onClick={() => setOverlay(null)}
                    >
                      {c.name}
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
