"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Star,
} from "lucide-react";
import {
  type Database,
  type Entry,
  type Module,
  modules,
  entryName,
  resolveEntry,
  money,
  canDelete,
} from "@/lib/admin-data";
import {
  SearchInput,
  FilterDropdown,
  DataTable,
  Pagination,
  StatusToggle,
  ConfirmModal,
  EmptyState,
  Media,
  Modal,
} from "./ui";

export function EntryList({
  module,
  db,
  categoryId,
  onChange,
}: {
  module: Module;
  db: Database;
  categoryId?: string;
  onChange: (rows: Entry[], message: string) => Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState(categoryId || "");
  const [stock, setStock] = useState("");
  const [rating, setRating] = useState("");
  const [verified, setVerified] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<Entry | null>(null);
  const [preview, setPreview] = useState<Entry | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search);
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);
  const label = modules.find((m) => m[0] === module)![1];
  const title = categoryId
    ? `${db.categories.find((c) => c.id === categoryId)?.name || "Category"} products`
    : label;
  const ordered = ["royally-crafted", "best-sellers"].includes(module);
  const all = [...db[module]].sort((a, b) =>
    ordered ? (a.displayOrder || 0) - (b.displayOrder || 0) : 0,
  );
  const rows = all.filter((e) => {
    const product = resolveEntry(db, e);
    const text = [entryName(db, e), product?.name, e.sku, e.location, e.title]
      .join(" ")
      .toLowerCase();
    return (
      text.includes(query.toLowerCase()) &&
      (!status || e.status === status) &&
      (module !== "products" ||
        ((!categoryId || e.categoryId === categoryId) &&
          (!category || e.categoryId === category) &&
          (!stock ||
            (stock === "out"
              ? !e.stock
              : stock === "low"
                ? !!e.stock && e.stock <= 10
                : !!e.stock)))) &&
      (module !== "reviews" ||
        ((!rating || e.rating === Number(rating)) &&
          (!verified || Boolean(e.verified) === (verified === "yes"))))
    );
  });
  const PAGE_SIZE = 10;
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(rows.length / PAGE_SIZE)),
  );
  const visible = rows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  async function change(next: Entry[], message: string) {
    setBusy(true);
    setError("");
    try {
      await onChange(next, message);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const headers =
    module === "products"
      ? [
          "Product / SKU",
          "Category",
          "Original price",
          "Sale price",
          "Stock",
          "Status",
          "Actions",
        ]
      : module === "categories"
        ? ["Category", "Product count", "Status", "Actions"]
        : module === "reviews"
          ? ["Customer", "Rating", "Review", "Verified", "Status", "Actions"]
          : module === "ribbons"
            ? ["Announcement", "Link", "Status", "Actions"]
            : module === "local-brand"
              ? ["Title", "Description", "Link", "Status", "Actions"]
              : [
                  "Item",
                  ...(["royally-crafted", "best-sellers"].includes(module)
                    ? ["Original price", "Sale price", "Discount", "Order"]
                    : ["Details"]),
                  "Status",
                  "Actions",
                ];
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            {module === "products" || module === "categories"
              ? "YOUR COLLECTION"
              : "HOMEPAGE MANAGEMENT"}
          </div>
          <h1>{title}</h1>
          <p>
            {module === "products"
              ? "Every piece, beautifully organized."
              : module === "categories"
                ? "Give every product a place in your collection."
                : "Curate what your customers discover."}
          </p>
        </div>
        <Link className="button" href={`/admin/${module}/add`}>
          <Plus size={16} />
          Add{" "}
          {module === "products"
            ? "product"
            : module === "categories"
              ? "category"
              : module === "reviews"
                ? "review"
                : "item"}
        </Link>
      </div>
      <section className="panel list-panel">
        <div className="list-heading">
          <h2>
            All {title.toLowerCase()}{" "}
            <span className="count-badge">{rows.length}</span>
          </h2>
          <span className="muted">Manage your collection</span>
        </div>
        <div className="filters">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={
              module === "products"
                ? "Search by product name or SKU"
                : module === "reviews"
                  ? "Search customer name or location"
                  : `Search ${label.toLowerCase()}`
            }
          />
          <FilterDropdown
            label="All statuses"
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={["Active", "Inactive"].map((s) => ({
              value: s,
              label: s,
            }))}
          />
          {module === "products" && (
            <>
              <FilterDropdown
                label="All categories"
                value={category}
                onChange={(v) => {
                  setCategory(v);
                  setPage(1);
                }}
                options={db.categories
                  .filter((c) => !categoryId || c.id === categoryId)
                  .map((c) => ({ value: c.id, label: c.name! }))}
              />
              <FilterDropdown
                label="All stock"
                value={stock}
                onChange={(v) => {
                  setStock(v);
                  setPage(1);
                }}
                options={[
                  { value: "in", label: "In stock" },
                  { value: "low", label: "Low stock" },
                  { value: "out", label: "Out of stock" },
                ]}
              />
            </>
          )}
          {module === "reviews" && (
            <>
              <FilterDropdown
                label="All ratings"
                value={rating}
                onChange={(v) => {
                  setRating(v);
                  setPage(1);
                }}
                options={[5, 4, 3, 2, 1].map((n) => ({
                  value: String(n),
                  label: `${n} stars`,
                }))}
              />
              <FilterDropdown
                label="All buyers"
                value={verified}
                onChange={(v) => {
                  setVerified(v);
                  setPage(1);
                }}
                options={[
                  { value: "yes", label: "Verified" },
                  { value: "no", label: "Not verified" },
                ]}
              />
            </>
          )}
        </div>
        {error && (
          <p className="error-text panel-error" role="alert">
            {error}
          </p>
        )}
        <fieldset className="table-fieldset" disabled={busy}>
          {rows.length ? (
            <DataTable headers={headers}>
              {visible.map((e) => {
                const product = resolveEntry(db, e);
                const display = product || e;
                const index = all.findIndex((r) => r.id === e.id);
                const categoryRecord = db.categories.find(
                  (c) => c.id === e.categoryId,
                );
                const image =
                  e.image || product?.image || categoryRecord?.image;
                return (
                  <tr key={e.id}>
                    <td>
                      {module === "ribbons" ? (
                        <strong>{e.text}</strong>
                      ) : (
                        <div className="product-cell">
                          <Media src={image} alt={entryName(db, e)} />
                          <span>
                            <strong>{entryName(db, e)}</strong>
                            <small>
                              {module === "products"
                                ? e.sku
                                : module === "reviews"
                                  ? e.location
                                  : product
                                    ? e.title
                                      ? product.name
                                      : db.categories.find(
                                          (c) => c.id === product.categoryId,
                                        )?.name
                                    : ""}
                            </small>
                          </span>
                        </div>
                      )}
                    </td>
                    {module === "products" ? (
                      <>
                        <td>{categoryRecord?.name}</td>
                        <td className="muted">{money(e.price)}</td>
                        <td>{money(e.salePrice)}</td>
                        <td>
                          <span className={!e.stock ? "stock-warning" : ""}>
                            {e.stock} available
                          </span>
                        </td>
                      </>
                    ) : module === "categories" ? (
                      <td>
                        <Link
                          className="text-link"
                          href={`/admin/categories/${e.id}/products`}
                        >
                          {
                            db.products.filter((p) => p.categoryId === e.id)
                              .length
                          }{" "}
                          products <Eye size={14} />
                        </Link>
                      </td>
                    ) : module === "reviews" ? (
                      <>
                        <td>
                          <span className="rating">
                            <Star size={14} />
                            {e.rating}/5
                          </span>
                        </td>
                        <td className="review-text">{e.text}</td>
                        <td>
                          {e.verified ? (
                            <span className="verified">
                              <CheckCircle2 size={14} /> Yes
                            </span>
                          ) : (
                            "No"
                          )}
                        </td>
                      </>
                    ) : module === "ribbons" ? (
                      <td className="muted">{e.link}</td>
                    ) : module === "local-brand" ? (
                      <>
                        <td className="details-cell muted">
                          {e.description
                            ? e.description.length > 60
                              ? e.description.slice(0, 60) + "…"
                              : e.description
                            : "—"}
                        </td>
                        <td className="muted">{e.link || "—"}</td>
                      </>
                    ) : ordered ? (
                      <>
                        <td className="muted">{money(display.price)}</td>
                        <td>{money(display.salePrice)}</td>
                        <td>
                          {display.price
                            ? Math.round(
                                (1 - (display.salePrice || 0) / display.price) *
                                  100,
                              )
                            : 0}
                          %
                        </td>
                        <td>
                          <div className="row-actions">
                            <button
                              className="icon-button"
                              aria-label={`Move ${entryName(db, e)} up`}
                              disabled={index === 0}
                              onClick={() => {
                                const next = [...all];
                                [next[index - 1], next[index]] = [
                                  next[index],
                                  next[index - 1],
                                ];
                                void change(
                                  next.map((r, i) => ({
                                    ...r,
                                    displayOrder: i + 1,
                                  })),
                                  "Display order updated",
                                );
                              }}
                            >
                              <ArrowUp size={14} />
                            </button>
                            <span>{index + 1}</span>
                            <button
                              className="icon-button"
                              aria-label={`Move ${entryName(db, e)} down`}
                              disabled={index === all.length - 1}
                              onClick={() => {
                                const next = [...all];
                                [next[index + 1], next[index]] = [
                                  next[index],
                                  next[index + 1],
                                ];
                                void change(
                                  next.map((r, i) => ({
                                    ...r,
                                    displayOrder: i + 1,
                                  })),
                                  "Display order updated",
                                );
                              }}
                            >
                              <ArrowDown size={14} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <td className="details-cell">
                        {product
                          ? money(product.salePrice)
                          : categoryRecord?.name ||
                            e.description ||
                            e.link ||
                            "—"}
                      </td>
                    )}
                    <td>
                      <StatusToggle
                        status={e.status}
                        onChange={() =>
                          void change(
                            db[module].map((r) =>
                              r.id === e.id
                                ? {
                                    ...r,
                                    status:
                                      r.status === "Active"
                                        ? "Inactive"
                                        : "Active",
                                  }
                                : r,
                            ),
                            "Status updated",
                          )
                        }
                      />
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="icon-button"
                          aria-label={`View ${entryName(db, e)}`}
                          onClick={() => setPreview(e)}
                        >
                          <Eye size={16} />
                        </button>
                        <Link
                          className="icon-button"
                          aria-label={`Edit ${entryName(db, e)}`}
                          href={`/admin/${module}/edit/${e.id}`}
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          className="icon-button delete"
                          aria-label={`Delete ${entryName(db, e)}`}
                          onClick={() => setDeleting(e)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </DataTable>
          ) : (
            <EmptyState title={`No ${label.toLowerCase()} found`} />
          )}
        </fieldset>
        <Pagination
          page={currentPage}
          total={rows.length}
          size={PAGE_SIZE}
          onChange={setPage}
        />
      </section>
      {deleting && (
        <ConfirmModal
          title="Delete Item?"
          message={`Are you sure you want to delete “${entryName(db, deleting)}”? This cannot be undone.`}
          confirmLabel="Delete"
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            canDelete(db, module, deleting.id);
            await onChange(
              db[module].filter((e) => e.id !== deleting.id),
              "Item deleted",
            );
            setDeleting(null);
          }}
        />
      )}
      {preview && (
        <Modal title={entryName(db, preview)} onClose={() => setPreview(null)}>
          <EntryPreview entry={preview} db={db} />
          <div className="modal-actions">
            <Link
              className="button"
              href={`/admin/${module}/edit/${preview.id}`}
            >
              Edit item
            </Link>
          </div>
        </Modal>
      )}
    </>
  );
}
export function EntryPreview({ entry, db }: { entry: Entry; db: Database }) {
  const product = resolveEntry(db, entry);
  const item = product || entry;
  return (
    <div className="entry-preview">
      <Media
        src={entry.image || product?.image}
        alt={entryName(db, entry)}
        className="preview-hero"
      />
      {entry.video && (
        <Media
          src={entry.video}
          video
          alt={entry.title || "Product video"}
          className="preview-video"
        />
      )}
      <StatusToggle status={entry.status} />
      {item.price !== undefined && (
        <p>
          <strong>{money(item.salePrice)}</strong>{" "}
          <del>{money(item.price)}</del>
        </p>
      )}
      <p>{entry.description || product?.description || entry.text}</p>
      <dl>
        {[
          ["Product", product?.name],
          ["SKU", item.sku],
          [
            "Category",
            db.categories.find((c) => c.id === item.categoryId)?.name,
          ],
          ["Stock", item.stock],
          ["Location", entry.location],
          ["Rating", entry.rating],
          ["Link", entry.link],
          ["Button text", entry.buttonText],
        ]
          .filter(([, value]) => value !== undefined && value !== "")
          .map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
      </dl>
      {item.gallery?.length ? (
        <div className="upload-previews">
          {item.gallery.map((src) => (
            <Media key={src} src={src} alt={item.name} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
