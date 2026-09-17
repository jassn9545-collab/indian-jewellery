import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./design-system.css";

const bodyFont = localFont({ src: "../../public/fonts/inter-latin.woff2", variable: "--font-brand-body", weight: "400 600", display: "swap" });
const displayFont = localFont({ src: "../../public/fonts/cormorant-garamond-latin.woff2", variable: "--font-brand-display", weight: "400 600", display: "swap" });

export const metadata: Metadata = {
  title: "Jewellery Admin Panel",
  description: "Jewellery store administration",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
