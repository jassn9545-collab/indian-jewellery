import { NewLaunchSection } from "@/components/storefront/new-launch";
import { ShopByStyleSection } from "@/components/storefront/shop-by-style";
import {
  SilverSection,
  TrendingLooksSection,
  CustomerReviewsSection,
} from "@/components/home/existing-sections";
import {
  HeroCarousel,
  CategorySection,
  LocalBrand,
  FeaturedProducts,
  BestSellers,
} from "@/components/storefront/home";

export default function Home() {
  return (
    <main id="main" className="sf-home">
      <HeroCarousel />
      <CategorySection />
      {/* Local Brand / Handcrafted in Jaipur */}
      <LocalBrand />
      {/* 1. New Launch */}
      <NewLaunchSection />
      {/* 2. Crafted Locally, Loved Everywhere */}
      <FeaturedProducts />
      {/* 3. Shop by style */}
      <ShopByStyleSection />
      {/* 4. Pure Silver. Simply you. */}
      <SilverSection />
      {/* 5. Best Sellers */}
      <BestSellers />
      {/* 6. Trending Looks & Reviews */}
      <TrendingLooksSection />
      <CustomerReviewsSection />
    </main>
  );
}
