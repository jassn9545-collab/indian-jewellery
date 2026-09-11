# Indian Jewellery storefront

The approved homepage is implemented in Next.js and TypeScript using existing dependencies. Components live in src/components/storefront; navigation, hero and category data live in src/lib/storefront.ts. Styles are in src/app/storefront.css and override the legacy shared palette where necessary.

Homepage order: rotating announcement, sticky navigation with mega menus, three-photo hero carousel, category row without a visible heading, four-item craftsmanship strip, featured products. Existing assurance, arrivals, craft, style, silver, bestseller, trending-look and review sections remain below the updated sections. The shared footer and newsletter are preserved.

Both carousels advance every four seconds and pause for hover, keyboard focus, hidden tabs, and reduced-motion preferences. Announcement offers can also be changed with arrow keys. Hero dots select slides manually. Hero height subtracts measured ribbon/navigation heights from the viewport.

Fonts: Cormorant Garamond 400/500/600 and Inter 400/500/600 via next/font. New hero images are optimized local WebP copies of the two supplied images. Watch, bag and hair-accessory thumbnails use the supplied category reference locally. No remote image host is required by the new homepage.

Cart and wishlist reuse the existing persisted Zustand store and retain product IDs. Featured product prices and names match the approved brief. Search and the bag reuse existing frontend functionality.

Category and campaign routes reuse the full existing collection browser. Product links reuse the original full product-detail page. Categories with no catalog inventory show the collection browser empty state. Existing collection, cart, wishlist, search and other routes remain available. Backend work is out of scope.

Verification: npm run lint; npx tsc --noEmit; npm run build; node scripts/verify-storefront.mjs. The browser script uses installed Microsoft Edge, checks navigation and shopping interactions, tests viewport fit, and saves screenshots under ignored artifacts/.
