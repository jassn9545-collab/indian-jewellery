# Admin design-system integration

The canonical specification is [Global Jewellery Design System](../design-system/design-system.md). The requested admin migration uses `src/app/design-system.css` for shared visual tokens and component styling, imported after structural `globals.css` rules.

- Reuse the existing local Inter and Cormorant Garamond files through the root layout; weights 400–600 only. Do not add another font import.
- Inter handles controls, product names, prices and IDs. Cormorant handles page and section headings.
- Use the existing emerald, gold, ivory, beige, success and error color variables. Status differences retain text labels; no blue badges.
- Use shared `--type-*`, `--space-*` and `--radius-*` tokens. Navigation is white with emerald active states. Buttons use uppercase 12px Inter and 20px radii.
- Tables scroll inside their panels. Detail cards reflow. Inputs remain 44px tall; mobile text inputs use 16px to avoid browser focus zoom.
- Preserve the persistent admin layout, backend repositories, data and existing interactions when adding visual changes.

Validation: `npm run typecheck`, `npx playwright test tests/admin-api.spec.ts tests/navigation.spec.ts tests/inventory-layout.spec.ts`. Local visual captures are stored under ignored `artifacts/design-system/`.
