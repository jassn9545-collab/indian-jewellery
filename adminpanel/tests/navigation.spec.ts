import { test, expect } from '@playwright/test';
import { seedDatabase } from '../src/lib/admin-data';

test('navigation preserves the shell and workspace, updating only route content', async ({ page }) => {
  let sessions = 0;
  let workspaces = 0;
  let documents = 0;
  page.on('request', request => {
    if (request.isNavigationRequest() && request.resourceType() === 'document') documents++;
  });
  await page.route('**/admin-api/**', route => {
    if (new URL(route.request().url()).pathname.endsWith('/session')) {
      sessions++;
      return route.fulfill({ json: { name: 'Admin', email: 'admin@example.com' } });
    }
    workspaces++;
    return route.fulfill({ json: {
      catalog: seedDatabase(),
      commerce: { version: 1, orders: [], returns: [], customers: [] },
      revision: 0,
    } });
  });
  await page.goto('/admin/dashboard');
  await expect(page.locator('.main-content h1')).toBeVisible();
  await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  const shell = await page.locator('.admin-shell').elementHandle();
  const initial = { sessions, workspaces, documents };

  // The collapsed sidebar is intentionally hidden; navigate using a dashboard link.
  await page.locator('.main-content a[href="/admin/products"]').first().click();
  await expect(page).toHaveURL(/\/admin\/products$/);
  await expect(page.getByRole('button', { name: 'Expand sidebar', exact: true })).toBeVisible();
  expect(await shell!.evaluate(node => node === document.querySelector('.admin-shell'))).toBe(true);
  expect({ sessions, workspaces, documents }).toEqual(initial);
  await page.getByRole('button', { name: 'Expand sidebar', exact: true }).click();

  for (const section of ['categories', 'orders', 'settings']) {
    if (section === 'orders') {
      await page.locator('.sidebar').getByRole('button', { name: 'Orders', exact: true }).click();
    }
    await page.locator(`.sidebar a[href="/admin/${section}"]`).first().click();
    await expect(page).toHaveURL(new RegExp(`/admin/${section}$`));
    await expect(page.locator('.main-content h1')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Collapse sidebar', exact: true })).toBeVisible();
    expect(await shell!.evaluate(node => node === document.querySelector('.admin-shell'))).toBe(true);
    expect({ sessions, workspaces, documents }).toEqual(initial);
  }
  await page.goBack();
  await expect(page).toHaveURL(/\/admin\/orders$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/admin\/settings$/);
  expect(await shell!.evaluate(node => node === document.querySelector('.admin-shell'))).toBe(true);
  expect({ sessions, workspaces, documents }).toEqual(initial);
});
