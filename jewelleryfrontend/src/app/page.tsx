import {
  HeroCarousel,
  CategorySection,
  LocalBrand,
  FeaturedProducts,
} from "@/components/storefront/home";
export default function Home() {
  return (
    <main id="main" className="sf-home">
      <HeroCarousel />
      <CategorySection />
      <LocalBrand />
      <FeaturedProducts />
    </main>
  );
}
