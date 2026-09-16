# Indian Jewellery Typography

Canonical typography guide. Use with [the design system](../design-system/design-system.md).

## Font setup

`jewelleryfrontend/src/app/layout.tsx` loads Inter and Cormorant Garamond using
`next/font/google`, with Latin subsets, weights 400/500/600 and `display: swap`.
The font variables are attached to the root HTML element. Next.js serves the generated
font assets locally; a fresh build may need network access to fetch Google Fonts.
Do not import fonts again, install another font family, or request unavailable weights.

| Role | CSS family | Weights |
| --- | --- | --- |
| Display, brand, hero, editorial and section headings | `var(--font-display), serif` | 400, 500, 600 |
| Body, navigation, controls, product names, prices, forms | `var(--font-body), sans-serif` | 400, 500, 600 |

## Type hierarchy for new UI

| Element | Desktop | Mobile | Weight / leading |
| --- | --- | --- | --- |
| Hero heading | 52?64px | 30?38px | 500 / 1.05?1.15 |
| Editorial heading | 36?52px | 30?38px | 500 / 1.1 |
| Section heading | 28?36px | 28?32px | 500 / 1.2 |
| Body / description | 14?16px | 14px | 400 / 1.5?1.65 |
| Navigation | 12?13px | 12?13px | 500 / 1.5 |
| Product title | 14?15px | 13?14px | 500 / 22px |
| Price | 14?16px | 14px | 600 / 22px |
| Button | 11?12px | 11px | 600 / 1.3 |
| Eyebrow / label | 11?12px | 11px | 600 / 1.5 |
| Supporting text | 12?13px | 12px | 400 / 1.5 |
| Badge | 10?11px | 10px | 600 / 1.3 |

Existing approved small-screen sizes are retained; this table is not a request to
resize every existing component. Avoid shrinking long copy simply to make it fit.

## New Launch

- NEW LAUNCH: Cormorant Garamond 500, `clamp(28px, 2.5vw, 36px)`, line-height 1.2.
- Card titles: Cormorant Garamond 500, `clamp(30px, 2.6vw, 40px)`; mobile 32px,
  line-height 1.05, consistent bottom alignment and room for two lines.
- SHOP NOW: Inter 600, 11px, uppercase, 0.05em tracking; minimum 44px touch target.
- Light title text sits over a subtle emerald gradient; CTA text uses the white token.

## Usage and accessibility

Use one page h1, h2 for sections, and h3 for card titles. Do not choose a heading level
for its size. Body text uses Inter, never the display serif. Use semantic colors for
text, visible keyboard focus, and meaningful labels. Buttons must remain readable
without hover. Support browser zoom and reduced motion. Avoid fixed-height text boxes
that clip longer content. Use uppercase and tracking for short labels, not body copy.

CSS entry points: `src/app/globals.css`, `src/app/storefront.css`, and the scoped
`src/components/storefront/new-launch.module.css`. No duplicate font setup is needed.

## Admin compact layout (2026-09-16)

The admin application retains its existing local Inter and Cormorant Garamond font files.
Use Cormorant Garamond 600 for page headings: 32px desktop and 28px mobile.
Use Inter for forms, stock numbers, table cells, navigation and actions. Summary values are
28px desktop and 24px mobile; supporting summary text is at least 11px.
Reduce unused spacing with 12px/16px gaps and 16px panel padding, rather than reducing
body readability or clipping content. Keep responsive reflow, visible focus and mobile targets.
This exception applies to adminpanel only; storefront typography is unchanged.
