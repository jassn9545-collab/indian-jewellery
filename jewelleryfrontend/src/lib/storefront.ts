import { products } from "./catalog";
export const storefrontCategories = [
  { name: "Rings", slug: "rings", image: "ring" },
  { name: "Earrings", slug: "earrings", image: "earrings" },
  { name: "Necklaces", slug: "necklaces", image: "necklace" },
  { name: "Bangles", slug: "bangles", image: "bracelet" },
  { name: "Bracelets", slug: "bracelets", image: "bracelet" },
  { name: "Sets", slug: "sets", image: "necklace" },
  { name: "Mangalsutra", slug: "mangalsutra", image: "mangalsutra" },
  { name: "Watches", slug: "watches", referenceLeft: 870 },
  { name: "Hair Accessories", slug: "hair-accessories", referenceLeft: 686 },
  { name: "Bags", slug: "bags", referenceLeft: 778 },
];
export const heroSlides = [
  {
    image: "hero",
    alt: "Indian woman wearing emerald kundan jewellery and an ivory saree",
    eyebrow: "TIMELESS ELEGANCE",
    title: ["Timeless Jewellery,", "Crafted for You"],
    copy: "Discover exquisite designs for every moment of your life.",
    cta: "Shop now",
    href: "/collections",
  },
  {
    image: "hero-two",
    alt: "Woman in an ivory saree wearing emerald and gold jewellery",
    eyebrow: "NEW COLLECTION",
    title: ["Where Tradition", "Meets Modern Luxury"],
    copy: "Discover statement pieces designed for the modern woman.",
    cta: "Explore collection",
    href: "/collections/new-launch",
  },
  {
    image: "hero-three",
    alt: "Indian woman wearing emerald jewellery in a sunlit courtyard",
    eyebrow: "THE PRECIOUS EDIT",
    title: ["Brilliance,", "Beautifully Reimagined"],
    copy: "Discover timeless jewellery for your everyday moments.",
    cta: "Discover now",
    href: "/precious/lab-grown-diamonds",
  },
];
type MenuLink = { label: string; href: string };
export type MenuColumn = { title: string; href?: string; links: MenuLink[] };
export type NavItem = { label: string; href: string; columns?: MenuColumn[] };
const collection = (label: string): MenuLink => ({
  label,
  href: "/collections/" + label.toLowerCase().replaceAll(" ", "-"),
});
export const navigation: NavItem[] = [
  {
    label: "Women",
    href: "/collections/women",
    columns: [
      {
        title: "Shop by category",
        links: storefrontCategories.slice(0, 7).map((c) => ({
          label: c.name === "Sets" ? "Jewellery Sets" : c.name,
          href: "/category/" + c.slug,
        })),
      },
      {
        title: "Shop by style",
        links: [
          "Everyday",
          "Statement",
          "Minimal",
          "Traditional",
          "Contemporary",
        ].map(collection),
      },
      {
        title: "Shop by price",
        links: [
          { label: "Under ₹2,000", href: "/collections/under-2000" },
          { label: "₹2,000 – ₹5,000", href: "/collections/2000-5000" },
          { label: "₹5,000 – ₹10,000", href: "/collections/5000-10000" },
          { label: "Above ₹10,000", href: "/collections/above-10000" },
        ],
      },
      {
        title: "New arrival",
        links: ["New Launches", "Trending Jewellery", "Bestsellers"].map(
          collection,
        ),
      },
    ],
  },
  {
    label: "Men",
    href: "/collections/men",
    columns: [
      {
        title: "New launch",
        links: ["Latest Designs", "New Arrivals"].map(collection),
      },
      {
        title: "Shop by category",
        links: ["Rings", "Bracelets", "Chains", "Kada", "Watches"].map((x) => ({
          label: x,
          href: "/collections/men-" + x.toLowerCase(),
        })),
      },
      {
        title: "Best sellers",
        links: ["Trending", "Most Loved", "Everyday Essentials"].map(
          collection,
        ),
      },
    ],
  },
  { label: "Best Sellers", href: "/best-sellers" },
  {
    label: "Precious",
    href: "/precious",
    columns: [
      {
        title: "Lab Grown Diamonds",
        href: "/precious/lab-grown-diamonds",
        links: [
          { label: "Explore diamonds", href: "/precious/lab-grown-diamonds" },
          { label: "All precious jewellery", href: "/precious" },
        ],
      },
      {
        title: "Sterling Silver",
        href: "/collections/silver",
        links: [
          { label: "Shop silver", href: "/collections/silver" },
          { label: "Silver jewellery care", href: "/help/care" },
        ],
      },
      {
        title: "New Arrival",
        href: "/collections/new-launch",
        links: [
          { label: "Latest designs", href: "/collections/new-launch" },
          { label: "New earrings", href: "/category/earrings" },
          { label: "New rings", href: "/category/rings" },
        ],
      },
      {
        title: "Best Sellers",
        href: "/best-sellers",
        links: [
          { label: "Most loved pieces", href: "/best-sellers" },
          { label: "Everyday favourites", href: "/collections/everyday" },
        ],
      },
      {
        title: "Collections",
        href: "/collections",
        links: [
          { label: "Explore all", href: "/collections" },
          { label: "Wedding edit", href: "/wedding" },
          { label: "Jewellery sets", href: "/category/sets" },
        ],
      },
    ],
  },
  {
    label: "Collections",
    href: "/collections",
    columns: [
      {
        title: "New Launch",
        href: "/collections/new-launch",
        links: [
          { label: "Latest designs", href: "/collections/new-launch" },
          { label: "Earrings", href: "/category/earrings" },
          { label: "Rings", href: "/category/rings" },
        ],
      },
      {
        title: "Wedding",
        href: "/wedding",
        links: [
          { label: "Wedding edit", href: "/wedding" },
          { label: "Necklaces", href: "/category/necklaces" },
          { label: "Jewellery sets", href: "/category/sets" },
        ],
      },
      {
        title: "Best Sellers",
        href: "/best-sellers",
        links: [
          { label: "Most loved", href: "/best-sellers" },
          { label: "Everyday essentials", href: "/collections/everyday" },
        ],
      },
      {
        title: "Oxidised",
        href: "/collections/oxidised",
        links: [
          { label: "Explore oxidised", href: "/collections/oxidised" },
          { label: "Jewellery care", href: "/help/care" },
        ],
      },
      {
        title: "CZ",
        href: "/collections/cz",
        links: [
          { label: "Explore CZ", href: "/collections/cz" },
          { label: "Styling inspiration", href: "/collections/party" },
        ],
      },
      {
        title: "Sterling Silver",
        href: "/collections/silver",
        links: [
          { label: "Shop silver", href: "/collections/silver" },
          { label: "Silver care", href: "/help/care" },
        ],
      },
    ],
  },
  { label: "Wedding", href: "/wedding" },
];
export const featuredProducts = [
  products[0],
  products[2],
  products[1],
  products[4],
];
export const bestSellerProducts = [
  products[1],
  products[5],
  products[3],
  products[4],
];
