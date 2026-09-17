"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import {
  type Database,
  type Entry,
  type Module,
  modules,
  validateEntry,
  money,
} from "@/lib/admin-data";
import { ImageUploader, ProductSelector, Media } from "./ui";

type Field = {
  key: keyof Entry;
  label: string;
  type?: "textarea" | "number" | "image" | "gallery" | "video" | "checkbox";
  required?: boolean;
};
const fields: Record<Module, Field[]> = {
  products: [
    { key: "name", label: "Product name", required: true },
    { key: "sku", label: "SKU", required: true },
    {
      key: "description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    {
      key: "price",
      label: "Original price (₹)",
      type: "number",
      required: true,
    },
    {
      key: "salePrice",
      label: "Sale price (₹)",
      type: "number",
      required: true,
    },
    { key: "stock", label: "Stock", type: "number", required: true },
    { key: "image", label: "Product image", type: "image", required: true },
    { key: "hoverImage", label: "Hover image", type: "image" },
    { key: "gallery", label: "Gallery images", type: "gallery" },
  ],
  categories: [
    { key: "name", label: "Category name", required: true },
    { key: "image", label: "Category image", type: "image" },
  ],
  ribbons: [
    { key: "text", label: "Announcement text", required: true },
    { key: "link", label: "Link", required: true },
  ],
  "local-brand": [
    { key: "title", label: "Title", required: true },
    {
      key: "description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    { key: "image", label: "Image", type: "image", required: true },
    { key: "link", label: "Link", required: true },
  ],
  "new-launch": [
    { key: "title", label: "Section title" },
    { key: "image", label: "Optional campaign image", type: "image" },
    { key: "buttonText", label: "Button text" },
    { key: "link", label: "Link" },
  ],
  "royally-crafted": [
    {
      key: "displayOrder",
      label: "Display order",
      type: "number",
      required: true,
    },
  ],
  "shop-by-style": [
    { key: "name", label: "Style name", required: true },
    { key: "image", label: "Image", type: "image", required: true },
    { key: "buttonText", label: "Button text", required: true },
    { key: "link", label: "Link", required: true },
  ],
  "pure-silver": [
    { key: "title", label: "Section title" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "image", label: "Section image", type: "image" },
    { key: "buttonText", label: "CTA text" },
    { key: "link", label: "CTA link" },
  ],
  "best-sellers": [
    {
      key: "displayOrder",
      label: "Display order",
      type: "number",
      required: true,
    },
  ],
  "trending-looks": [
    { key: "title", label: "Title", required: true },
    { key: "video", label: "Product video", type: "video", required: true },
    { key: "image", label: "Thumbnail", type: "image", required: true },
  ],
  reviews: [
    { key: "name", label: "Customer name", required: true },
    { key: "location", label: "Location", required: true },
    { key: "image", label: "Customer image", type: "image" },
    { key: "rating", label: "Rating (1–5)", type: "number", required: true },
    { key: "text", label: "Review text", type: "textarea", required: true },
    { key: "verified", label: "Verified buyer", type: "checkbox" },
  ],
};
export function EntryForm({
  module,
  db,
  existing,
  onSave,
}: {
  module: Module;
  db: Database;
  existing?: Entry;
  onSave: (entry: Entry) => Promise<void>;
}) {
  const [entry, setEntry] = useState<Entry>(() =>
    existing
      ? { ...existing }
      : {
          id: crypto.randomUUID(),
          status: "Active",
          displayOrder: db[module].length + 1,
          rating: 5,
        },
  );
  const [busy, setBusy] = useState(false);
  const [uploads, setUploads] = useState<Record<string, boolean>>({});
  const uploading = Object.values(uploads).some(Boolean);
  const [error, setError] = useState("");
  const title = modules.find((m) => m[0] === module)![1];
  const productRef = [
    "new-launch",
    "royally-crafted",
    "pure-silver",
    "best-sellers",
    "trending-looks",
  ].includes(module);
  const selected = db.products.find((p) => p.id === entry.productId);
  const set = (key: keyof Entry, value: unknown) =>
    setEntry((prev) => ({ ...prev, [key]: value }));
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (uploading) return;
    setError("");
    try {
      for (const field of fields[module])
        if (
          field.required &&
          (entry[field.key] === undefined ||
            entry[field.key] === "" ||
            (typeof entry[field.key] === "string" &&
              !(entry[field.key] as string).trim()))
        )
          throw new Error(`${field.label} is required.`);
      if (
        module === "categories" &&
        db.categories.some(
          (c) =>
            c.id !== entry.id &&
            c.name?.toLowerCase() === entry.name?.trim().toLowerCase(),
        )
      )
        throw new Error("This category already exists.");
      validateEntry(db, module, entry);
      setBusy(true);
      await onSave({
        ...entry,
        createdAt: entry.createdAt || new Date().toISOString(),
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const renderField = (field: Field) => {
    const label = `${field.label}${field.required ? " *" : ""}`;
    if (["image", "video", "gallery"].includes(field.type || ""))
      return (
        <div
          className={`field ${module === "products" ? "" : "full"}`}
          key={field.key}
        >
          <span className="field-label">{label}</span>
          <ImageUploader
            onBusyChange={(value) =>
              setUploads((current) => ({
                ...current,
                [field.key]: value,
              }))
            }
            value={
              field.type === "gallery"
                ? entry.gallery || []
                : entry[field.key]
                  ? [String(entry[field.key])]
                  : []
            }
            onChange={(urls) =>
              set(field.key, field.type === "gallery" ? urls : urls[0] || "")
            }
            multiple={field.type === "gallery"}
            video={field.type === "video"}
          />
        </div>
      );
    if (field.type === "checkbox")
      return (
        <label key={field.key} className="checkbox-field full">
          <input
            type="checkbox"
            checked={Boolean(entry[field.key])}
            onChange={(e) => set(field.key, e.target.checked)}
          />
          {label}
        </label>
      );
    return (
      <label
        className={`field ${field.type === "textarea" ? "full" : ""}`}
        key={field.key}
      >
        {label}
        {field.type === "textarea" ? (
          <textarea
            required={field.required}
            rows={4}
            value={String(entry[field.key] ?? "")}
            onChange={(e) => set(field.key, e.target.value)}
          />
        ) : (
          <input
            required={field.required}
            type={field.type === "number" ? "number" : "text"}
            min={field.key === "rating" || field.key === "displayOrder" ? 1 : 0}
            max={field.key === "rating" ? 5 : undefined}
            step={
              field.key === "price" || field.key === "salePrice" ? "0.01" : 1
            }
            value={String(entry[field.key] ?? "")}
            onChange={(e) =>
              set(
                field.key,
                field.type === "number"
                  ? e.target.value === ""
                    ? undefined
                    : Number(e.target.value)
                  : e.target.value,
              )
            }
          />
        )}
      </label>
    );
  };
  return (
    <>
      {module !== "products" && (
        <Link className="back-link" href={`/admin/${module}`}>
          <ArrowLeft size={16} /> Back to {title.toLowerCase()}
        </Link>
      )}
      <div
        className={`page-heading ${module === "products" ? "product-editor-heading" : ""}`}
      >
        <div>
          {module !== "products" && (
            <div className="eyebrow">CURATE YOUR STORE</div>
          )}
          <h1>
            {existing ? "Edit" : "Add"}{" "}
            {title === "Products"
              ? "product"
              : title === "Categories"
                ? "category"
                : title.toLowerCase()}
          </h1>
          <p>Thoughtful details make all the difference.</p>
        </div>
        {module === "products" && (
          <Link
            className="back-link button secondary"
            href={`/admin/${module}`}
          >
            <ArrowLeft size={16} /> Back to {title.toLowerCase()}
          </Link>
        )}
      </div>
      <form
        onSubmit={submit}
        className={`editor-layout ${module === "products" ? "product-editor" : ""}`}
      >
        <div className="editor-main">
          <div className="panel form-panel">
            <h2>
              {productRef
                ? "Product & section details"
                : module === "products"
                  ? "Product Details"
                  : "Details"}
            </h2>
            <div className="form-grid">
              {productRef && (
                <div className="field full">
                  <span className="field-label">
                    Select existing product{module !== "pure-silver" && " *"}
                  </span>
                  <ProductSelector
                    db={db}
                    value={entry.productId || ""}
                    onChange={(id) =>
                      setEntry((e) => ({
                        ...e,
                        productId: id || undefined,
                        categoryId: undefined,
                      }))
                    }
                  />
                </div>
              )}
              {(module === "products" || module === "pure-silver") && (
                <label className="field full">
                  {module === "pure-silver"
                    ? "Or select a category"
                    : "Category *"}
                  <select
                    required={module === "products"}
                    value={entry.categoryId || ""}
                    onChange={(e) =>
                      setEntry((p) => ({
                        ...p,
                        categoryId: e.target.value || undefined,
                        ...(module === "pure-silver"
                          ? { productId: undefined }
                          : {}),
                      }))
                    }
                  >
                    <option value="">Choose a category</option>
                    {db.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {fields[module]
                .filter(
                  (field) =>
                    module !== "products" ||
                    !["image", "hoverImage", "gallery"].includes(field.key),
                )
                .map(renderField)}
              {module === "products" && (
                <div className="field">
                  <span className="field-label">Discount (calculated)</span>
                  <output className="computed-field">
                    {entry.price && entry.salePrice !== undefined
                      ? Math.max(
                          0,
                          Math.round((1 - entry.salePrice / entry.price) * 100),
                        )
                      : 0}
                    %
                  </output>
                </div>
              )}
            </div>
          </div>
          {module === "products" && (
            <section className="panel form-panel">
              <h2>Product Images</h2>
              <div className="form-grid">
                {fields.products
                  .filter((field) =>
                    ["image", "hoverImage"].includes(field.key),
                  )
                  .map(renderField)}
              </div>
            </section>
          )}
        </div>
        <aside className="editor-aside">
          <div className="panel form-panel">
            <h2>Publishing</h2>
            <label className="field">
              Status
              <select
                value={entry.status}
                onChange={(e) => set("status", e.target.value)}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </label>
            <p className="help-text">
              Active items are included in your collection. Use inactive to keep
              an item as a draft.
            </p>
            {error && (
              <p className="error-text" role="alert">
                {error}
              </p>
            )}
            <button
              className="button full-button"
              disabled={busy || uploading}
              type="submit"
            >
              <Save size={16} />
              {uploading
                ? "Uploading…"
                : busy
                  ? "Saving…"
                  : existing
                    ? "Save changes"
                    : module === "products"
                      ? "Save product"
                      : "Save item"}
            </button>
            <Link
              className="button secondary full-button"
              href={`/admin/${module}`}
            >
              Cancel
            </Link>
          </div>
          {module === "products" && (
            <section className="panel form-panel">
              <h2>Gallery Images</h2>
              {fields.products
                .filter((field) => field.key === "gallery")
                .map(renderField)}
            </section>
          )}
          {selected && (
            <div className="panel form-panel">
              <h2>Linked product</h2>
              <Media
                src={selected.image}
                alt={selected.name}
                className="linked-image"
              />
              <h3 className="product-title">{selected.name}</h3>
              <p>{money(selected.salePrice)}</p>
              <small>
                Product details update automatically from your catalog.
              </small>
            </div>
          )}
        </aside>
      </form>
    </>
  );
}
