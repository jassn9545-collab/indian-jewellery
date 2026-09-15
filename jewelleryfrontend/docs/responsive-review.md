# Responsive review — 15 September 2026

## Changes and visual checks

1. **Homepage / silver collection — corrected.** Mobile copy now shares the 16px page gutter. Benefits wrap without forcing the image/copy grid wider. The hero has a minimum height so its CTA remains inside the slide on short landscape screens.
2. **New Arrivals and shared listing pages — corrected.** Mobile sort controls occupy their own row. Product names remain fully visible, prices can wrap, and cart buttons grow with their labels. Breadcrumbs and long page titles wrap.
3. **Filters — corrected.** Only drawer content scrolls; the heading, 44px close control, and result button remain visible. Stock selection and applying results were tested at 320 × 568.
4. **Header, footer and branding — corrected.** The footer reuses the actual logo; SVG filter IDs are unique per instance. The browser icon now uses the same artwork. Footer columns can shrink without forcing the page wider. Header action targets are 44px on mobile.
5. **Product, cart, checkout, account and supporting pages — checked.** Grid children, thumbnails, forms and long text can shrink/wrap. Populated 320px cart and bag checks pass. Shared search/navigation drawers use the same scrolling layout.

Horizontal scrolling remains available inside carousels; overscroll is contained there. Page content is not globally hidden to disguise overflow.

## Evidence

Screenshots from this run are in `artifacts/responsive/` (ignored local artifacts):

- `before-home.png`, `before-listing.png`, `before-filter.png`
- `after-silver.png`, `new-arrivals-final.png`
- `filter-final.png`, `filter-bottom-final.png`
- `footer-clean.png` (sticky header hidden for this isolated footer capture)
- `product-final.png`

### New Arrivals at 320px

![New Arrivals heading and toolbar](../artifacts/responsive/new-arrivals-final.png)

### Filters at 320 × 568

![Scrolled filter drawer with close and apply actions visible](../artifacts/responsive/filter-bottom-final.png)

### Silver section at 390px

![Silver section with aligned mobile copy and benefits](../artifacts/responsive/after-silver.png)

## Verification

Final result: 318 linked-route/viewport checks plus 63 additional static-route/viewport checks passed. No page-level horizontal overflow was detected in these checks. Mobile filter/navigation/search interactions also passed.

- ESLint, TypeScript and production build.
- `node scripts/verify-responsive.mjs`: linked routes at 320, 390, 768, 1024, 1280 and 1440px; page overflow, product text clipping, shared logos, filter actions, navigation and search.
- Additional generated static routes checked at 320, 768 and 1440px.
- `node scripts/verify-fixes.mjs`: populated cart/bag, quantity limit and repeated search parameters.
- `node scripts/verify-new-launch.mjs`: carousel sizing, arrows, keyboard, drag, touch swipe and reduced motion at six widths.
- Hero CTA bounds at 320 × 568, 844 × 390 and 1110 × 700; listing overflow at 200% CSS zoom.

Browser evidence uses installed Microsoft Edge in headless mode. Physical iOS/Android devices and Safari were not tested; this is not a full accessibility certification.
