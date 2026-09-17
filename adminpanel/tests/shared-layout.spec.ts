import { test, expect } from '@playwright/test';
import { seedDatabase, modules } from '../src/lib/admin-data';

test('shared admin layout stays contained across all sections and screen sizes', async ({ page }) => {
  test.setTimeout(180000);
  await page.route('**/admin-api/**', route => route.fulfill({ json:
    route.request().url().endsWith('/session') ? { name: 'Admin', email: 'admin@example.test' } :
    { catalog: seedDatabase(), commerce: { version: 1, orders: [], customers: [], returns: [] }, revision: 0 },
  }));
  const sections = ['dashboard', ...modules.map(([key]) => key), 'inventory', 'orders', 'customers', 'payments', 'shipping', 'analytics', 'settings', 'products/add'];
  for (const section of sections) {
    await page.goto(`/admin/${section}`);
    await expect(page.locator('.main-content h1')).toBeVisible();
    for (const width of [320, 390, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      const metrics = await page.evaluate(() => {
        const main = document.querySelector('.main-content')!;
        const css = getComputedStyle(main);
        return { overflow: document.documentElement.scrollWidth > innerWidth, width: main.getBoundingClientRect().width,
          gutter: parseFloat(css.paddingLeft), heading: getComputedStyle(main.querySelector('h1')!).fontFamily,
          body: getComputedStyle(main).fontFamily, sidebar: getComputedStyle(document.querySelector('.sidebar')!).backgroundColor };
      });
      expect(metrics.overflow, `${section} at ${width}px`).toBe(false);
      expect(metrics.gutter).toBe(section === "products/add" ? 0 : width < 1024 ? 16 : 24);
      expect(metrics.heading).toContain('displayFont');
      expect(metrics.body).toContain('bodyFont');
      expect(metrics.sidebar).toBe('rgb(13, 59, 46)');
      const available = width < 1024 ? width : width - (width <= 1200 ? 200 : 220);
      expect(metrics.width).toBe(section === "products/add" ? Math.min(available - (width < 768 ? 32 : 40), 1440) : available);
    }
  }
  await page.goto('/admin/products');
  await expect(page.locator('tbody tr')).toHaveCount(10);
  await page.setViewportSize({ width: 1696, height: 947 });
  await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)).toBe(true);
  const footer = await page.locator('.workspace-footer').boundingBox();
  expect(947 - footer!.y - footer!.height).toBeLessThanOrEqual(4);
  await page.screenshot({ path: 'test-results/admin-products-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'test-results/admin-products-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
  await expect(page.locator('.drawer-navigation')).toBeVisible();
  await page.locator('.drawer-navigation').getByRole('button', { name: 'Orders', exact: true }).click();
  await expect(page.locator('.drawer-navigation a[href="/admin/orders"]')).toBeVisible();
});
