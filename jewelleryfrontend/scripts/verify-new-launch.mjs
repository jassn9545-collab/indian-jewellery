import { chromium, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = process.env.STOREFRONT_URL || "http://localhost:3000";
mkdirSync("artifacts", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  for (const width of [1440, 1280, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base, { waitUntil: "networkidle" });
    const section = page.getByRole("region", {
      name: "NEW LAUNCH",
      exact: true,
    });
    const viewport = section.getByRole("group");
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator("article")).toHaveCount(4);
    await expect(section.locator("img")).toHaveCount(4);
    const layout = await section.evaluate((element) => {
      const viewport = element.querySelector('[role="group"]');
      const bounds = viewport.getBoundingClientRect();
      const cards = [...viewport.querySelectorAll("article")].map((x) =>
        x.getBoundingClientRect(),
      );
      const full = cards.filter(
        (r) => r.left >= bounds.left - 1 && r.right <= bounds.right + 1,
      );
      const partial = cards.some(
        (r) => r.left < bounds.right && r.right > bounds.right + 1,
      );
      const gaps = cards.slice(1).map((r, i) => r.left - cards[i].right);
      return {
        full: full.length,
        partial,
        gaps,
        overflow: document.documentElement.scrollWidth > innerWidth,
        followsBrand:
          element.previousElementSibling.classList.contains("sf-local-brand"),
        precedesFeatured:
          element.nextElementSibling.classList.contains("sf-featured"),
        matchingHeights:
          Math.max(...cards.map((r) => r.height)) -
            Math.min(...cards.map((r) => r.height)) <
          1,
      };
    });
    expect(layout.full).toBe(width >= 1024 ? 3 : width >= 768 ? 2 : 1);
    expect(layout.partial).toBe(true);
    expect(layout.overflow).toBe(false);
    expect(
      layout.followsBrand && layout.precedesFeatured && layout.matchingHeights,
    ).toBe(true);
    expect(Math.max(...layout.gaps) - Math.min(...layout.gaps)).toBeLessThan(1);
    await expect
      .poll(() =>
        section
          .locator("img")
          .evaluateAll((images) =>
            images.every((i) => i.complete && i.naturalWidth > 0),
          ),
      )
      .toBe(true);
    await section.screenshot({ path: `artifacts/new-launch-${width}.png` });

    const offset = () => viewport.evaluate((e) => e.scrollLeft);
    await section
      .getByRole("button", { name: "Next new launch collection" })
      .click();
    await expect.poll(offset).toBeGreaterThan(20);
    await page.waitForTimeout(500);
    await section
      .getByRole("button", { name: "Previous new launch collection" })
      .click();
    await expect.poll(offset).toBeLessThan(2);
    await viewport.focus();
    await page.keyboard.press("End");
    await expect
      .poll(() =>
        viewport.evaluate((e) =>
          Math.abs(e.scrollLeft - (e.scrollWidth - e.clientWidth)),
        ),
      )
      .toBeLessThan(2);
    await section
      .getByRole("button", { name: "Next new launch collection" })
      .click();
    await expect.poll(offset).toBeLessThan(2);
    await viewport.focus();
    await page.keyboard.press("ArrowRight");
    await expect.poll(offset).toBeGreaterThan(20);
    await page.waitForTimeout(500);
    await page.keyboard.press("Home");
    await expect.poll(offset).toBeLessThan(2);

    const bounds = await viewport.boundingBox();
    await page.mouse.move(
      bounds.x + bounds.width * 0.7,
      bounds.y + bounds.height * 0.35,
    );
    await page.mouse.down();
    await page.mouse.move(
      bounds.x + bounds.width * 0.15,
      bounds.y + bounds.height * 0.35,
      { steps: 12 },
    );
    await page.mouse.up();
    await expect.poll(offset).toBeGreaterThan(20);
    expect(new URL(page.url()).pathname).toBe("/");
    console.log(
      `PASS ${width}px: full/partial cards, equal gaps, arrows, rewind, keyboard and drag`,
    );
  }

  await page.emulateMedia({ reducedMotion: "reduce" });
  const section = page.getByRole("region", { name: "NEW LAUNCH", exact: true });
  const viewport = section.getByRole("group");
  await viewport.focus();
  await page.keyboard.press("Home");
  expect(await viewport.evaluate((e) => e.scrollLeft)).toBeLessThan(2);
  await section
    .getByRole("button", { name: "Next new launch collection" })
    .click();
  expect(await viewport.evaluate((e) => e.scrollLeft)).toBeGreaterThan(20);

  const links = await section
    .locator("a")
    .evaluateAll((anchors) => anchors.map((a) => a.getAttribute("href")));
  for (const link of links)
    expect((await page.request.get(base + link)).status()).toBe(200);
  await viewport.focus();
  await page.keyboard.press("Home");
  await section
    .getByRole("link", { name: "SHOP NOW: Pillars of Time" })
    .click();
  await expect(page).toHaveURL(/category\/necklaces$/);
  expect(errors).toEqual([]);

  const touchPage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await touchPage.goto(base, { waitUntil: "networkidle" });
  const touchViewport = touchPage
    .getByRole("region", { name: "NEW LAUNCH", exact: true })
    .getByRole("group");
  await touchViewport.scrollIntoViewIfNeeded();
  const bounds = await touchViewport.boundingBox();
  const session = await touchPage.context().newCDPSession(touchPage);
  const y = Math.round(bounds.y + bounds.height * 0.4);
  const start = Math.round(bounds.x + bounds.width * 0.8);
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: start, y }],
  });
  for (let step = 1; step <= 10; step++) {
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: start - step * 24, y }],
    });
    await touchPage.waitForTimeout(20);
  }
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect
    .poll(() => touchViewport.evaluate((e) => e.scrollLeft))
    .toBeGreaterThan(20);
  await touchPage.close();
  console.log(
    "PASS reduced motion, CTA destinations, native touch swipe and no runtime errors",
  );
} finally {
  await browser.close();
}
