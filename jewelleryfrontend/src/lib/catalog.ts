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
  {
    id: "royal-polki-choker",
    name: "Royal Polki Choker",
    category: "Necklaces",
    price: 6499,
    mrp: 8999,
    image: "necklace",
    material: "Gold plated brass",
    gemstone: "Polki Kundan",
    occasion: "Wedding",
    badge: "Bestseller",
    rating: 4.9,
    reviews: 72,
    available: true,
    description:
      "A grand polki choker designed to frame the collarbone with royal brilliance, studded with high-grade uncut stones and pearl drops.",
  },
  {
    id: "chandbali-heritage-earrings",
    name: "Chandbali Heritage Earrings",
    category: "Earrings",
    price: 2899,
    mrp: 3799,
    image: "jhumka",
    material: "Gold plated brass",
    gemstone: "Pearl & Kundan",
    occasion: "Festive",
    badge: "New",
    rating: 4.8,
    reviews: 51,
    available: true,
    description:
      "Crescent moon silhouettes adorned with fine filigree work and cascading seed pearls for an exquisite festive look.",
  },
  {
    id: "solitaire-diamond-ring",
    name: "Solitaire Halo Ring",
    category: "Rings",
    price: 1999,
    mrp: 2799,
    image: "ring",
    material: "925 sterling silver",
    gemstone: "Cubic zirconia",
    occasion: "Everyday",
    badge: "Bestseller",
    rating: 4.9,
    reviews: 110,
    available: true,
    description:
      "A brilliant central solitaire hugged by a sparkling pavé band in high-luster sterling silver.",
  },
  {
    id: "temple-nakshi-bangle",
    name: "Temple Nakshi Bangle",
    category: "Bracelets",
    price: 3499,
    mrp: 4599,
    image: "bracelet",
    material: "Antique gold plated brass",
    gemstone: "Ruby red stones",
    occasion: "Festive",
    badge: "Premium",
    rating: 4.8,
    reviews: 43,
    available: true,
    description:
      "Carved with antique nakshi motifs celebrating South Indian temple architecture with deep ruby-red accents.",
  },
  {
    id: "florence-silver-anklet",
    name: "Florence Silver Anklet",
    category: "Silver",
    price: 1599,
    mrp: 2199,
    image: "silver",
    material: "925 sterling silver",
    gemstone: "None",
    occasion: "Everyday",
    badge: "New",
    rating: 4.7,
    reviews: 36,
    available: true,
    description:
      "Delicate silver link chain finished with micro silver bells that sing with every step.",
  },
  {
    id: "traditional-solah-shringar-mangalsutra",
    name: "Solah Shringar Mangalsutra",
    category: "Mangalsutra",
    price: 3899,
    mrp: 4999,
    image: "mangalsutra",
    material: "18k gold plated brass",
    gemstone: "Black onyx & CZ",
    occasion: "Everyday",
    badge: "Bestseller",
    rating: 4.9,
    reviews: 89,
    available: true,
    description:
      "Handcrafted dual-strand auspicious black beads united by a geometric floral pendant set in 18k gold polish.",
  },
  {
    id: "peacock-meenakari-necklace",
    name: "Peacock Meenakari Necklace",
    category: "Necklaces",
    price: 4599,
    mrp: 5999,
    image: "hero-two",
    material: "Gold plated brass",
    gemstone: "Enamel & Pearls",
    occasion: "Festive",
    badge: "Premium",
    rating: 4.8,
    reviews: 64,
    available: true,
    description:
      "Hand-enameled royal peacock motifs shaded in midnight blues and emerald greens with lustrous South Sea pearls.",
  },
  {
    id: "ruby-halo-cocktail-ring",
    name: "Ruby Halo Cocktail Ring",
    category: "Rings",
    price: 2299,
    mrp: 3199,
    image: "ring",
    material: "Gold plated brass",
    gemstone: "Synthetic Ruby",
    occasion: "Party",
    badge: "New",
    rating: 4.7,
    reviews: 29,
    available: true,
    description:
      "A deep crimson ruby crystal bordered by double tiers of brilliant-cut micro stones on a sculpted shank.",
  },
  {
    id: "minimalist-silver-cuff",
    name: "Minimalist Silver Cuff",
    category: "Silver",
    price: 1499,
    mrp: 1999,
    image: "silver",
    material: "925 sterling silver",
    gemstone: "None",
    occasion: "Office",
    badge: "Bestseller",
    rating: 4.9,
    reviews: 95,
    available: true,
    description:
      "Sleek and understated modern open cuff crafted from hallmarked 925 solid sterling silver with a satin brush finish.",
  },
  {
    id: "gulab-kundan-jhumkas",
    name: "Gulab Kundan Jhumkas",
    category: "Earrings",
    price: 2699,
    mrp: 3499,
    image: "earrings",
    material: "Gold plated brass",
    gemstone: "Pink Tourmaline & Kundan",
    occasion: "Festive",
    badge: "Bestseller",
    rating: 4.9,
    reviews: 78,
    available: true,
    description:
      "Rose-tinted stones surrounded by heritage Jadau kundan work and a graceful dome with dancing seed pearls.",
  },
  {
    id: "layered-coin-haar",
    name: "Layered Kasu Haar",
    category: "Necklaces",
    price: 5299,
    mrp: 6999,
    image: "hero-three",
    material: "Gold plated brass",
    gemstone: "None",
    occasion: "Festive",
    badge: "New",
    rating: 4.8,
    reviews: 40,
    available: true,
    description:
      "Timeless multi-layered Lakshmi coin necklace that cascades gently, embodying auspicious prosperity and royal grace.",
  },
  {
    id: "eternity-band-ring",
    name: "Sparkle Eternity Band",
    category: "Rings",
    price: 1699,
    mrp: 2299,
    image: "ring",
    material: "925 sterling silver",
    gemstone: "Cubic zirconia",
    occasion: "Office",
    badge: "New",
    rating: 4.8,
    reviews: 52,
    available: true,
    description:
      "An unbroken circle of shimmer featuring bezel-set round gems designed for stackable everyday elegance.",
  },
  {
    id: "jadau-openable-kada",
    name: "Jadau Openable Kada",
    category: "Bracelets",
    price: 4199,
    mrp: 5499,
    image: "bracelet",
    material: "Gold plated brass",
    gemstone: "Kundan & Green Beads",
    occasion: "Wedding",
    badge: "Premium",
    rating: 4.9,
    reviews: 67,
    available: true,
    description:
      "A statement openable bracelet adorned with uncut Jadau stones and threaded with emerald green beads.",
  },
  {
    id: "classic-pearl-drop-mangalsutra",
    name: "Pearl Drop Mangalsutra",
    category: "Mangalsutra",
    price: 2999,
    mrp: 3999,
    image: "mangalsutra",
    material: "Gold plated brass",
    gemstone: "Freshwater Pearl",
    occasion: "Everyday",
    badge: "New",
    rating: 4.7,
    reviews: 34,
    available: true,
    description:
      "A dainty contemporary mangalsutra featuring a dangling natural pearl center for a refined modern aesthetic.",
  },
  {
    id: "vintage-filigree-earrings",
    name: "Vintage Filigree Jhumkas",
    category: "Silver",
    price: 1799,
    mrp: 2399,
    image: "silver",
    material: "925 sterling silver",
    gemstone: "Oxidized Silver",
    occasion: "Office",
    badge: "Bestseller",
    rating: 4.8,
    reviews: 88,
    available: true,
    description:
      "Oxidized tribal-inspired silver earrings with delicate filigree lattice work and delicate chime drops.",
  },
  {
    id: "regal-maharani-choker-set",
    name: "Maharani Grand Choker Set",
    category: "Necklaces",
    price: 8999,
    mrp: 11999,
    image: "hero",
    material: "Gold plated brass",
    gemstone: "Emerald & Kundan",
    occasion: "Wedding",
    badge: "Premium",
    rating: 5.0,
    reviews: 115,
    available: true,
    description:
      "The pinnacle of bridal opulence: a magnificent multi-tier choker paired with statement earrings and maang tikka.",
  },
  {
    id: "sapphire-glow-studs",
    name: "Sapphire Glow Studs",
    category: "Earrings",
    price: 1899,
    mrp: 2599,
    image: "earrings",
    material: "Gold plated brass",
    gemstone: "Blue Sapphire Glass",
    occasion: "Party",
    badge: "New",
    rating: 4.7,
    reviews: 23,
    available: true,
    description:
      "Radiant cushion-cut sapphire blue crystals framed with a brilliant halo for evening glam.",
  },
  {
    id: "geometric-gold-chain-bracelet",
    name: "Geometric Link Bracelet",
    category: "Bracelets",
    price: 1999,
    mrp: 2699,
    image: "bracelet",
    material: "Gold plated brass",
    gemstone: "None",
    occasion: "Office",
    badge: "Bestseller",
    rating: 4.8,
    reviews: 47,
    available: true,
    description:
      "Bold interlocking paperclip links in polished 18k yellow gold finish with an adjustable lobster clasp.",
  },
  {
    id: "navratna-gemstone-ring",
    name: "Navratna Bloom Ring",
    category: "Rings",
    price: 2599,
    mrp: 3399,
    image: "ring",
    material: "Gold plated brass",
    gemstone: "Multi-color Gemstones",
    occasion: "Festive",
    badge: "Premium",
    rating: 4.9,
    reviews: 58,
    available: true,
    description:
      "Nine sacred gemstones arranged in an auspicious blooming flower design to channel positivity and harmony.",
  },
  {
    id: "dainty-floral-mangalsutra",
    name: "Dainty Floral Mangalsutra",
    category: "Mangalsutra",
    price: 2499,
    mrp: 3299,
    image: "mangalsutra",
    material: "Gold plated brass",
    gemstone: "Cubic zirconia",
    occasion: "Everyday",
    badge: "Bestseller",
    rating: 4.9,
    reviews: 61,
    available: true,
    description:
      "A minimalist five-petal blossom pendant suspended on a delicate single-strand black bead chain.",
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
