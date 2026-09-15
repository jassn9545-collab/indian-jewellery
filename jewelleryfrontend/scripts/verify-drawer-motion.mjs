import { chromium, expect } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const base = process.env.STOREFRONT_URL || "http://localhost:3000";
const out = "artifacts/drawer-motion";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage();
const errors = [];
const results = [];
page.on("pageerror", (error) => errors.push(error.message));

async function geometry() {
  return page.evaluate(() => {
    const logo = document
      .querySelector("header .sf-logo")
      .getBoundingClientRect();
    const main = document.querySelector("main").getBoundingClientRect();
    return {
      x: logo.x,
      width: main.width,
      scroll: scrollY,
      scale: visualViewport.scale,
    };
  });
}
async function assertSlide(side) {
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const animation = await dialog.evaluate((element) => {
    const enter = element
      .getAnimations()
      .find((a) => a.animationName === "drawer-enter");
    const frames = enter?.effect.getKeyframes();
    return {
      frames: frames?.map((f) => f.transform),
      direction: getComputedStyle(element)
        .getPropertyValue("--drawer-offset")
        .trim(),
      blur: getComputedStyle(element, "::backdrop").backdropFilter,
    };
  });
  expect(animation.direction).toBe(side === "left" ? "-100%" : "100%");
  expect(animation.blur).toBe("none");
  expect(animation.frames?.length).toBe(2);
  await page.waitForTimeout(350);
  expect(
    await dialog.evaluate(
      (e) => new DOMMatrixReadOnly(getComputedStyle(e).transform).m41,
    ),
  ).toBe(0);
  return dialog;
}
async function closeDrawer() {
  await page.getByRole("button", { name: "Close dialog" }).click();
  // The dialog remains mounted during its exit instead of disappearing on click.
  await expect(page.locator("dialog.is-closing")).toHaveCount(1);
  await expect(page.getByRole("dialog")).toHaveCount(0);
}
try {
  for (const width of [320, 390, 768, 1024, 1120, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base + "/collections/new-in", { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.removeItem("techglock-shop"));
    await page.reload({ waitUntil: "networkidle" });
    const alignment = await page.evaluate(() => {
      const header = document
        .querySelector("header .sf-logo")
        .getBoundingClientRect();
      const footer = document
        .querySelector("footer .sf-logo")
        .getBoundingClientRect();
      const children = [...document.querySelector(".sf-nav-inner").children]
        .map((e) => e.getBoundingClientRect())
        .filter((r) => r.width > 0);
      return {
        x: header.x - footer.x,
        width: header.width - footer.width,
        overlap: children.some(
          (r, i) => i && children[i - 1].right > r.left + 1,
        ),
      };
    });
    expect(Math.abs(alignment.x), `Logo alignment at ${width}`).toBeLessThan(1);
    expect(alignment.width).toBe(0);
    expect(alignment.overlap).toBe(false);
    if (width <= 1100)
      await expect(
        page.getByRole("link", { name: "Login or sign up", exact: true }),
      ).toBeVisible();
    else
      await expect(
        page.getByRole("link", { name: "Account", exact: true }),
      ).toBeVisible();
    const add = page
      .getByRole("button", { name: "Add to cart", exact: true })
      .first();
    await add.scrollIntoViewIfNeeded();
    const before = await geometry();
    await add.click();
    await assertSlide("right");
    expect(await geometry()).toEqual(before);
    await page.screenshot({ path: `${out}/cart-${width}.png` });
    await closeDrawer();
    expect(await geometry()).toEqual(before);
    if (width < 768) {
      await page.getByRole("button", { name: "Filter", exact: true }).click();
      const dialog = await assertSlide("left");
      await dialog.getByRole("checkbox", { name: "In stock only" }).check();
      await expect(
        dialog.getByRole("button", { name: /Show .* pieces/ }),
      ).toBeInViewport();
      await page.screenshot({ path: `${out}/filter-${width}.png` });
      await dialog.getByRole("button", { name: /Show .* pieces/ }).click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    results.push({ width, alignment, stationaryPage: true });
    console.log(
      `PASS ${width}: matching logos, account access, slide direction, close animation, stationary page`,
    );
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: /Open shopping bag/ }).click();
  await assertSlide("right");
  await page.getByRole("link", { name: "Proceed to checkout" }).click();
  await page.waitForURL("**/checkout");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  for (const [name, value] of Object.entries({
    name: "Test Customer",
    email: "test@example.com",
    phone: "9876543210",
    address: "123 Test Street",
    city: "Jaipur",
    state: "Rajasthan",
    pin: "302001",
  })) {
    await page.locator(`main input[name="${name}"]`).fill(value);
  }
  await page.getByRole("button", { name: "Preview Razorpay payment" }).click();
  await assertSlide("right");
  await page.screenshot({ path: `${out}/checkout-390.png` });
  await page.getByRole("button", { name: "Back to checkout" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await assertSlide("left");
  await page
    .getByRole("button", { name: "Search jewellery", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveAttribute(
    "aria-label",
    "Find your next favourite",
  );
  await assertSlide("right");
  await page
    .getByRole("textbox", { name: "Search jewellery", exact: true })
    .fill("pearl");
  await page.getByRole("button", { name: "View search results" }).click();
  await page.waitForURL("**/search?q=pearl");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("link", { name: "Login or sign up", exact: true })
    .click();
  await page.waitForURL("**/login");
  await page.goBack();
  await expect(page).toHaveURL(/\/search\?q=pearl$/);
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: /Open shopping bag/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(
    await page.evaluate(() => document.documentElement.style.overflow),
  ).toBe("");
  expect(errors).toEqual([]);
  writeFileSync(
    `${out}/results.json`,
    JSON.stringify(
      {
        results,
        errors,
        checkout: true,
        search: true,
        account: true,
        back: true,
        reducedMotion: true,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS checkout, menu-to-search, query navigation, account, browser Back and reduced motion",
  );
} finally {
  await browser.close();
}
