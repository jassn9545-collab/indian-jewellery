export type ShopByStyleItem = {
  id: string;
  title: string;
  image: string;
  alt: string;
  buttonText: string;
  link: string;
};

export const shopByStyle: ShopByStyleItem[] = [
  {
    id: "modern-fusion",
    title: "Modern Fusion",
    image: "/images/shop-style-modern-fusion.png",
    alt: "Modern gold hoop earrings and ring styled with an ivory blazer",
    buttonText: "EXPLORE",
    link: "/collections/office",
  },
  {
    id: "ultra-glam",
    title: "Ultra Glam",
    image: "/images/shop-style-ultra-glam.png",
    alt: "Statement emerald and diamond jewellery styled with an emerald dress",
    buttonText: "EXPLORE",
    link: "/collections/party",
  },
  {
    id: "classic-traditional",
    title: "Classic Traditional",
    image: "/images/shop-style-classic-traditional.png",
    alt: "Traditional gold necklace and jhumkas styled with a silk saree",
    buttonText: "EXPLORE",
    link: "/collections/festive",
  },
  {
    id: "contemporary-ethnic",
    title: "Contemporary Ethnic",
    image: "/images/shop-style-contemporary-ethnic.png",
    alt: "Gold and emerald earrings styled with a sage embroidered kurta",
    buttonText: "EXPLORE",
    link: "/collections/ethnic",
  },
];
