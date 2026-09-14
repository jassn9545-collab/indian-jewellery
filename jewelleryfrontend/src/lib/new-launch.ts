export type NewLaunchItem = {
  id: string;
  image: string;
  alt: string;
  title: string;
  buttonText: string;
  link: string;
};

export const newLaunchItems: NewLaunchItem[] = [
  {
    id: "pillars-of-time",
    image: "/images/necklace.webp",
    alt: "Pearl and kundan necklace on a warm ivory background",
    title: "Pillars of Time",
    buttonText: "SHOP NOW",
    link: "/category/necklaces",
  },
  {
    id: "leafy-affair",
    image: "/images/earrings.webp",
    alt: "Floral kundan earrings with emerald green drops",
    title: "Leafy Affair",
    buttonText: "SHOP NOW",
    link: "/category/earrings",
  },
  {
    id: "fractals-in-nature",
    image: "/images/silver.webp",
    alt: "Sculpted sterling silver lotus earrings",
    title: "Fractals In Nature",
    buttonText: "SHOP NOW",
    link: "/collections/silver",
  },
  {
    id: "timeless-radiance",
    image: "/images/ring.webp",
    alt: "Gold statement ring with a floral kundan setting",
    title: "Timeless Radiance",
    buttonText: "SHOP NOW",
    link: "/category/rings",
  },
];
