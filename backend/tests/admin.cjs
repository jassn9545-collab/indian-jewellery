const { test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const jwt = require('jsonwebtoken');
const { prisma } = require('../dist/database/prisma');
const { seedDatabase } = require('../dist/admin/admin-data');
const { adminRouter } = require('../dist/admin/routes');

test('admin authorization, validated catalog writes, stock conflicts and persisted settings', async () => {
  process.env.ADMIN_SESSION_SECRET = 'test-only-secret-with-more-than-thirty-two-characters';
  let admin = true;
  let row = { id: 'store', version: 0, data: { catalog: seedDatabase(), commerce: { version: 1, orders: [], returns: [], customers: [] } } };
  prisma.user.findUnique = async () => ({ id: 1, name: 'Admin', email: 'admin@example.test', type: admin ? 1 : 2, status: 1, isDeleted: false });
  prisma.adminWorkspace.upsert = async () => structuredClone(row);
  prisma.adminWorkspace.updateMany = async ({ where, data }) => {
    if (where.version !== row.version) return { count: 0 };
    row = { ...row, data: data.data, version: row.version + 1 };
    return { count: 1 };
  };
  const app = express(); app.use('/admin-api', adminRouter);
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/admin-api`;
  const cookie = `ij_admin=${jwt.sign({ sub: '1', purpose: 'admin' }, process.env.ADMIN_SESSION_SECRET)}`;
  const request = (path, body, headers = {}) => fetch(base + path, { method: body ? 'POST' : 'GET', headers: { Cookie: cookie, 'Content-Type': 'application/json', 'X-Admin-Request': '1', ...headers }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const command = (action, payload, revision = row.version) => request('/command', { action, payload, revision });
  try {
    assert.equal((await fetch(base + '/workspace')).status, 401);
    admin = false; assert.equal((await request('/workspace')).status, 401); admin = true;
    assert.equal((await request('/command', {}, { 'X-Admin-Request': '' })).status, 403);
    assert.equal((await request('/workspace')).status, 200);
    const product = row.data.catalog.products[0];
    assert.equal((await command('stock', { id: product.id, current: -1, available: product.stock })).status, 400);
    assert.equal((await command('stock', { id: product.id, current: 35, available: product.stock })).status, 200);
    assert.equal(row.data.catalog.products[0].stock, 35);
    assert.equal((await command('stock', { id: product.id, current: 99, available: product.stock }, 0)).status, 409);
    assert.equal(row.data.catalog.products[0].stock, 35);
    const baseline = structuredClone(row.data.catalog.categories);
    const rows = [...baseline, { id: 'test-category', name: 'Test category', status: 'Active' }];
    assert.equal((await command('catalog', { module: 'categories', rows, baseline })).status, 200);
    assert.equal(row.data.catalog.categories.at(-1).name, 'Test category');
    assert.equal((await command('catalog', { module: 'categories', rows: baseline, baseline })).status, 409);
    assert.equal((await command('settings', { storeName: 'Updated store', contactEmail: '', lowStockThreshold: 5 })).status, 200);
    assert.equal((await (await request('/workspace')).json()).settings.lowStockThreshold, 5);
    let existingAdmins = 1;
    let completed = false;
    let createdUser;
    prisma.$transaction = async callback => callback({
      adminWorkspace: { update: async ({ data }) => { if (data.data) completed = data.data.completed; return { data: { completed } }; } },
      user: {
        count: async () => existingAdmins,
        create: async ({ data }) => { createdUser = data; return { id: 2, name: data.name, email: data.email }; },
      },
    });
    const signup = { name: 'First Admin', email: 'FIRST@example.com', password: 'Example123!' };
    assert.equal((await request('/signup', { ...signup, password: 'short' })).status, 400);
    assert.equal((await request('/signup', signup)).status, 409);
    existingAdmins = 0;
    const registered = await request('/signup', signup);
    assert.equal(registered.status, 201);
    assert.match(registered.headers.get('set-cookie'), /HttpOnly/i);
    assert.equal((await registered.json()).email, 'first@example.com');
    assert.equal(createdUser.type, 1);
    assert.notEqual(createdUser.password, signup.password);
    assert.equal(await require('bcryptjs').compare(signup.password, createdUser.password), true);
    assert.equal((await request('/signup', signup)).status, 409);
  } finally { await new Promise(resolve => server.close(resolve)); await prisma.$disconnect(); }
});
