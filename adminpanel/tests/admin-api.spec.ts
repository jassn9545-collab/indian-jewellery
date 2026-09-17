import { test, expect } from '@playwright/test';
import { seedDatabase, modules } from '../src/lib/admin-data';

test('login shows a retryable connection error when the backend is offline', async ({ page }) => {
  await page.route('**/admin-api/session', route => route.fulfill({ status: 503, json: { error: 'Database offline' } }));
  await page.goto('/admin/login');
  await expect(page.getByText('Admin server is unavailable. Start the Express backend and check MySQL.')).toBeVisible();
});

test('first administrator signup submits credentials and opens the dashboard', async ({ page }) => {
  let signedIn = false;
  const session = { name: 'First Admin', email: 'first@example.test' };
  await page.route('**/admin-api/**', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/session')) return route.fulfill({ status: signedIn ? 200 : 401, json: signedIn ? session : { error: 'Sign in' } });
    if (path.endsWith('/signup')) {
      expect(route.request().postDataJSON()).toEqual({ ...session, password: 'Example123!' });
      signedIn = true;
      return route.fulfill({ status: 201, json: session });
    }
    return route.fulfill({ json: { catalog: seedDatabase(), commerce: { version: 1, orders: [], returns: [], customers: [] }, revision: 0 } });
  });
  await page.goto('/admin/login');
  await page.getByRole('link', { name: 'Create account', exact: true }).click();
  await page.getByLabel('Full name').fill(session.name);
  await page.getByLabel('Email address').fill(session.email);
  await page.getByLabel('Password', { exact: true }).fill('Example123!');
  await page.getByLabel('Confirm password').fill('Example123!');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Welcome back, First.' })).toBeVisible();
});

test('API-backed sections, inventory adjustment, settings persistence and compact responsive layout', async ({ page }) => {
  test.setTimeout(120000); // Visits every admin section, including cold development compilations.
  let workspace = { catalog: seedDatabase(), commerce: { version: 1, orders: [], returns: [], customers: [] }, revision: 0, settings: { storeName: 'Test Jewellery', contactEmail: '', lowStockThreshold: 10 } };
  await page.route('**/admin-api/**', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/admin-api/session') return route.fulfill({ json: { name: 'Store Admin', email: 'admin@example.test' } });
    if (path === '/admin-api/workspace') return route.fulfill({ json: workspace });
    if (path === '/admin-api/command') {
      const body = route.request().postDataJSON();
      expect(route.request().headers()['x-admin-request']).toBe('1');
      expect(body.revision).toBe(workspace.revision);
      if (body.action === 'stock') workspace.catalog.products = workspace.catalog.products.map(p => p.id === body.payload.id ? { ...p, stock: body.payload.current } : p);
      if (body.action === 'settings') workspace.settings = body.payload;
      if (body.action === 'catalog') workspace.catalog[body.payload.module as keyof typeof workspace.catalog] = body.payload.rows;
      workspace = { ...workspace, revision: workspace.revision + 1 };
      return route.fulfill({ json: workspace });
    }
    return route.fulfill({ status: 404, json: { error: 'Not found' } });
  });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const route of ['dashboard', ...modules.map(([key]) => key), 'orders', 'orders/returns', 'customers', 'payments', 'shipping', 'analytics', 'settings', 'inventory']) {
    await page.goto(`/admin/${route}`);
    await expect(page.locator('.main-content h1')).toBeVisible();
    await expect(page.getByText('module preview.', { exact: false })).toHaveCount(0);
  }
  await page.getByRole('button', { name: 'Adjust stock' }).first().click();
  await page.getByLabel('Current stock', { exact: true }).fill('42');
  await page.getByRole('button', { name: 'Save stock' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('tbody tr').first()).toContainText('42');
  await page.goto('/admin/settings');
  await page.getByLabel('Store name').fill('Updated Jewellery');
  await page.getByLabel('Low stock threshold').fill('50');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByRole('status')).toContainText('Changes saved');
  await page.reload();
  await expect(page.getByLabel('Store name')).toHaveValue('Updated Jewellery');
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/admin/inventory');
    await expect(page.getByRole('heading', { name: 'Inventory', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: `test-results/inventory-${width}.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
});

test('API save failure keeps inventory editor open and reports the error', async ({ page }) => {
  await page.route('**/admin-api/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/session')) return route.fulfill({ json: { name: 'Admin', email: 'admin@example.test' } });
    if (path.endsWith('/workspace')) return route.fulfill({ json: { catalog: seedDatabase(), commerce: { version: 1, orders: [], returns: [], customers: [] }, revision: 1 } });
    return route.fulfill({ status: 409, json: { error: 'Records changed. Reload the page before saving.' } });
  });
  await page.goto('/admin/inventory');
  await page.getByRole('button', { name: 'Adjust stock' }).first().click();
  await page.getByLabel('Current stock', { exact: true }).fill('30');
  await page.getByRole('button', { name: 'Save stock' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('Records changed');
});
