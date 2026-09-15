import { chromium, expect } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const base = process.env.STOREFRONT_URL || "http://localhost:3000";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ reducedMotion: "reduce" });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const out = "artifacts/commerce";
mkdirSync(out, { recursive: true });
const checks = [];
try {
  for (const width of [320, 390, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/collections", "/signup", "/login", "/account"]) {
      await page.goto(base + route, { waitUntil: "load" });
      await expect(
        page.locator('main:not([aria-label="Loading jewellery"])'),
      ).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} at ${width}`,
      ).toBe(true);
      const fonts = await page.evaluate(() => ({
        body: getComputedStyle(document.body).fontFamily,
        heading: getComputedStyle(document.querySelector("main h1")).fontFamily,
        loaded: document.fonts.status,
      }));
      expect(fonts.body).toMatch(/Inter/i);
      expect(fonts.heading).toMatch(/Cormorant/i);
      expect(fonts.loaded).toBe("loaded");
      checks.push({ route, width, fonts });
      if (route === "/collections" && width >= 1280) {
        await expect(
          page
            .getByRole("group", { name: "Product grid layout" })
            .getByRole("button"),
        ).toHaveCount(2);
        for (const count of [5, 4]) {
          await page
            .getByRole("button", { name: `${count} columns`, exact: true })
            .click();
          await expect(
            page.getByRole("button", { name: `${count} columns`, exact: true }),
          ).toHaveAttribute("aria-pressed", "true");
          expect(
            await page
              .locator(".listing-grid")
              .evaluate(
                (e) =>
                  getComputedStyle(e).gridTemplateColumns.split(" ").length,
              ),
          ).toBe(count);
        }
      }
      if (route === "/signup" && [320, 1440].includes(width))
        await page.screenshot({
          path: `${out}/signup-${width}.png`,
          fullPage: true,
        });
    }
    console.log(`PASS commerce layouts and loaded fonts at ${width}px`);
  }

  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto(base + "/signup");
  await page.getByRole("button", { name: "Continue with email" }).click();
  await expect(
    page.getByText("Enter your name (at least 2 characters).", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Use at least 8 characters for your password.", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Full name", exact: true })
    .fill("Test Customer");
  await page.locator("#access-password").fill("short");
  await page.getByRole("button", { name: "Continue with email" }).click();
  await expect(page.locator("#access-password-error")).toBeVisible();
  await page.locator("#access-password").fill("ExamplePass123!");
  await page
    .getByRole("button", { name: "Show password", exact: true })
    .click();
  await expect(page.locator("#access-password")).toHaveAttribute(
    "type",
    "text",
  );
  await page
    .getByRole("button", { name: "Hide password", exact: true })
    .click();
  await expect(page.locator("#access-password")).toHaveAttribute(
    "type",
    "password",
  );
  await expect(
    page.getByText("Enter your email address.", { exact: true }),
  ).toBeVisible();
  await page
    .locator("main")
    .getByRole("textbox", { name: "Email address", exact: true })
    .fill("invalid-email");
  await page.getByRole("button", { name: "Continue with email" }).click();
  await expect(
    page.getByText("Enter a valid email address, such as you@example.com."),
  ).toBeVisible();
  await page
    .locator("main")
    .getByRole("textbox", { name: "Email address", exact: true })
    .fill("  Person@Example.com  ");
  await page.getByRole("button", { name: "Continue with email" }).click();
  await expect(
    page.getByText("Please accept the terms and privacy policy to continue."),
  ).toBeVisible();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Continue with email" }).click();
  await expect(
    page.getByRole("heading", { name: "Your email is ready" }),
  ).toBeVisible();
  await expect(
    page.getByText("person@example.com", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/No email has been sent/)).toBeVisible();
  await page.getByRole("button", { name: "Edit details" }).click();
  await expect(page.locator("#access-password")).toHaveValue("");
  await expect(
    page
      .locator("main")
      .getByRole("textbox", { name: "Email address", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page
    .locator("main")
    .getByRole("textbox", { name: "Email address", exact: true })
    .fill("person@example.com");
  await page.getByRole("button", { name: "Continue with email" }).click();
  await expect(
    page.getByRole("heading", { name: "Your email is ready" }),
  ).toBeVisible();

  await page.goto(base + "/collections");
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const mobile = await page.locator(".mobile-filter-button").isVisible();
    if (mobile) await page.locator(".mobile-filter-button").click();
    const filters = page.locator(
      mobile ? "dialog .filters" : ".desktop-filters .filters",
    );
    for (const name of [
      "Gemstone",
      "Material & purity",
      "Occasion",
      "Collection",
      "Category",
    ]) {
      const trigger = filters.getByRole("button", { name, exact: true });
      if ((await trigger.getAttribute("aria-expanded")) === "true")
        await trigger.click();
      await trigger.click();
      await expect(filters.locator('[aria-expanded="true"]')).toHaveCount(1);
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
    }
    const option = filters
      .locator(".filter-accordion > div:not([hidden]) input")
      .first();
    await option.check();
    await filters
      .getByRole("button", { name: "Gemstone", exact: true })
      .click();
    await filters
      .getByRole("button", { name: "Category", exact: true })
      .click();
    await expect(option).toBeChecked();
    await filters
      .getByRole("button", { name: "Clear all filters", exact: true })
      .click();
    await filters
      .getByRole("button", { name: "Category", exact: true })
      .press("Enter");
    await expect(filters.locator('[aria-expanded="true"]')).toHaveCount(0);
    if (mobile) {
      await page.keyboard.press("Escape");
      await expect(page.locator("dialog")).toHaveCount(0);
    }
  }
  await page.setViewportSize({ width: 320, height: 568 });
  const cards = page.locator(".collection-results .sf-product");
  await expect(cards.first()).toBeVisible();
  const first = await cards.first().locator(".sf-product-name").textContent();
  const initial = await cards.count();
  await page.locator(".collection-load-more").scrollIntoViewIfNeeded();
  await expect.poll(() => cards.count()).toBeGreaterThan(initial);
  expect(await cards.first().locator(".sf-product-name").textContent()).toBe(
    first,
  );
  expect(await cards.first().locator("img").getAttribute("loading")).toBe(
    "lazy",
  );
  await page
    .getByRole("combobox", { name: "Sort products" })
    .selectOption("low");
  await expect(cards.first()).toBeVisible();
  const prices = await page
    .locator(".collection-results .sf-product-price strong")
    .allTextContents();
  const amounts = prices.map((text) => Number(text.replace(/[^0-9]/g, "")));
  expect(amounts).toEqual([...amounts].sort((a, b) => a - b));

  await page.evaluate(() =>
    localStorage.setItem(
      "techglock-shop",
      JSON.stringify({
        state: {
          bag: [{ id: "emerald-drop-earrings", quantity: 1 }],
          wishlist: [],
        },
        version: 0,
      }),
    ),
  );
  await page.goto(base + "/checkout?offer=WELCOME10");
  await expect(
    page.getByRole("heading", { name: "Delivery details" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Preview Razorpay payment" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("main [role=alert]")).toHaveCount(7);
  for (const [name, value] of Object.entries({
    name: "Test Customer",
    email: "person@example.com",
    phone: "9876543210",
    address: "123 Test Street",
    city: "Jaipur",
    state: "Rajasthan",
    pin: "302001",
  }))
    await page.locator(`main input[name="${name}"]`).fill(value);
  await page.getByRole("button", { name: "Preview Razorpay payment" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (const method of [
    "UPI",
    "Credit / debit card",
    "Netbanking",
    "Wallets",
  ]) {
    await dialog
      .getByRole("radio", { name: new RegExp(method.replace("/", "\\/")) })
      .check();
    await expect(dialog.locator(".payment-explanation h3")).toHaveText(method);
  }
  expect(await dialog.evaluate((e) => e.scrollWidth <= e.clientWidth)).toBe(
    true,
  );
  await expect(
    dialog.getByRole("button", { name: "Back to checkout" }),
  ).toBeInViewport();
  await dialog.locator(".modal-content").evaluate((e) => (e.scrollTop = 0));
  await page.screenshot({ path: `${out}/razorpay-320.png` });
  await dialog.getByRole("button", { name: "Back to checkout" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(errors).toEqual([]);
  writeFileSync(
    `${out}/results.json`,
    JSON.stringify(
      {
        checks,
        errors,
        emailValidation: true,
        incrementalLoading: true,
        sorting: true,
        paymentValidation: true,
        paymentMethods: true,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS email validation, consent, signup/login navigation, incremental loading, sorting and Razorpay preview methods",
  );
} finally {
  await browser.close();
}
