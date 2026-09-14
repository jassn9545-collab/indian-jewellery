import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 320, height: 900 } });
const base = process.env.STOREFRONT_URL || "http://localhost:3000";
try {
  await page.goto(base + "/search?q=ring&q=pearl");
  await expect(
    page.getByRole("heading", { name: "Find your next favourite" }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Search jewellery", exact: true }),
  ).toHaveValue("ring");
  await page.goto(base + "/collections/cz");
  await expect(page.locator(".sf-product")).toHaveCount(2);
  await page.evaluate(() =>
    localStorage.setItem(
      "techglock-shop",
      JSON.stringify({
        state: {
          bag: [{ id: "emerald-drop-earrings", quantity: 10 }],
          wishlist: [],
        },
        version: 0,
      }),
    ),
  );
  await page.goto(base + "/products/emerald-drop-earrings");
  await expect(
    page.getByRole("button", { name: "Maximum added" }),
  ).toBeDisabled();
  for (const route of ["/products/emerald-drop-earrings", "/cart"]) {
    await page.goto(base + route);
    await expect(page.locator(".detail-copy, .bag-item").first()).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page
    .getByRole("button", { name: "Open shopping bag, 10 items", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((e) => e.scrollWidth <= e.clientWidth)).toBe(
    true,
  );
  console.log(
    "PASS repeated search, CZ collection, cart limit and populated 320px layouts",
  );
} finally {
  await browser.close();
}
