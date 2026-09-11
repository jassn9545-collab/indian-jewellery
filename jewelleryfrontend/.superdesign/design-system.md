# TECHGLOCK Frontend Design System

The storefront follows the supplied TECHGLOCK brief. Voylla was reviewed only for category navigation and product discovery; its branding, copy and images are not used.

## Foundations

- Tokens: src/app/tokens.css, with semantic light and dark palettes.
- Primary action: deep emerald #063B2E; hover #04291F.
- Accent: champagne gold #C9A66B, reserved for premium badges.
- Surfaces: ivory #F7F4EE, warm white #FBF9F5 and white.
- Display: Cormorant Garamond 500/600/700.
- Interface: IBM Plex Sans 400/500/600/700.
- Fonts are self-hosted by next/font.
- Spacing tokens use the supplied 4px scale.
- Content maximum: 1280px. Breakpoints: 768, 1024 and 1280px.
- Product images: 4:5. Product grids: 4 desktop, 3 tablet, 2 mobile.
- Buttons: 20px radius. Cards: 4px radius.

## Design Principles

1. Luxury through restraint: whitespace, typography and photography.
2. One accent per component: emerald actions and restrained premium gold.
3. Editorial typography: serif headings with practical sans-serif interfaces.
4. Product photography first: natural exposure in both themes.

## Implementation

Homepage and route shells are server components. Client components handle search, filters, local shopping state, forms, galleries, dialogs and appearance.

Native dialog provides modal focus containment, Escape handling and focus restoration. Labels, focus states, reduced-motion support and responsive layouts are included.

CSS files are divided into tokens, shared layout, homepage, shopping surfaces and responsive rules. Reusable components live under src/components.

## Preview Content

Products, prices, ratings and customer quotes are sample content. Photography is AI-generated. Material claims, shipping policies and reviews must be replaced or verified before launch. No review structured data is emitted.

Cart and wishlist persist locally through Zustand. No personal form data is sent to a server. Account, newsletter, pincode and checkout screens clearly describe unavailable backend actions.
