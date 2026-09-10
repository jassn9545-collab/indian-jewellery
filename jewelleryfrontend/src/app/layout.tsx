import type { Metadata } from "next";
import { IBM_Plex_Sans, Cormorant_Garamond } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StructuredData } from "@/components/ui/structured-data";
import "./globals.css";
import "./responsive.css";
const bodyFont = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL("https://techglock.com"),
  title: {
    default: "TECHGLOCK | Contemporary Indian Jewellery",
    template: "%s | TECHGLOCK",
  },
  description:
    "Discover contemporary Indian jewellery, from emerald kundan earrings and pearl necklaces to everyday sterling silver. Timeless craftsmanship, beautifully you.",
  openGraph: {
    title: "TECHGLOCK | Jewellery & You",
    description:
      "Modern Indian jewellery. Timeless stories. Beautifully yours.",
    images: [
      {
        url: "/images/hero.webp",
        width: 1536,
        height: 1024,
        alt: "TECHGLOCK Indian jewellery collection",
      },
    ],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={bodyFont.variable + " " + displayFont.variable}
    >
      <body>
        <StructuredData data={{ "@context": "https://schema.org", "@type": "Organization", name: "TECHGLOCK", url: "https://techglock.com" }} />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
