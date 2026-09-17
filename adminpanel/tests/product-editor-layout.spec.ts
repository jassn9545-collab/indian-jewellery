import { test, expect } from "@playwright/test";
import { seedDatabase } from "../src/lib/admin-data";
test("product editor retains fields in compact responsive layout", async ({
  page,
}) => {
  await page.route("**/admin-api/**", (route) =>
    route.fulfill({
      json: route.request().url().endsWith("/session")
        ? { name: "Admin", email: "admin@example.test" }
        : {
            catalog: seedDatabase(),
            commerce: { version: 1, orders: [], customers: [], returns: [] },
            revision: 0,
          },
    }),
  );
  await page.goto("/admin/products/add");
  await expect(
    page.getByRole("heading", { name: "Add product", exact: true }),
  ).toBeVisible();
  for (const label of [
    "Product name",
    "SKU",
    "Description",
    "Original price",
    "Sale price",
    "Stock",
    "Category",
    "Status",
  ])
    await expect(page.getByLabel(label, { exact: false })).toBeVisible();
  await expect(page.locator("input[type=file]")).toHaveCount(3);
  await page.getByLabel("Original price").fill("1000");
  await page.getByLabel("Sale price").fill("750");
  await expect(page.locator("output")).toHaveText("25%");
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    for (const upload of await page.locator(".upload-button").all()) {
      const box = await upload.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(110);
      expect(box!.height).toBeLessThanOrEqual(130);
    }
    if (width >= 1440)
      expect(
        await page.evaluate(
          () => document.documentElement.scrollHeight <= innerHeight,
        ),
      ).toBe(true);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({
    path: "test-results/add-product-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "test-results/add-product-mobile.png",
    fullPage: true,
  });
});
