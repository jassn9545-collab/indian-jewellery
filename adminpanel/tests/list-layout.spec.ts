import { test, expect } from '@playwright/test';
import { seedDatabase } from '../src/lib/admin-data';
import { seedCommerce } from '../src/lib/commerce';

test('commerce lists share catalog layout with populated and empty tables', async ({ page }) => {
  test.setTimeout(120000);
  const catalog = seedDatabase();
  await page.route('**/admin-api/**', route => route.fulfill({ json: route.request().url().endsWith('/session') ? { name: 'Admin', email: 'admin@example.test' } : { catalog, commerce: seedCommerce(catalog), revision: 0 } }));
  for (const section of ['orders', 'orders/returns', 'customers', 'payments', 'shipping', 'inventory']) {
    await page.goto(`/admin/${section}`);
    await expect(page.locator('.list-results tbody tr').first()).toBeVisible();
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${section} at ${width}`).toBe(true);
      await expect(page.locator('.list-results .pagination')).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThan(2000);
    await page.screenshot({ path: `test-results/list-${section.replaceAll('/', '-')}-desktop.png`, fullPage: true });
    const search = page.locator('.list-page input').first();
    await search.fill('no-matching-record-xyz');
    await expect(page.locator('.list-results')).toContainText(/No /);
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
