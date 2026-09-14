import { chromium, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
const base = process.env.STOREFRONT_URL || "http://localhost:3000";
mkdirSync("artifacts", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", e => errors.push(e.message));
try {
  await page.goto(base, {waitUntil: "networkidle"});
  const categories = await page.locator(".sf-category").evaluateAll(es => es.map(e => new URL(e.href).pathname));
  const cardStyle = e => {
    const get = (selector, props) => {const s = getComputedStyle(selector ? e.querySelector(selector) : e); return props.map(p => s[p]);};
    return [get(null,["borderRadius","borderWidth","boxShadow"]),get(".sf-product-photo",["aspectRatio"]),get(".sf-product-photo > a",["top","left"]),get(".sf-product-name",["fontFamily","fontSize","lineHeight"]),get(".sf-button",["borderRadius","backgroundColor","height"])];
  };
  const reference = await page.locator("[aria-labelledby=sf-bestsellers-heading] .sf-product").first().evaluate(cardStyle);
  const routes = [...categories,"/collections","/collections/all","/collections/new-in","/collections/cz","/best-sellers","/wedding","/precious","/precious/lab-grown-diamonds","/search?q=pearl","/wishlist"];
  for (const route of routes) {
    await page.goto(base + route, {waitUntil: "networkidle"});
    await expect(page.locator("main.listing-container")).toBeVisible();
    await expect(page.locator("main .product-card")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  for (const width of [1440,1280,1024,768,390,320]) {
    await page.setViewportSize({width,height:1000});
    await page.goto(base + "/collections/all", {waitUntil: "networkidle"});
    const main = await page.locator("main").boundingBox();
    expect(Math.abs(main.x - (width-main.x-main.width))).toBeLessThan(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const card = page.locator("main .sf-product").first();
    await expect(card).toBeVisible();
    const bounds = await card.boundingBox();
    expect(bounds.width).toBeLessThan(340);
    if (width === 1440) {
      const actual = await card.evaluate(cardStyle);
      // Insets scale with the unchanged 8%/4% card image positioning.
      expect(actual.filter((_,i)=>i!==2)).toEqual(reference.filter((_,i)=>i!==2));
    }
    await page.screenshot({path:`artifacts/listing-${width}.png`});
    console.log(`PASS listing layout ${width}px, card ${Math.round(bounds.width)}px`);
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(base + "/collections/all", {waitUntil: "networkidle"});
  await page.getByRole("combobox",{name:"Sort products"}).selectOption("low");
  const prices = await page.locator("main .sf-product-price strong").allTextContents();
  const numbers = prices.map(p=>Number(p.replace(/[^0-9]/g,"")));
  expect(numbers).toEqual([...numbers].sort((a,b)=>a-b));
  await page.getByRole("checkbox",{name:"In stock only"}).check();
  await expect(page.locator("main").getByRole("button",{name:"Out of stock",exact:true})).toHaveCount(0);
  const first=page.locator("main .sf-product").first();
  await first.getByRole("button",{name:"Add to cart",exact:true}).click();
  await expect(page.locator("main").getByRole("status").last()).toHaveText("Added to cart");
  await first.locator(".sf-save").click();
  await expect(first.locator(".sf-save")).toHaveAttribute("aria-pressed","true");
  await page.setViewportSize({width:390,height:844});
  await page.getByRole("button",{name:"Filter",exact:true}).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  expect(errors).toEqual([]);
  console.log(`PASS ${routes.length} routes, shared Best Seller styles, sort, stock filter, cart, wishlist and mobile filters`);
} finally {await browser.close();}
