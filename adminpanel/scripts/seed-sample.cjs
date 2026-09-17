/* eslint-disable @typescript-eslint/no-require-imports */
// Explicit, additive sample data for the local admin workspace. Never runs on startup.
const path = require('node:path');
const backend = path.resolve(__dirname, '../../backend');
require(path.join(backend, 'node_modules/dotenv')).config({ path: path.join(backend, '.env') });
require(path.join(backend, 'node_modules/ts-node')).register({ project: path.join(backend, 'tsconfig.json') });
const { prisma } = require(path.join(backend, 'src/database/prisma'));
const { seedDatabase, modules, validateEntry } = require(path.join(backend, 'src/admin/admin-data'));
const { seedCommerce } = require(path.join(backend, 'src/admin/commerce'));

async function main() {
  if (process.env.NODE_ENV === 'production') throw new Error('Sample data is only intended for local development.');
  const counts = await prisma.$transaction(async tx => {
    const row = await tx.adminWorkspace.findUnique({ where: { id: 'store' } });
    const ws = row ? structuredClone(row.data) : { catalog: {}, commerce: { version: 1, orders: [], customers: [], returns: [] } };
    const defaults = seedDatabase();
    for (const key of ['categories', 'products']) {
      if (!ws.catalog[key]?.length) ws.catalog[key] = defaults[key];
    }
    // Match seeded products to existing categories without replacing custom records.
    for (const product of ws.catalog.products) {
      if (!ws.catalog.categories.some(category => category.id === product.categoryId)) {
        const category = defaults.categories.find(category => category.id === product.categoryId);
        if (category) ws.catalog.categories.push(category);
      }
    }
    const products = ws.catalog.products;
    for (const [key] of modules) {
      if (ws.catalog[key]?.length) continue;
      ws.catalog[key] = defaults[key].filter(entry => !entry.productId || products.some(p => p.id === entry.productId));
      if (!ws.catalog[key].length && ['new-launch', 'royally-crafted', 'pure-silver', 'best-sellers'].includes(key)) {
        ws.catalog[key] = products.slice(0, 3).map((p, i) => ({ id: `sample-${key}-${i}`, productId: p.id, status: 'Active', displayOrder: i + 1 }));
      }
    }
    if (!row?.data.catalog?.products?.length && products.length > 2) products[1].stock = 5;
    if (!ws.catalog['trending-looks'].length) ws.catalog['trending-looks'] = products.slice(0, 3).map((p, i) => ({ id: `sample-look-${i}`, productId: p.id, title: `Sample look: ${p.name}`, image: p.image, status: 'Active' }));
    if (!ws.catalog.reviews.length) ws.catalog.reviews = [5, 4, 5].map((rating, i) => ({ id: `sample-review-${i}`, name: `Sample customer ${i + 1}`, text: ['Beautiful detailing and comfortable to wear.', 'Lovely finish for festive occasions.', 'The jewellery arrived carefully packed.'][i], rating, verified: false, location: 'Jaipur', status: 'Active' }));
    const demo = seedCommerce(ws.catalog);
    demo.customers.forEach(customer => { customer.email = customer.email.replace('@example.test', '@example.com'); customer.notes = 'Sample record for admin preview.'; });
    demo.orders.forEach((order, i) => {
      const customer = demo.customers[i % demo.customers.length];
      order.customer = { name: customer.name, email: customer.email, phone: customer.phone, address: customer.address, shippingAddress: customer.shippingAddress, billingAddress: customer.billingAddress };
      order.demo = true;
    });
    demo.returns.forEach((item, i) => {
      const order = demo.orders.filter(order => order.status === 'Delivered')[i % demo.orders.filter(order => order.status === 'Delivered').length];
      const product = order.items[0];
      item.orderId = order.id; item.customerName = order.customer.name; item.customerEmail = order.customer.email; item.customerPhone = order.customer.phone;
      item.product = { id: product.productId, name: product.name, sku: product.sku, image: product.image, price: (product.unitPrice - product.unitDiscount) / 100 };
      item.quantity = 1; item.notes = 'Sample return for admin preview.';
    });
    const commerceEmpty = !ws.commerce.orders.length && !ws.commerce.customers.length && !ws.commerce.returns.length;
    if (commerceEmpty) ws.commerce = demo;
    else {
      // Merge the linked sample set only when its IDs do not collide with existing records.
      const collision = ['orders', 'customers', 'returns'].some(key => demo[key].some(item => ws.commerce[key].some(old => old.id === item.id)));
      if (!collision) for (const key of ['orders', 'customers', 'returns']) ws.commerce[key].push(...demo[key]);
    }
    ws.settings ||= { storeName: 'Indian Jewellery', contactEmail: '', lowStockThreshold: 10 };
    for (const [key] of modules) for (const entry of ws.catalog[key]) validateEntry(ws.catalog, key, entry);
    const data = JSON.parse(JSON.stringify(ws));
    if (row) {
      const saved = await tx.adminWorkspace.updateMany({ where: { id: 'store', version: row.version }, data: { data, version: { increment: 1 } } });
      if (!saved.count) throw new Error('Workspace changed while seeding. Retry.');
    } else await tx.adminWorkspace.create({ data: { id: 'store', data } });
    return { ...Object.fromEntries(modules.map(([key]) => [key, ws.catalog[key].length])), ...Object.fromEntries(['orders', 'customers', 'returns'].map(key => [key, ws.commerce[key].length])) };
  });
  console.log('Sample data saved in MySQL. Existing records preserved.', counts);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
