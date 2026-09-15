import { chromium, expect } from '@playwright/test';
const browser = await chromium.launch({channel:'msedge',headless:true});
const page = await browser.newPage({reducedMotion:'reduce'});
try {
for (const width of [320,390,600,767]) {
 await page.setViewportSize({width,height:850});
 await page.goto('http://localhost:3000/collections');
 await page.locator('.mobile-filter-button').click();
 const dialog = page.locator('dialog');
 await expect(dialog).toBeVisible();
 const box = await dialog.boundingBox();
 expect(box.width).toBeLessThanOrEqual(width / 2 + 1);
 expect(box.x).toBe(0);
 for (const name of ['Category','Gemstone','Material & purity','Occasion','Collection']) {
 const trigger = dialog.getByRole('button',{name,exact:true});
 await trigger.click();
 await expect(trigger.locator('svg')).toHaveClass(/lucide-chevron-down/);
 }
 expect(await dialog.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`artifacts/commerce/filter-half-${width}.png`});
 await page.keyboard.press('Escape');
 await expect(dialog).toHaveCount(0);
 console.log(`PASS half-width filter and chevrons at ${width}px`);
}
} finally {await browser.close();}

