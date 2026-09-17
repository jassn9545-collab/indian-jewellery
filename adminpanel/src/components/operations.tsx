"use client";
import Link from "next/link";
import { useState } from "react";
import { type Database, type Entry, money } from "@/lib/admin-data";
import {
  type CommerceData,
  inventory,
  orderTotal,
  commerceMoney,
} from "@/lib/commerce";
import {
  commerceRepository,
  type RemoteWorkspace,
  type Settings,
} from "@/lib/storage";
import { Pagination, SearchInput, Modal } from "./ui";

export function Inventory({
  db,
  commerce,
  threshold,
  onSaved,
}: {
  db: Database;
  commerce: CommerceData;
  threshold: number;
  onSaved: (ws: RemoteWorkspace) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const rows = db.products.filter(
    (p) =>
      `${p.name} ${p.sku}`.toLowerCase().includes(query.toLowerCase()) &&
      (!filter ||
        (filter === "in"
          ? (p.stock || 0) > threshold
          : filter === "out"
            ? !p.stock
            : (p.stock || 0) > 0 && (p.stock || 0) <= threshold)),
  );
  const PAGE_SIZE = 10;
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(rows.length / PAGE_SIZE)),
  );
  return (
    <div className="list-panel list-page">
      <div className="page-heading">
        <div>
          <h1>Inventory</h1>
          <p>Track availability and adjust physical stock.</p>
        </div>
        <Link className="button" href="/admin/products/add">
          Add product
        </Link>
      </div>
      <div className="operations-stats">
        {[
          ["Products", db.products.length],
          [
            "Available units",
            db.products.reduce((sum, p) => sum + (p.stock || 0), 0),
          ],
          [
            "Low stock",
            db.products.filter(
              (p) => (p.stock || 0) > 0 && (p.stock || 0) <= threshold,
            ).length,
          ],
          [
            "Stock value",
            money(
              db.products.reduce(
                (sum, p) =>
                  sum + (p.stock || 0) * (p.salePrice ?? p.price ?? 0),
                0,
              ),
            ),
          ],
        ].map(([label, value]) => (
          <div className="stat-card" key={label}>
            <span>{label}</span>
            <strong className="stat-value">{value}</strong>
          </div>
        ))}
      </div>
      <div className="panel list-results">
        <div className="panel-heading inventory-toolbar">
          <SearchInput
            value={query}
            onChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
            placeholder="Search product or SKU"
          />
          <label className="field">
            Stock status
            <select
              aria-label="Stock status"
              value={filter}
              onChange={(event) => {
                setFilter(event.target.value);
                setPage(1);
              }}
            >
              <option value="">All stock</option>
              <option value="in">In stock</option>
              <option value="low">Low stock</option>
              <option value="out">Out of stock</option>
            </select>
          </label>
        </div>
        <div className="table-scroll inventory-table">
          <table>
            <thead>
              <tr>
                {[
                  "Product / SKU",
                  "Category",
                  "Current",
                  "Sold",
                  "Available",
                  "Stock value",
                  "Status",
                  "Action",
                ].map((label) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows
                .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                .map((product) => {
                  const stock = inventory(product, commerce.orders);
                  return (
                    <tr key={product.id}>
                      <td>
                        <Link href={`/admin/products/view/${product.id}`}>
                          {product.name}
                        </Link>
                        <div className="muted">{product.sku}</div>
                      </td>
                      <td>
                        {db.categories.find((c) => c.id === product.categoryId)
                          ?.name || "Uncategorized"}
                      </td>
                      <td>{stock.current}</td>
                      <td>{stock.sold}</td>
                      <td>{stock.available}</td>
                      <td>
                        {money(
                          stock.available *
                            (product.salePrice ?? product.price ?? 0),
                        )}
                      </td>
                      <td>
                        {!stock.available
                          ? "Out of stock"
                          : stock.available <= threshold
                            ? "Low stock"
                            : "In stock"}
                      </td>
                      <td>
                        <button
                          className="button secondary"
                          onClick={() => {
                            setEditing(product);
                            setError("");
                          }}
                        >
                          Adjust stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              {!rows.length && (
                <tr>
                  <td colSpan={8}>
                    No products match. Add a product or change your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={currentPage}
          total={rows.length}
          size={PAGE_SIZE}
          onChange={setPage}
        />
      </div>
      {editing && (
        <Modal
          title={`Adjust stock: ${editing.name}`}
          onClose={() => {
            if (!busy) setEditing(null);
          }}
        >
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              const current = Number(
                new FormData(event.currentTarget).get("current"),
              );
              setBusy(true);
              setError("");
              try {
                onSaved(
                  await commerceRepository.updateStock(
                    editing.id,
                    current,
                    editing.stock || 0,
                  ),
                );
                setEditing(null);
              } catch (e) {
                setError((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <p>
              Current stock includes sold units. Available stock is calculated
              automatically.
            </p>
            <label className="field">
              Current stock
              <input
                name="current"
                type="number"
                step="1"
                min={inventory(editing, commerce.orders).sold}
                defaultValue={inventory(editing, commerce.orders).current}
                required
              />
            </label>
            {error && (
              <p role="alert" className="error-text">
                {error}
              </p>
            )}
            <button className="button" disabled={busy}>
              {busy ? "Saving…" : "Save stock"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

export function Analytics({
  db,
  commerce,
}: {
  db: Database;
  commerce: CommerceData;
}) {
  const paid = commerce.orders.filter(
    (order) => order.payment.status === "Paid",
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Analytics</h1>
          <p>All-time totals from saved store records.</p>
        </div>
      </div>
      <div className="operations-stats">
        {[
          ["Orders", commerce.orders.length],
          [
            "Paid revenue",
            commerceMoney(
              paid.reduce((sum, order) => sum + order.payment.amount, 0),
            ),
          ],
          ["Customers", commerce.customers.length],
          [
            "Average order",
            commerceMoney(
              commerce.orders.length
                ? Math.round(
                    commerce.orders.reduce(
                      (sum, order) => sum + orderTotal(order),
                      0,
                    ) / commerce.orders.length,
                  )
                : 0,
            ),
          ],
        ].map(([label, value]) => (
          <div className="stat-card" key={label}>
            <span>{label}</span>
            <strong className="stat-value">{value}</strong>
          </div>
        ))}
      </div>
      <div className="panel form-panel">
        <h2>Catalog overview</h2>
        <p>
          {db.products.filter((p) => p.status === "Active").length} active
          products across {db.categories.length} categories.
        </p>
        <p>
          {commerce.returns.length} return requests ·{" "}
          {commerce.orders.filter((o) => o.status === "Delivered").length}{" "}
          delivered orders.
        </p>
        {!commerce.orders.length && (
          <p className="muted">
            Order metrics will appear when order records are available.
          </p>
        )}
      </div>
    </>
  );
}

export function StoreSettings({
  settings,
  onSaved,
}: {
  settings: Settings;
  onSaved: (ws: RemoteWorkspace) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <>
      <div className="page-heading">
        <h1>Settings</h1>
      </div>
      <form
        className="panel form-panel"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          setBusy(true);
          setError("");
          try {
            onSaved(
              await commerceRepository.saveSettings({
                storeName: String(form.get("storeName")).trim(),
                contactEmail: String(form.get("contactEmail")).trim(),
                lowStockThreshold: Number(form.get("lowStockThreshold")),
              }),
            );
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="form-grid">
          <label className="field">
            Store name
            <input
              name="storeName"
              defaultValue={settings.storeName}
              maxLength={100}
              required
            />
          </label>
          <label className="field">
            Contact email
            <input
              name="contactEmail"
              type="email"
              defaultValue={settings.contactEmail}
            />
          </label>
          <label className="field">
            Low stock threshold
            <input
              name="lowStockThreshold"
              type="number"
              step="1"
              min="0"
              max="10000"
              defaultValue={settings.lowStockThreshold}
              required
            />
          </label>
        </div>
        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}
        <div className="settings-actions">
          <button className="button" disabled={busy}>
            {busy ? "Saving…" : "Save settings"}
          </button>
        </div>
      </form>
    </>
  );
}
