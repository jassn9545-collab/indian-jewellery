# Indian Jewellery Frontend

Responsive Next.js 16 App Router storefront with TypeScript, Inter/Cormorant Garamond,
Tailwind/CSS Modules, Lucide, Zustand and React Hook Form/Zod. Backend work is out of scope.

## Setup

Use Node.js 24 LTS (validated with 24.21.0) and npm. From this directory:

```powershell
npm ci
npm run dev
```

Open http://localhost:3000. Alternate port: `npm run dev -- --port 3001`.
No API keys or database are required. Installation and a fresh next/font build need network access.

## Verify and build

```powershell
npm run lint
npx tsc --noEmit --incremental false
npm run build
```

`npm start` serves the production build. With a local server running:

```powershell
node scripts/verify-storefront.mjs
node scripts/verify-new-launch.mjs
```

Browser verification uses installed Microsoft Edge. Override the URL with `STOREFRONT_URL`.
Screenshots are written to ignored `artifacts/`. `scripts/verify.mjs` is a legacy smoke script.

## Documentation

- [Full website requirements and route inventory](../requirements/requirements.txt)
- [Global design system](../design-system/design-system.md)
- [Typography](../typography/typography.md)
- [Frontend token mapping](docs/design-system.md)
- [Homepage components and carousel behavior](docs/storefront-implementation.md)
- [Image provenance](docs/assets.md)

The new data-driven New Launch section follows the category row. Update its campaigns in
`src/lib/new-launch.ts`, or pass an items array to `NewLaunchSection`.

## Preview limitations

Catalog, prices and reviews are samples. Cart and wishlist persist only in this browser.
Checkout does not process payments or create orders. Account, delivery lookup and
newsletter require future backend integration. Do not store secrets in this frontend.
