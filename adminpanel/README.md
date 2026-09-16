# Jewellery Admin Panel

Standalone frontend using Next.js App Router, TypeScript, and Tailwind CSS.

## Development

```sh
cd adminpanel
npm install
npm run dev
```

Open http://localhost:3001. On Windows PowerShell, use `npm.cmd` if script execution is restricted.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
```

Use `npm start` to serve the production build on port 3001.

Open `/admin/signup` to create a local preview account, then sign in at `/admin/login`.
No default credentials are shipped. Unauthenticated admin screens redirect to login.

## Features

- Fixed desktop sidebar, route-aware selection (including add/edit routes), desktop collapse and mobile/tablet navigation drawer.
- Dashboard charts computed from catalog records: category counts, stock distribution and homepage placements.
- Products, Categories, Ribbon Bar, Local Brand, New Launch, Royally Crafted, Shop By Style, Pure Silver, Best Sellers, Trending Looks and Customer Reviews.
- Add/edit forms, search, relevant filters, pagination, previews, status toggles and confirmation before deletion or logout.
- Successful saves show a toast and return to the module list.
- Product references resolve from one admin catalog; category product views cannot escape their selected category.
- Actual local file storage through IndexedDB, image preview/replacement/removal, gallery ordering and MP4/WebM preview. Images accept JPG/PNG/WEBP up to 5 MB; videos up to 30 MB.

## Data and production integration

This is a **frontend preview**, not a production admin security boundary. The repository has no implemented backend/API, and the storefront currently uses a static sample catalog.

`src/lib/storage.ts` separates catalog persistence, media uploads and authentication from UI. Catalog and media persist in IndexedDB. Demo accounts use salted PBKDF2 password hashes; the session is browser-local and can be manipulated by the browser owner. Before production, replace this adapter with authenticated API calls, secure server-managed sessions and server-side role checks. Public signup must not grant administrator access in a live deployment.

`src/lib/catalog-seed.json` is a snapshot of the existing storefront catalog with original product IDs preserved. The admin normalizes category IDs and adds preview SKU/stock fields. Other sections store product references, not copied prices or product details. Referenced products/categories cannot be deleted until their placements are removed.

**Admin changes do not publish to the customer-facing website yet.** Shared live synchronization requires a backend API and replacing the storefront's static data imports with that same API. No storefront or backend implementation was changed in this task. Local changes are scoped to this browser and origin; clearing site data removes them. Avoid editing the same catalog simultaneously in multiple tabs.

Production adapter contract: implement authenticated GET/POST/PATCH/DELETE for `/products`, `/categories`, `/ribbons`, `/local-brand`, `/new-launch`, `/royally-crafted`, `/shop-by-style`, `/pure-silver`, `/best-sellers`, `/trending-looks` and `/reviews`. Use paginated/filterable GET endpoints instead of loading the demo database wholesale. Upload endpoints should return durable asset IDs/URLs and enforce type/size validation on the server. The current `media:` references are local blob identifiers, not public URLs. Removed/replaced preview uploads remain in browser storage until site data is cleared; add asset garbage collection with a production media service.

## Source map

- `src/components/admin-app.tsx`: session gate, sidebar/header, route dispatch and notifications.
- `src/components/dashboard.tsx`: live catalog summaries and charts.
- `src/components/entry-list.tsx`, `entry-form.tsx`, `ui.tsx`: reusable module management and controls.
- `src/lib/admin-data.ts`: module definitions, normalized data, relationship validation and seed mapping.
- `src/app/globals.css`: tokens from `../design-system/design-system.md` and responsive admin styling.

Brand/product images are reused from the storefront. Inter and Cormorant Garamond Latin font files are reused from its existing Next.js font output and served locally to avoid build-time font downloads. The original catalog and assets remain untouched.

## Browser verification

```sh
npm run test:e2e
```

Tests use installed Microsoft Edge through Playwright on this Windows workspace. For other environments, change the browser channel in `playwright.config.ts` or install the corresponding browser. Coverage includes session redirects, login/logout, all module navigation, product CRUD, image persistence, linked-product deletion rules, category isolation, content/review forms and mobile layout.

## Connected admin (2026-09-16)

The current application uses the Express/MySQL backend, superseding the browser-storage preview described above. Follow [backend setup](../backend/ADMIN-SETUP.md) before signing in. No public administrator signup or automatic sample-data import is enabled. Inventory, analytics and settings are now connected screens. Use `npx playwright test tests/admin-api.spec.ts` for the API-contract browser checks; the older preview tests need migration before use with this backend.
