export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  image: string;
  material: string;
  gemstone: string;
  occasion: string;
  badge: string;
  rating: number;
  reviews: number;
  available: boolean;
  description: string;
};
export const products: Product[] = [
  {
    id: "emerald-drop-earrings",
    name: "Emerald Drop Earrings",
    category: "Earrings",
    price: 2499,
    mrp: 3299,
    image: "earrings",
    material: "Gold plated brass",
    gemstone: "Emerald glass",
    occasion: "Festive",
    badge: "New",
    rating: 4.9,
    reviews: 48,
    available: true,
    description:
      "A little heritage, a little you. Floral kundan motifs meet emerald-green drops and delicate pearl accents in a pair made for memorable evenings.",
  },
  {
    id: "pearl-heritage-necklace",
    name: "Pearl Cluster Necklace",
    category: "Necklaces",
    price: 3299,
    mrp: 4699,
    image: "necklace",
    material: "Gold plated brass",
    gemstone: "Pearl",
    occasion: "Wedding",
    badge: "Bestseller",
    rating: 4.8,
    reviews: 126,
    available: true,
    description:
      "Soft pearl strands frame intricate kundan flowers. A statement necklace that brings an effortless sense of occasion to silk sarees and contemporary silhouettes.",
  },
  {
    id: "kundan-statement-ring",
    name: "Heritage Gold Ring",
    category: "Rings",
    price: 1799,
    mrp: 2499,
    image: "ring",
    material: "Gold plated brass",
    gemstone: "Kundan glass",
    occasion: "Party",
    badge: "New",
    rating: 4.9,
    reviews: 32,
    available: true,
    description:
      "An luminous kundan centre, framed by a sculptural floral halo. This adjustable statement ring is the finishing touch for your favourite celebrations.",
  },
  {
    id: "silver-lotus-earrings",
    name: "Silver Lotus Earrings",
    category: "Silver",
    price: 1899,
    mrp: 2499,
    image: "silver",
    material: "925 sterling silver",
    gemstone: "Cubic zirconia",
    occasion: "Everyday",
    badge: "Bestseller",
    rating: 4.8,
    reviews: 84,
    available: true,
    description:
      "Inspired by the quiet beauty of a lotus. Delicately sculpted silver petals and tiny sparkling accents make these studs an everyday favourite.",
  },
  {
    id: "classic-gold-bracelet",
    name: "Emerald Gold Bangle",
    category: "Bracelets",
    price: 2199,
    mrp: 2999,
    image: "bracelet",
    material: "Gold plated brass",
    gemstone: "None",
    occasion: "Office",
    badge: "New",
    rating: 4.7,
    reviews: 27,
    available: true,
    description:
      "A clean, sculptural gold cuff with a softly polished finish. Designed to slip effortlessly into your everyday jewellery ritual.",
  },
  {
    id: "meenakari-jhumka",
    name: "Meenakari Jhumka",
    category: "Earrings",
    price: 2199,
    mrp: 2999,
    image: "jhumka",
    material: "Gold plated brass",
    gemstone: "Enamel",
    occasion: "Festive",
    badge: "Premium",
    rating: 4.9,
    reviews: 63,
    available: true,
    description:
      "Rich green enamel, intricate gold detailing and a fringe of tiny pearls. A joyful tribute to the enduring beauty of Indian meenakari.",
  },
  {
    id: "everyday-mangalsutra",
    name: "Everyday Mangalsutra",
    category: "Mangalsutra",
    price: 2799,
    mrp: 3499,
    image: "mangalsutra",
    material: "Gold plated brass",
    gemstone: "Cubic zirconia",
    occasion: "Everyday",
    badge: "New",
    rating: 4.8,
    reviews: 39,
    available: true,
    description:
      "Classic black beads meet a delicate gold pendant. A meaningful piece, reimagined with a lighter silhouette for every day.",
  },
  {
    id: "bridal-kundan-necklace",
    name: "Bridal Kundan Necklace",
    category: "Necklaces",
    price: 7999,
    mrp: 9999,
    image: "necklace",
    material: "Gold plated brass",
    gemstone: "Pearl",
    occasion: "Wedding",
    badge: "Premium",
    rating: 4.9,
    reviews: 56,
    available: false,
    description:
      "An occasion-worthy pearl and kundan necklace, created for moments you will remember forever.",
  },
];
export const categories = [
  { name: "Earrings", slug: "earrings", image: "earrings" },
  { name: "Necklaces", slug: "necklaces", image: "necklace" },
  { name: "Rings", slug: "rings", image: "ring" },
  { name: "Bracelets", slug: "bracelets", image: "bracelet" },
  { name: "Mangalsutra", slug: "mangalsutra", image: "mangalsutra" },
  { name: "Silver Jewellery", slug: "silver", image: "silver" },
  { name: "Gift Sets", slug: "gifts", image: "necklace" },
  { name: "Men's Jewellery", slug: "mens", image: "bracelet" },
  { name: "Kids Jewellery", slug: "kids", image: "silver" },
  { name: "Wedding Edit", slug: "wedding", image: "jhumka" },
];
export const styles = [
  {
    name: "Everyday Wear",
    slug: "everyday",
    copy: "The beauty in little things.",
    image: "silver",
  },
  {
    name: "Festive Edit",
    slug: "festive",
    copy: "For moments that shine.",
    image: "jhumka",
  },
  {
    name: "Wedding Collection",
    slug: "wedding",
    copy: "Something to treasure forever.",
    image: "necklace",
  },
  {
    name: "Office Wear",
    slug: "office",
    copy: "A quietly confident statement.",
    image: "bracelet",
  },
  {
    name: "Party Wear",
    slug: "party",
    copy: "A little after-dark sparkle.",
    image: "ring",
  },
  {
    name: "Ethnic Essentials",
    slug: "ethnic",
    copy: "Rooted in beautiful traditions.",
    image: "earrings",
  },
];
export const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
export const imagePath = (key: string) => "/images/" + key + ".webp";
export function collectionProducts(slug: string) {
  const aliases: Record<string, string> = {
    "new-launch": "new-in",
    "new-launches": "new-in",
    "new-arrivals": "new-in",
    "latest-designs": "new-in",
    "trending-jewellery": "best-sellers",
    bestsellers: "best-sellers",
    trending: "best-sellers",
    "most-loved": "best-sellers",
    "everyday-essentials": "everyday",
    traditional: "festive",
    statement: "party",
    minimal: "everyday",
    contemporary: "office",
    bangles: "bracelets",
    sets: "gifts",
    "men-rings": "rings",
    "men-bracelets": "bracelets",
    women: "all",
    men: "mens",
  };
  slug = aliases[slug] || slug;
  if (slug === "under-2000") return products.filter((p) => p.price < 2000);
  if (slug === "2000-5000")
    return products.filter((p) => p.price >= 2000 && p.price <= 5000);
  if (slug === "5000-10000")
    return products.filter((p) => p.price > 5000 && p.price <= 10000);
  if (slug === "above-10000") return products.filter((p) => p.price > 10000);
  if (slug === "cz")
    return products.filter((p) => p.gemstone === "Cubic zirconia");
  if (slug === "silver")
    return products.filter((p) => p.material.toLowerCase().includes("silver"));
  if (slug === "precious")
    return products.filter(
      (p) =>
        p.material.includes("sterling silver") ||
        p.gemstone.toLowerCase().includes("diamond"),
    );
  if (slug === "lab-grown-diamonds")
    return products.filter((p) =>
      p.gemstone.toLowerCase().includes("lab grown diamond"),
    );

  if (["all", "new-in", "offers", "gifts", "ethnic"].includes(slug))
    return products;
  if (slug === "best-sellers")
    return products.filter((p) => p.badge === "Bestseller");
  return products.filter(
    (p) =>
      p.category.toLowerCase() === slug || p.occasion.toLowerCase() === slug,
  );
}
export const collectionTitle = (slug: string) =>
  ({
    all: "All Jewellery",
    "new-in": "New Arrivals",
    "best-sellers": "Best Sellers",
    silver: "Pure Silver",
    gifts: "The Gifting Edit",
    mens: "Men's Jewellery",
    kids: "Kids Jewellery",
    ethnic: "Ethnic Essentials",
  })[slug] ||
  slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
