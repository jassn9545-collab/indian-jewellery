import { chromium, expect } from "@playwright/test";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const base = process.env.STOREFRONT_URL || "http://localhost:3000";
const directory = "artifacts/responsive";
mkdirSync(directory, { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ reducedMotion: "reduce" });
const results = [];
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  await page.goto(base);
  const links = await page
    .locator('a[href^="/"]')
    .evaluateAll((elements) => elements.map((e) => new URL(e.href).pathname));
  const manifestPath = ".next/prerender-manifest.json";
  const staticRoutes = existsSync(manifestPath)
    ? Object.keys(JSON.parse(readFileSync(manifestPath, "utf8")).routes).filter(
        (route) => !route.startsWith("/_") && route !== "/icon",
      )
    : [];
  const routes = [
    ...new Set([
      "/",
      ...links,
      ...staticRoutes,
      "/category",
      "/product",
      "/products/emerald-drop-earrings",
      "/checkout",
      "/account",
      "/cart",
      "/wishlist",
      "/search?q=pearl",
      "/precious/lab-grown-diamonds",
    ]),
  ];
  for (const width of [320, 390, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(base + route, { waitUntil: "load", timeout: 60000 });
      await expect(
        page.locator('main:not([aria-label="Loading jewellery"])'),
      ).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      );
      expect(overflow, `${route} at ${width}px`).toBeLessThanOrEqual(1);
      await expect(page.locator("header .sf-logo img")).toBeVisible();
      await expect(page.locator("footer .sf-logo img")).toBeVisible();
      const clipped = await page
        .locator(
          "main h1, main .sf-product-name, main .sf-product-price, main .sf-button",
        )
        .evaluateAll((elements) =>
          elements
            .filter(
              (e) =>
                e.scrollWidth > e.clientWidth + 1 ||
                (getComputedStyle(e).overflowY !== "visible" &&
                  e.scrollHeight > e.clientHeight + 1),
            )
            .map((e) => e.textContent),
        );
      expect(clipped, `Clipped content ${route} at ${width}px`).toEqual([]);
      results.push({ route, width, overflow });
    }
    console.log(`PASS ${routes.length} routes at ${width}px`);
  }
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto(base + "/collections/new-in");
  await page.screenshot({ path: `${directory}/after-new-arrivals.png` });
  await page.getByRole("button", { name: "Filter", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: /Show .* pieces/ }),
  ).toBeInViewport();
  await dialog.getByRole("checkbox", { name: "In stock only" }).check();
  await expect(
    dialog.getByRole("button", { name: "Close dialog" }),
  ).toBeInViewport();
  await expect(
    dialog.getByRole("button", { name: /Show .* pieces/ }),
  ).toBeInViewport();
  expect(await dialog.evaluate((e) => e.scrollWidth <= e.clientWidth)).toBe(
    true,
  );
  await page.screenshot({ path: `${directory}/after-filter.png` });
  await dialog.getByRole("button", { name: /Show .* pieces/ }).click();
  await expect(
    page.getByRole("button", { name: "Out of stock", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("button", { name: "Search jewellery", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.screenshot({ path: `${directory}/after-search.png` });
  await page.keyboard.press("Escape");
  await page.goto(base);
  await page
    .locator(".silver-section")
    .screenshot({ path: `${directory}/after-silver-320.png` });
  await page
    .locator("footer")
    .screenshot({ path: `${directory}/after-footer-320.png` });
  expect(errors).toEqual([]);
  writeFileSync(
    `${directory}/results.json`,
    JSON.stringify(
      {
        results,
        errors,
        interactions:
          "Filter, stock selection, fixed actions, mobile navigation, search, Escape",
      },
      null,
      2,
    ),
  );
  console.log(
    `PASS ${results.length} route/viewport checks and mobile interactions`,
  );
} finally {
  await browser.close();
}
