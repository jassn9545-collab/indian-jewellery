<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Jewellery frontend project rules

- Read `../requirements/requirements.txt` for website scope and project setup.
- Follow `../design-system/design-system.md` and `../typography/typography.md` for new UI.
- Preserve explicitly approved section refinements; do not globally restyle existing pages.
- Reuse local imagery, existing components, font configuration and dependencies.
- Backend and admin implementation remain out of scope until explicitly requested.
- Validate functional changes with lint, TypeScript and appropriate browser checks;
  `scripts/verify-new-launch.mjs` covers the New Launch carousel.
