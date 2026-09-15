# Commerce and motion review

## Implemented

- Header and footer logo use matching dimensions and horizontal alignment. Mobile login access sits beside the menu without overlapping the centered logo or cart controls.
- Filters and mobile navigation slide from the left. Cart, search, quick view and checkout preview slide from the right. Close controls and internal drawer links complete the exit animation before navigation.
- Stable scrollbar space, scroll-preserving dialog focus, 16px mobile form inputs and opacity-only route entry avoid page scaling and sideways shifts. Browser Back clears a navigation/cart drawer and releases its scroll lock.
- Collections offer exactly two desktop grid controls: four and five columns. Narrow layouts use responsive two/three-column layouts instead of squeezing five cards onto a phone.
- Product results append in batches of four near the scroll boundary. Images retain native lazy loading. A Load more button also works without IntersectionObserver. Filtering and sorting reset the visible batch; real catalog entries are never duplicated.
- `/signup` includes full name, email and password with name length, email format, minimum eight-character password and consent validation. Password visibility can be toggled; passwords are cleared after review and never persisted. `/login` retains its email flow. The review state normalizes the email and provides edit, login/signup and shopping links.
- Category, Gemstone, Material & purity, Occasion and Collection filters use accessible plus/minus accordion buttons. Only one group opens at a time on desktop and in the mobile drawer; selected filters remain applied when groups close.
- Razorpay preview includes subtotal, discount, delivery, total, contact email and interactive explanations for UPI, cards, netbanking and wallets. Checkout form validation still runs before opening the drawer.
- Existing local footer accordion and catalog refinements were preserved. New controls use the existing font configuration and design tokens.

## Service boundary

Signup/login validate the frontend form only; no account is created and no verification email is sent. The UI states this explicitly. Razorpay is an informational frontend preview, with no live SDK, charge, payment success or order creation. Live authentication and payments require separately configured backend services.

Payment information follows [Razorpay payment methods](https://razorpay.com/docs/payments/payment-methods/?preferred-country=IN). A live integration must follow [Standard Checkout integration steps](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/), including server-created orders and server-side payment verification.

## Reproduce checks

Final results: 666 page/viewport checks passed (111 routes at six widths), 136 route destinations returned successfully, and 25 additional menu routes passed mobile overflow checks. The 24 commerce layout/font cases, seven-width drawer/alignment checks, email validation, progressive loading, payment preview, browser Back, reduced motion, carousel regression, ESLint, TypeScript and production build also passed.

From `jewelleryfrontend/`, with the local server running:

```sh
npm run lint
npx tsc --noEmit --incremental false
npm run build
node scripts/verify-commerce.mjs
node scripts/verify-drawer-motion.mjs
node scripts/verify-responsive.mjs
node scripts/verify-route-links.mjs
node scripts/verify-new-launch.mjs
```

Browser scripts use installed Edge and accept `STOREFRONT_URL`. They check 320–1440px layouts, actual grid column counts, loaded font families, email/checkout validation, progressive loading, drawer directions and exit animations, stable page geometry, browser Back and route destinations. Physical phones/Safari are not part of this run.

## Screenshots

![Five-column collection](../artifacts/commerce/collections-five.png)

![Desktop signup](../artifacts/commerce/signup-desktop-panel.png)

![Mobile signup](../artifacts/commerce/signup-320.png)

![Razorpay preview](../artifacts/commerce/razorpay-320.png)

Screenshots and machine-readable results are local ignored artifacts under `artifacts/commerce/`, `artifacts/drawer-motion/` and `artifacts/responsive/`.
