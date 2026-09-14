import { chromium, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
const base = process.env.STOREFRONT_URL || "http://localhost:3000";
mkdirSync("artifacts", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto(base, { waitUntil: "networkidle", timeout: 120000 });
  await expect(page.locator(".sf-hero-slide img")).toHaveCount(3);
  await expect(page.locator(".sf-category")).toHaveCount(10);
  await expect(page.locator(".sf-local-brand li")).toHaveCount(4);
  await expect(
    page.locator("[aria-labelledby=sf-featured-heading] .sf-product"),
  ).toHaveCount(4);
  await expect(page.locator("footer")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "SHOP BY STYLE", exact: false }),
  ).toHaveCount(1);
  await expect(page.locator(".silver-section")).toHaveCount(1);
  await expect(page.locator(".sf-looks-section")).toHaveCount(1);
  await expect(page.locator(".sf-reviews-section")).toHaveCount(1);
  await page.mouse.move(1, 1);
  const before = await page
    .locator(".sf-dots button[aria-pressed=true]")
    .getAttribute("aria-label");
  await expect
    .poll(
      () =>
        page
          .locator(".sf-dots button[aria-pressed=true]")
          .getAttribute("aria-label"),
      { timeout: 8000, intervals: [200] },
    )
    .not.toBe(before);
  await expect(page.locator(".sf-ribbon-message:not([inert])")).toHaveCount(1);
  await page.getByRole("button", { name: "Show slide 1", exact: true }).click();
  await page.waitForTimeout(800);
  await page.screenshot({
    path: "artifacts/storefront-desktop.png",
    fullPage: true,
  });
  await page
    .locator(".sf-desktop-nav")
    .getByRole("button", { name: "Women", exact: true })
    .hover();
  await expect(page.locator(".sf-mega")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".sf-mega")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Search jewellery", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Search jewellery", exact: true })
    .fill("pearl");
  await expect(page.locator(".sf-search-result").first()).toContainText(
    "Pearl",
  );
  await page.keyboard.press("Escape");
  const first = page.locator(".sf-product").first();
  await first.getByRole("button", { name: /Save .* to wishlist/ }).click();
  await first.getByRole("button", { name: "Add to cart", exact: true }).click();
  await expect(
    page.locator("[aria-labelledby=sf-featured-heading]").getByRole("status"),
  ).toHaveText("Added to cart");
  await page
    .getByRole("button", { name: "Open shopping bag, 1 items", exact: true })
    .click();
  await expect(page.locator(".bag-item")).toHaveCount(1);
  await expect(page.locator(".bag-item")).toContainText("2,499");
  await page.keyboard.press("Escape");
  await page.reload({ waitUntil: "networkidle" });
  await expect(
    page.getByRole("button", {
      name: "Open shopping bag, 1 items",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.locator(".sf-product").first().locator("[aria-pressed=true]"),
  ).toHaveCount(1);
  for (const [width, height] of [
    [1440, 900],
    [1366, 768],
    [1024, 768],
    [768, 1024],
    [390, 844],
    [320, 568],
    [844, 390],
  ]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(250);
    const result = await page.evaluate(() => {
      const hero = document.querySelector(".sf-hero").getBoundingClientRect();
      return {
        bottom: hero.bottom,
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    if (result.bottom > height + 1 || result.overflow)
      throw Error(
        "Viewport fit failed " +
          width +
          "x" +
          height +
          " " +
          JSON.stringify(result),
      );
    console.log("PASS viewport " + width + "x" + height);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Show slide 1", exact: true }).click();
  await page.waitForTimeout(800);
  await page.screenshot({
    path: "artifacts/storefront-mobile.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await page
    .locator(".sf-mobile-nav summary")
    .filter({ hasText: "Women" })
    .click();
  await expect(page.locator(".sf-mobile-nav details[open]")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.locator(".sf-category").first().click();
  await expect(page.locator("main h1")).toHaveText("Rings");
  await page.getByRole("link", { name: "Indian Jewellery home" }).click();
  for (const route of [
    "/best-sellers",
    "/wedding",
    "/collections",
    "/collections/new-launch",
    "/precious/lab-grown-diamonds",
    "/category/watches",
    "/category/hair-accessories",
    "/category/bags",
    "/product/emerald-drop-earrings",
  ]) {
    const response = await page.request.get(base + route);
    if (response.status() !== 200)
      throw Error("Route failed " + route + " " + response.status());
  }
  await page.goto(base, { waitUntil: "networkidle" });
  await page
    .locator("[aria-labelledby=sf-featured-heading]")
    .scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const broken = await page
    .locator(".sf-home img")
    .evaluateAll((images) =>
      images.filter((i) => i.complete && !i.naturalWidth).map((i) => i.src),
    );
  if (broken.length) throw Error("Broken images: " + broken.join(","));
  if (errors.length) throw Error(errors.join("\n"));
  console.log(
    "PASS autoplay, menus, search, cart/wishlist persistence, routes and image loading.",
  );
} finally {
  await browser.close();
}
