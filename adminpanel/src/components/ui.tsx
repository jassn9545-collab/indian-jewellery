/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Search,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ImageIcon,
  LoaderCircle,
} from "lucide-react";
import { type Database, money } from "@/lib/admin-data";
import { uploadService } from "@/lib/storage";

export function useMedia(src?: string) {
  const [resolved, setResolved] = useState("");
  useEffect(() => {
    if (!src?.startsWith("media:")) return;
    let url = "";
    let active = true;
    uploadService
      .read(src)
      .then((blob) => {
        if (blob && active) {
          url = URL.createObjectURL(blob);
          setResolved(url);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [src]);
  return src?.startsWith("media:") ? resolved : src;
}
export function Media({
  src,
  alt = "",
  video = false,
  className = "",
}: {
  src?: string;
  alt?: string;
  video?: boolean;
  className?: string;
}) {
  const url = useMedia(src);
  if (!url)
    return (
      <span className={`media-placeholder ${className}`}>
        <ImageIcon size={20} />
        <span className="sr-only">No image</span>
      </span>
    );
  return video ? (
    <video
      className={className}
      src={url}
      controls
      preload="metadata"
      aria-label={alt}
    />
  ) : (
    <img className={className} src={url} alt={alt} />
  );
}
export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="search-input">
      <Search size={17} />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className="icon-button"
          aria-label="Clear search"
          onClick={() => onChange("")}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
export function FilterDropdown({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
export function StatusToggle({
  status,
  onChange,
}: {
  status: string;
  onChange?: () => void;
}) {
  return onChange ? (
    <button
      className={`status ${status.toLowerCase()}`}
      type="button"
      role="switch"
      aria-checked={status === "Active"}
      aria-label={`Status: ${status}. Toggle status`}
      onClick={onChange}
    >
      <span />
      {status}
    </button>
  ) : (
    <span className={`status ${status.toLowerCase()}`}>
      <span />
      {status}
    </span>
  );
}
export function Pagination({
  page,
  total,
  size,
  onChange,
}: {
  page: number;
  total: number;
  size: number;
  onChange: (p: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / size));
  return (
    <div className="pagination">
      <span>
        {total ? (page - 1) * size + 1 : 0}–{Math.min(page * size, total)} of{" "}
        {total} items
      </span>
      <nav aria-label="Pagination">
        <button
          className="icon-button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1)
          .map((p, i, a) => (
            <span key={p}>
              {i > 0 && p > a[i - 1] + 1 && <span>…</span>}
              <button
                className={p === page ? "page-number selected" : "page-number"}
                aria-current={p === page ? "page" : undefined}
                onClick={() => onChange(p)}
              >
                {p}
              </button>
            </span>
          ))}
        <button
          className="icon-button"
          aria-label="Next page"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    const prior = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    el?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      el?.close();
      document.body.style.overflow = overflow;
      prior?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-heading">
        <h2>{title}</h2>
        <button
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function ConfirmModal({
  title,
  message,
  confirmLabel,
  onClose,
  onConfirm,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <Modal
      title={title}
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <p>{message}</p>
      {error && (
        <p role="alert" className="error-text">
          {error}
        </p>
      )}
      <div className="modal-actions">
        <button className="button secondary" disabled={busy} onClick={onClose}>
          Cancel
        </button>
        <button
          className="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onConfirm();
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Please wait…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <Search size={28} />
      <h3>{title}</h3>
      <p>Try changing your filters or add your first item.</p>
      {children}
    </div>
  );
}
export function LoadingState() {
  return (
    <div className="loading-state" role="status">
      <LoaderCircle className="spin" size={24} /> Loading your workspace…
    </div>
  );
}
export function ErrorState({
  message,
  retry,
}: {
  message: string;
  retry: () => void;
}) {
  return (
    <div className="empty-state" role="alert">
      <h3>Something went wrong</h3>
      <p>{message}</p>
      <button className="button secondary" onClick={retry}>
        Try again
      </button>
    </div>
  );
}
export function DataTable({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
export function ImageUploader({
  value,
  onChange,
  multiple = false,
  video = false,
  onBusyChange,
}: {
  value: string[];
  onChange: (values: string[]) => void;
  multiple?: boolean;
  video?: boolean;
  onBusyChange?: (busy: boolean) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  async function upload(files: FileList | null) {
    if (!files?.length || busy) return;
    setBusy(true);
    onBusyChange?.(true);
    setError("");
    try {
      const selected = Array.from(files);
      if (!multiple && selected.length > 1)
        throw new Error("Choose one file at a time.");
      if (multiple && value.length + selected.length > 10)
        throw new Error("Use up to 10 gallery images.");
      const urls = await Promise.all(
        selected.map((file) => uploadService.upload(file, video)),
      );
      onChange(multiple ? [...value, ...urls] : urls);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      onBusyChange?.(false);
      if (input.current) input.current.value = "";
    }
  }
  return (
    <div className="uploader">
      <div
        className={`dropzone ${drag ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void upload(e.dataTransfer.files);
        }}
      >
        <input
          ref={input}
          className="sr-only"
          type="file"
          tabIndex={-1}
          accept={
            video ? "video/mp4,video/webm" : "image/jpeg,image/png,image/webp"
          }
          multiple={multiple}
          onChange={(e) => void upload(e.target.files)}
        />
        <button
          type="button"
          className="upload-button"
          disabled={busy}
          onClick={() => input.current?.click()}
        >
          {busy ? (
            <LoaderCircle className="spin" size={22} />
          ) : (
            <Upload size={22} />
          )}
          <strong>
            {busy
              ? "Saving file…"
              : value.length && !multiple
                ? "Replace file"
                : "Click to upload or drag and drop"}
          </strong>
          <span>
            {video
              ? "MP4 or WEBM · up to 30 MB"
              : "JPG, PNG or WEBP · up to 5 MB"}
          </span>
        </button>
      </div>
      {error && (
        <p role="alert" className="error-text">
          {error}
        </p>
      )}
      <div className="upload-previews">
        {value.map((src, i) => (
          <div key={src}>
            <Media src={src} alt={`Upload ${i + 1}`} video={video} />
            <div className="preview-actions">
              {multiple && (
                <>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`Move image ${i + 1} earlier`}
                    disabled={i === 0}
                    onClick={() => {
                      const next = [...value];
                      [next[i - 1], next[i]] = [next[i], next[i - 1]];
                      onChange(next);
                    }}
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`Move image ${i + 1} later`}
                    disabled={i === value.length - 1}
                    onClick={() => {
                      const next = [...value];
                      [next[i + 1], next[i]] = [next[i], next[i + 1]];
                      onChange(next);
                    }}
                  >
                    <ArrowDown size={14} />
                  </button>
                </>
              )}
              <button
                type="button"
                className="icon-button"
                aria-label={`Remove file ${i + 1}`}
                onClick={() =>
                  onChange(value.filter((_, index) => index !== i))
                }
              >
                <X size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export function ProductSelector({
  db,
  value,
  onChange,
}: {
  db: Database;
  value: string;
  onChange: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const selected = db.products.find((p) => p.id === value);
  return (
    <div className="product-selector">
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search products by name or SKU"
      />
      {selected && (
        <div className="selected-product">
          <Media src={selected.image} alt={selected.name} />
          <span>
            <strong>{selected.name}</strong>
            <small>{money(selected.salePrice)} · Selected product</small>
          </span>
          <button
            type="button"
            className="icon-button"
            aria-label="Clear selected product"
            onClick={() => onChange("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
      <div className="product-options">
        {db.products
          .filter((p) =>
            `${p.name} ${p.sku}`.toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 30)
          .map((p) => (
            <button
              type="button"
              key={p.id}
              className={
                p.id === value ? "product-option chosen" : "product-option"
              }
              aria-pressed={p.id === value}
              onClick={() => onChange(p.id)}
            >
              <Media src={p.image} alt="" />
              <span>
                <strong>{p.name}</strong>
                <small>
                  {db.categories.find((c) => c.id === p.categoryId)?.name} ·{" "}
                  {money(p.salePrice)}
                </small>
              </span>
              <span className="radio-indicator" />
            </button>
          ))}
        {!db.products.some((p) =>
          `${p.name} ${p.sku}`.toLowerCase().includes(query.toLowerCase()),
        ) && <p>No products found.</p>}
      </div>
    </div>
  );
}
