# TECHGLOCK Jewellery Frontend

Responsive Next.js App Router storefront using TypeScript, Tailwind CSS, semantic CSS variables, Lucide, Zustand, React Hook Form and Zod.

## Run

```powershell
npm install
npm run dev
```

Open http://localhost:3000. Use a different port when needed: npm run dev -- --port 3001.

## Verify

```powershell
npm run lint
npm run build
node scripts/verify.mjs
```

The browser smoke check uses installed Microsoft Edge in headless mode. Run the dev server first. It covers responsive overflow, search, wishlist, persistent bag, coupon, themes, collection filtering, sorting, product zoom, unavailable products and form validation. Screenshots are written to artifacts/ and ignored by Git.

## Routes

- /: full editorial storefront.
- /collections/[slug]: filters, sorting and product discovery.
- /products/[slug]: gallery, quantity, wishlist and product information.
- /search, /wishlist, /cart: shopping workflows.
- /checkout, /account: frontend previews.
- /help/[slug], /about/[slug]: supporting content.

## Scope

Application work is contained in jewelleryfrontend. Backend and adminpanel are untouched.

Products, ratings, reviews and prices are sample content. Eight original AI-generated images are stored locally. See docs/assets.md for prompts and docs/design-system.md for the design rules.

Checkout does not process payments or create orders. Forms do not submit personal information. Newsletter signup, account authentication and shipping availability require future backend integration. Cart, wishlist and theme preferences are stored in the current browser.
