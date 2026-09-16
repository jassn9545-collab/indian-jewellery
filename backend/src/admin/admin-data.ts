import catalog from "./catalog-seed.json";

export const modules = [
  ["products", "Products", "diamond"],
  ["categories", "Categories", "grid"],
  ["ribbons", "Ribbon Bar", "ribbon"],
  ["local-brand", "Local Brand", "home"],
  ["new-launch", "New Launch", "spark"],
  ["royally-crafted", "Royally Crafted", "crown"],
  ["shop-by-style", "Shop By Style", "layers"],
  ["pure-silver", "Pure Silver", "circle"],
  ["best-sellers", "Best Sellers", "star"],
  ["trending-looks", "Trending Looks", "play"],
  ["reviews", "Customer Reviews", "message"],
] as const;
export type Module = (typeof modules)[number][0];
export type Entry = {
  id: string;
  status: "Active" | "Inactive";
  name?: string;
  title?: string;
  image?: string;
  hoverImage?: string;
  gallery?: string[];
  description?: string;
  categoryId?: string;
  productId?: string;
  sku?: string;
  price?: number;
  salePrice?: number;
  stock?: number;
  link?: string;
  buttonText?: string;
  text?: string;
  video?: string;
  location?: string;
  rating?: number;
  verified?: boolean;
  displayOrder?: number;
  createdAt?: string;
};
export type Database = Record<Module, Entry[]>;
export const money = (n = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export function seedDatabase(): Database {
  const names = [
    ...new Set([
      "Rings",
      "Earrings",
      "Bangles",
      "Bracelets",
      "Watches",
      "Sets",
      "Pendants",
      "Pendant Sets",
      "Couple Rings",
      ...catalog.map((p) => p.category),
      "Other",
    ]),
  ];
  const products: Entry[] = catalog.map((p, i) => ({
    id: p.id,
    name: p.name,
    sku: `IJ-${String(i + 1).padStart(4, "0")}`,
    categoryId: slug(p.category),
    image: `/images/${p.image}.webp`,
    description: p.description,
    price: p.mrp,
    salePrice: p.price,
    stock: p.available ? 12 + i * 3 : 0,
    status: "Active",
    gallery: [],
  }));
  const refs = (ids: string[]) =>
    ids.map((id, i): Entry => ({
      id: crypto.randomUUID(),
      productId: id,
      status: "Active",
      displayOrder: i + 1,
    }));
  return {
    products,
    categories: names.map((name) => ({
      id: slug(name),
      name,
      image: products.find((p) => p.categoryId === slug(name))?.image,
      status: "Active",
    })),
    ribbons: [
      {
        id: "ribbon-1",
        text: "Introducing Lab Grown Diamonds",
        link: "/precious/lab-grown-diamonds",
        status: "Active",
      },
    ],
    "local-brand": [
      {
        id: "local-1",
        title: "Handcrafted in Jaipur",
        description: "Rooted in tradition. Made for you.",
        image: "/images/hero.webp",
        link: "/collections",
        status: "Active",
      },
    ],
    "new-launch": refs(
      catalog.filter((p) => p.badge === "New").map((p) => p.id),
    ),
    "royally-crafted": refs(catalog.slice(0, 4).map((p) => p.id)),
    "shop-by-style": [
      "Modern Fusion",
      "Ultra Glam",
      "Classic Traditional",
      "Contemporary Ethnic",
    ].map((name) => ({
      id: slug(name),
      name,
      buttonText: "Explore collection",
      image: `/images/shop-style-${slug(name)}.png`,
      link: `/collections/${slug(name)}`,
      status: "Active",
    })),
    "pure-silver": refs(
      catalog.filter((p) => p.material.includes("silver")).map((p) => p.id),
    ),
    "best-sellers": refs(
      catalog.filter((p) => p.badge === "Bestseller").map((p) => p.id),
    ),
    "trending-looks": [],
    reviews: [],
  };
}
export function resolveEntry(db: Database, entry: Entry) {
  return entry.productId
    ? db.products.find((p) => p.id === entry.productId)
    : undefined;
}
export function entryName(db: Database, entry: Entry) {
  return (
    entry.name ||
    entry.title ||
    entry.text ||
    resolveEntry(db, entry)?.name ||
    db.categories.find((c) => c.id === entry.categoryId)?.name ||
    "Untitled"
  );
}
export function validateEntry(db: Database, module: Module, entry: Entry) {
  if (module === "products") {
    if (!entry.name?.trim() || !entry.sku?.trim())
      throw new Error("Product name and SKU are required.");
    if (!db.categories.some((c) => c.id === entry.categoryId))
      throw new Error("Choose a valid category.");
    if (
      db.products.some(
        (p) =>
          p.id !== entry.id &&
          p.sku?.toLowerCase() === entry.sku?.toLowerCase(),
      )
    )
      throw new Error("This SKU already exists.");
    if (
      [entry.price, entry.salePrice, entry.stock].some(
        (n) => n === undefined || !Number.isFinite(n) || n < 0,
      )
    )
      throw new Error("Enter valid prices and stock.");
    if (entry.salePrice! > entry.price!)
      throw new Error("Sale price cannot exceed original price.");
    if (!Number.isInteger(entry.stock))
      throw new Error("Stock must be a whole number.");
  }
  if (entry.productId && !db.products.some((p) => p.id === entry.productId))
    throw new Error("Choose an existing product.");
  if (
    [
      "new-launch",
      "royally-crafted",
      "best-sellers",
      "trending-looks",
    ].includes(module) &&
    !entry.productId
  )
    throw new Error("Select a product.");
  if (module === "pure-silver" && !entry.productId && !entry.categoryId)
    throw new Error("Select a product or category.");
  if (module === "pure-silver" && entry.productId && entry.categoryId)
    throw new Error("Select either a product or a category.");
  if (
    entry.productId &&
    db[module].some((e) => e.id !== entry.id && e.productId === entry.productId)
  )
    throw new Error("This product is already in this section.");
  if (entry.link && !/^(\/(?!\/)|https?:\/\/)/.test(entry.link))
    throw new Error("Use a local path or an http(s) link.");
  if (
    module === "reviews" &&
    (!entry.rating || entry.rating < 1 || entry.rating > 5)
  )
    throw new Error("Rating must be between 1 and 5.");
}
export function canDelete(db: Database, module: Module, id: string) {
  if (module === "categories" && db.products.some((p) => p.categoryId === id))
    throw new Error("Move this category’s products before deleting it.");
  if (
    (module === "products" || module === "categories") &&
    Object.entries(db).some(
      ([key, rows]) =>
        key !== module &&
        rows.some((e) =>
          module === "products"
            ? e.productId === id
            : key !== "products" && e.categoryId === id,
        ),
    )
  )
    throw new Error(
      "Remove this item from homepage sections before deleting it.",
    );
}
