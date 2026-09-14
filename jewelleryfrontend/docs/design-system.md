# Frontend design-system integration

The canonical rules are [Global Jewellery Design System](../../design-system/design-system.md).
Use [Typography](../../typography/typography.md) for type and
[Requirements](../../requirements/requirements.txt) for the application scope.

## Runtime mapping

- `src/app/layout.tsx`: Inter and Cormorant Garamond 400/500/600 via next/font.
- `src/app/tokens.css`: shared color, spacing, radius and motion variables.
- `src/app/globals.css`: shared elements; imports tokens, home and shop CSS.
- `src/app/responsive.css`: existing breakpoint adjustments.
- `src/app/storefront.css`: active emerald #0D3B2E, gold #C69C45 and ivory #FDFCF8
  palette overrides, homepage gutters and explicitly refined featured cards.
- `--color-surface` is white; `--color-surface-secondary` is warm beige.
- `src/components/storefront/new-launch.module.css`: scoped New Launch layout.
  Uses the existing `.button` and `.icon-button` primitives and semantic tokens.

Keep prior approved sections unchanged. New Launch has 4:5 image cards, overlaid serif
headings, emerald buttons, gold rules and 3/2/1 complete cards plus a partial next card.
Existing product cards retain their section-specific sizing and border decisions.

The base tokens contain a dark palette, but the active storefront has light overrides;
full dark-mode parity is not a completed feature. Sample catalog data and existing
AI-generated photography remain frontend preview content.
