# Frontend code review — 2026-09-14

Scope: Next.js routes, storefront and legacy components, catalogue, Zustand state,
forms, global/responsive CSS, CSS modules, assets and verification scripts.
This is a review of the current working tree, including existing uncommitted work.
No application source was modified during this review. Backend remains out of scope.

## Confirmed findings

### 1. P2 — Narrow-screen cart and product layout overflow

Sources: src/app/shop.css:169, :188, :332, :384; src/app/responsive.css:588.
At a 320px viewport, a cart containing emerald-drop-earrings has document scrollWidth
328px. The product detail route has the same 328px overflow. The bag dialog has
clientWidth 319px and scrollWidth 332px. Empty-cart checks miss this failure.
The fixed image column and unwrapped quantity/action controls impose minimum widths;
the product grid and action row have a similar minimum-content constraint.
Use shrinkable grid columns/min-width:0 and responsive action wrapping. Verify populated
cart, bag drawer and long product content at 320px after changing the layout.

### 2. P2 — Repeated search parameters crash the search page

Source: src/app/search/page.tsx:9-13.
Opening /search?q=ring&q=pearl reproduces the generic error boundary. q is typed as
string but repeated query keys arrive as an array; q.toLowerCase() then fails.
Normalize string|string[]|undefined before filtering and populating the input.
The streamed response observed was HTTP 200 with error UI; this is not a verified 500.

### 3. P2 — CZ collection hides existing matching products

Source: src/lib/catalog.ts:256.
/collections/cz is linked from navigation but displays 0 pieces. Two catalogue
products have gemstone Cubic zirconia. The fallback only compares category and occasion,
so it cannot match CZ. Add an explicit gemstone mapping. Other empty collections without
sample inventory are expected and were not classified as bugs.

### 4. P2 — Add-to-bag success is shown when no quantity was added

Sources: src/components/product/product-detail.tsx:32;
src/components/product/product-card.tsx:24; src/store/shop.ts:23.
With 10 emerald-drop-earrings already in the bag, clicking Add to bag on its detail
page announces success while persisted quantity stays 10. Collection/quick-view cards
use the same unconditional success pattern. Check remaining capacity and disable or
report the limit; have the store action communicate whether/how many items were added.

### 5. P2 — Browser verification scripts stop before exercising current flows

Sources: scripts/verify-storefront.mjs:14; scripts/verify-new-launch.mjs:54.
Both scripts were run and failed. Storefront expects 4 .sf-product elements but finds 8
across featured and best-seller sections. It also expects removed legacy section classes.
New Launch expects categories -> New Launch -> LocalBrand, but current page.tsx renders
categories -> LocalBrand -> New Launch. Requirements also describe the older order.
Reconcile the approved layout with documentation and update scoped assertions accordingly;
do not remove assertions merely to make tests green. The remaining checks in these scripts
were not reached, so their flows cannot be reported as passing.

### 6. P2 — Account/product tabs lack their keyboard and panel relationships

Sources: src/app/account/page.tsx:28; src/components/product/product-detail.tsx:226.
Browser checks confirm ArrowRight leaves focus and selection on the first tab. Every tab
has tabIndex 0 and no aria-controls; panels lack associated tab labels. Implement roving
tabindex, arrow/Home/End focus behavior and tab-panel IDs, or use ordinary buttons without
claiming the tab pattern. Existing Tab/Enter activation is possible; this is not total
keyboard inaccessibility.

### 7. P2 — Homepage presents sample testimonials as verified purchases

Source: src/components/home/existing-sections.tsx:254-330.
Four hardcoded sample reviews all set verified:true and render Verified Buyer. The terms
page identifies catalogue reviews as illustrative, but the homepage does not qualify these
badges. Label this section as sample content or remove verified-purchase claims until actual
review verification exists. No backend implementation is needed to correct preview copy.

## Additional risks and maintenance observations

- src/components/storefront/home.tsx:204 disables purchasing only at quantity 10, without
  checking product.available. Current featured/best-seller arrays contain available items,
  so this is a latent bug if an item sells out or the selection changes, not a reproduced
  current out-of-stock purchase through the homepage.
- State persistence has no schema validation/migration or catalogue reconciliation.
  Invalid/stale saved IDs can disagree with header counts; stock changes are not reconciled
  in bag/checkout. Treat this as frontend robustness work, not a live-payment security claim.
- Two ProductCard implementations already differ in stock/quantity handling and success UX.
  The active navbar is components/storefront/header.tsx; components/layout/navbar.tsx is
  legacy. Consolidate shared purchase rules and retire unused components deliberately.
- Global tokens are redefined in storefront.css; legacy selectors and repeated responsive
  overrides remain across home.css, responsive.css and storefront.css. This increases
  maintenance and regression risk. Preserve approved refinements while consolidating.
- Logo background is hidden with an SVG alpha filter; the saved PNG remains opaque.
  The filter affects dark artwork pixels as well as the background. A faithful transparent
  source asset remains preferable when available. Favicon still renders the letter T.
- StructuredData exists but has no consumers. Product routes currently emit no JSON-LD.
- Search overlay checks name/category, while the results page also checks material, so
  suggestions and submitted results can disagree for material searches.
- Checkout success state is not reset when valid submitted details are edited afterward.
- New Launch aspect ratio/gutters and homepage section order differ from existing requirements.
  These may reflect intentional recent edits; confirm the intended baseline before changing them.

## Verification performed

- npm.cmd run lint: exit 0, two warnings (unused ArrowLeft and SectionHeading in existing-sections.tsx).
- npx.cmd tsc --noEmit --incremental false: passed.
- verify-storefront.mjs: failed on product count (expected 4, actual 8).
- verify-new-launch.mjs: failed on section adjacency.
- Headless Edge: search parameter error, empty CZ listing, populated 320px cart/product/drawer
  overflow, quantity-limit success mismatch and account/product tab behavior reproduced.
- Checkout at 320px: no horizontal page overflow in the populated case checked.
- Mobile reviews: all four reachable through Next; last button correctly disables at 390px.
- No broken loaded homepage images in the sampled browser check.

No production build was rerun during this review. The preceding task's successful build
is not evidence that the current working tree passes all behavioral checks.
