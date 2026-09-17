import { test, expect } from '@playwright/test';
import { seedDatabase } from '../src/lib/admin-data';

test('inventory search, stock filters and responsive control alignment', async ({ page }) => {
  const catalog = seedDatabase();
  catalog.products = catalog.products.slice(0, 3).map((p, i) => ({ ...p, stock: [0, 5, 20][i] }));
  await page.route('**/admin-api/**', route => route.fulfill({ json:
    route.request().url().endsWith('/session') ? { name: 'Admin', email: 'admin@example.com' } :
      { catalog, commerce: { version: 1, orders: [], customers: [], returns: [] }, revision: 0 },
  }));
  await page.goto('/admin/inventory');
  const search = page.getByRole('textbox', { name: 'Search product or SKU' });
  const status = page.getByLabel('Stock status', { exact: true });
  await expect(page.locator('tbody tr')).toHaveCount(3);
  for (const [value, index] of [['out', 0], ['low', 1], ['in', 2]] as const) {
    await status.selectOption(value);
    await expect(page.locator('tbody tr')).toHaveCount(1);
    await expect(page.locator('tbody')).toContainText(catalog.products[index].name!);
  }
  await status.selectOption('');
  await search.fill(catalog.products[1].sku!);
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(page.locator('tbody')).toContainText(catalog.products[1].name!);
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(page.locator('tbody tr')).toHaveCount(3);
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const a = await page.locator('.inventory-toolbar .search-input').boundingBox();
    const b = await status.boundingBox();
    expect(a!.height).toBe(b!.height);
    if (width >= 768) expect(Math.abs(a!.y + a!.height - b!.y - b!.height)).toBeLessThan(2);
    else {
      expect(Math.abs(a!.x - b!.x)).toBeLessThan(2);
      expect(Math.abs(a!.width - b!.width)).toBeLessThan(2);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.goto('/admin/products/add');
  await expect(page.locator('input[type="file"]').first()).toBeAttached();
  for (const width of [360, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const file = await page.locator('input[type="file"]').first().boundingBox();
    expect(file!.width).toBe(1);
  }
});
