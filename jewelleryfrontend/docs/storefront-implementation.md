# Indian Jewellery storefront implementation

Application: Next.js App Router + TypeScript. See [requirements](../../requirements/requirements.txt)
for the full route inventory, scope and setup.

## Homepage composition

Current `src/app/page.tsx` order: HeroCarousel, CategorySection, LocalBrand,
NewLaunchSection, FeaturedProducts, ShopByStyleSection, SilverSection, BestSellers,
TrendingLooksSection and CustomerReviewsSection. The shared root layout adds Navbar
and Footer. Earlier requirements describe a different order and additional arrivals/craft
sections; the current working layout is preserved during bug fixes. Browser checks target
this composition.
The old trust/benefits bar is removed. Footer includes the newsletter preview.

`src/lib/storefront.ts` supplies navigation, hero/category and featured-product data.
`src/lib/catalog.ts` supplies sample products, styles and collection aliases.
`src/store/shop.ts` persists cart/wishlist IDs and quantities in browser storage.

## New Launch

- Data: `src/lib/new-launch.ts`; four campaign items with id, title, image, alt, buttonText, link.
- UI: `src/components/storefront/new-launch.tsx`; Section, Carousel and Card exports.
- CSS: adjacent `new-launch.module.css`, scoped to avoid changing existing sections.
- NewLaunchSection accepts an optional readonly items array; empty input hides the section.
- Images reuse local necklace, earrings, silver and ring photography.
- CSS Grid creates 3.25 cards on desktop, 2.25 on tablet, and approximately 1.15 on mobile,
  including the intentional next-card preview and consistent gaps.
- Native scroll snapping supports touch; pointer events add mouse dragging without
  following links during a drag. Arrows use measured card widths and rewind at the ends.
- Keyboard: left/right arrows, Home/End; individual links retain normal tab navigation.
- No autoplay or cloned infinite slides. Reduced motion changes programmatic scrolling to instant.

## Preserved behavior

Ribbon and hero autoplay pause on hover, focus, hidden tabs and reduced motion.
ResizeObserver measures the 36px ribbon and 80px sticky header for hero viewport fit.
Category crop positions center Hair Accessories and Bags. Featured products retain no
border, compact information spacing and smaller inset images. Current section refinements are preserved.

## Verification

Run lint, TypeScript and production build. With the dev server running, use
`node scripts/verify-storefront.mjs` and `node scripts/verify-new-launch.mjs`.
`node scripts/verify-fixes.mjs` checks repeated search parameters, CZ results, cart limits
and populated 320px product/cart/drawer layouts. All scripts use installed Microsoft Edge headlessly; screenshots go in ignored `artifacts/`.
Set `STOREFRONT_URL` for a different port. No backend is required.

## Shared product listings

All category routes, collections (including navigation aliases), Best Sellers, Wedding,
Precious and search use `Collection` and the shared `.listing-container` shell.
The shell uses the full homepage width and `--sf-page-gutter` (16px on mobile), without a content-width cap.
`BestSellerCard` in `src/components/product/best-seller-card.tsx` is extracted from the
homepage and used by both homepage product sections, listings, wishlist and related products.
Its shared styles preserve the image ratio/insets, typography, wishlist, badge and button.
Listing grids use four desktop columns, three laptop columns and two tablet/mobile columns
(with two columns beside tablet filters). Grid rows stay content-sized even beside tall filters.
Run `node scripts/verify-listings.mjs` to check route coverage, card styling, responsive
spacing and shopping/filter interactions.
