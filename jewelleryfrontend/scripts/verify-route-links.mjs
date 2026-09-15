import { chromium, expect } from "@playwright/test";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";

const base = process.env.STOREFRONT_URL || "http://localhost:3000";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});
try {
  await page.goto(base);
  const homeLinks = await page
    .locator('a[href^="/"]')
    .evaluateAll((es) => es.map((e) => new URL(e.href).pathname));
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  const menuLinks = await page
    .locator('dialog a[href^="/"]')
    .evaluateAll((es) => es.map((e) => new URL(e.href).pathname));
  const staticRoutes = Object.keys(
    JSON.parse(readFileSync(".next/prerender-manifest.json", "utf8")).routes,
  ).filter((r) => !r.startsWith("/_") && r !== "/icon");
  const routes = [
    ...new Set([
      ...homeLinks,
      ...menuLinks,
      ...staticRoutes,
      "/search?q=pearl",
    ]),
  ];
  const responses = [];
  for (let i = 0; i < routes.length; i += 4) {
    const batch = await Promise.all(
      routes.slice(i, i + 4).map(async (route) => {
        const response = await page.request.get(base + route);
        const result = {
          route,
          status: response.status(),
          destination: new URL(response.url()).pathname,
        };
        await response.dispose();
        return result;
      }),
    );
    for (const result of batch) expect(result.status, result.route).toBe(200);
    responses.push(...batch);
  }
  const additional = menuLinks.filter(
    (route) => !homeLinks.includes(route) && !staticRoutes.includes(route),
  );
  await page.setViewportSize({ width: 320, height: 800 });
  for (const route of new Set(additional)) {
    await page.goto(base + route, { waitUntil: "load" });
    await expect(
      page.locator('main:not([aria-label="Loading jewellery"])'),
    ).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route,
    ).toBe(true);
  }
  mkdirSync("artifacts/drawer-motion", { recursive: true });
  writeFileSync(
    "artifacts/drawer-motion/routes.json",
    JSON.stringify(responses, null, 2),
  );
  console.log(
    `PASS ${routes.length} route destinations and ${new Set(additional).size} additional menu routes at 320px`,
  );
} finally {
  await browser.close();
}
