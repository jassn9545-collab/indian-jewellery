import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { Navbar } from "@/components/storefront/header";
import "./globals.css";
import "./responsive.css";
import "./storefront.css";
import "./responsive-fixes.css";
import "./commerce.css";
const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
export const metadata: Metadata = {
  title: {
    default: "Indian Jewellery | Timeless Jewellery, Crafted for You",
    template: "%s | Indian Jewellery",
  },
  description:
    "Discover locally crafted Indian jewellery. Explore emerald earrings, heritage rings, pearl necklaces and pieces for every occasion.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={bodyFont.variable + " " + displayFont.variable}>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
