"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Megaphone,
  ExternalLink,
} from "lucide-react";
import {
  type Database,
  type Entry,
  entryName,
  canDelete,
} from "@/lib/admin-data";
import {
  SearchInput,
  FilterDropdown,
  Pagination,
  StatusToggle,
  ConfirmModal,
  EmptyState,
  Modal,
} from "./ui";
import { EntryPreview } from "./entry-list";

const PAGE_SIZE = 10;

export function RibbonList({
  db,
  onChange,
}: {
  db: Database;
  onChange: (rows: Entry[], message: string) => Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<Entry | null>(null);
  const [preview, setPreview] = useState<Entry | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search);
      setPage(1);
    }, 250);
    return () => clearTimeout(t);
  }, [search]);

  const all = db.ribbons;
  const rows = all.filter((e) => {
    const text = [e.text, e.link].join(" ").toLowerCase();
    return (
      text.includes(query.toLowerCase()) && (!status || e.status === status)
    );
  });

  const currentPage = Math.min(page, Math.max(1, Math.ceil(rows.length / PAGE_SIZE)));
  const visible = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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

  return (
    <>
      {/* Page heading */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">HOMEPAGE MANAGEMENT</div>
          <h1>Ribbon Bar</h1>
          <p>Curate what your customers discover.</p>
        </div>
        <Link className="button" href="/admin/ribbons/add">
          <Plus size={15} /> Add item
        </Link>
      </div>

      {/* Main card */}
      <section className="panel ribbon-panel">
        {/* Card top row */}
        <div className="list-heading">
          <h2>
            All ribbon bar{" "}
            <span className="count-badge">{rows.length}</span>
          </h2>
          <span className="muted">Manage your collection</span>
        </div>

        {/* Filters */}
        <div className="filters">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search ribbon bar..."
          />
          <FilterDropdown
            label="All statuses"
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="error-text panel-error" role="alert">
            {error}
          </p>
        )}

        {/* Table / Empty state */}
        <fieldset className="table-fieldset" disabled={busy}>
          {rows.length ? (
            <div className="table-scroll ribbon-table-scroll">
              <table className="ribbon-table">
                <thead>
                  <tr>
                    <th scope="col">Announcement</th>
                    <th scope="col">Link</th>
                    <th scope="col">Status</th>
                    <th scope="col">Display Order</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((e, i) => (
                    <tr key={e.id} className="ribbon-row">
                      {/* Announcement */}
                      <td>
                        <div className="ribbon-announcement-cell">
                          <span className="ribbon-icon-wrap" aria-hidden="true">
                            <Megaphone size={14} />
                          </span>
                          <span className="ribbon-text-stack">
                            <strong>{e.text || "—"}</strong>
                            {e.description && (
                              <small>{e.description}</small>
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Link */}
                      <td>
                        {e.link ? (
                          <span className="ribbon-link-cell">
                            <span className="ribbon-link-text">{e.link}</span>
                            <ExternalLink size={12} className="ribbon-external-icon" aria-hidden="true" />
                          </span>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        <StatusToggle
                          status={e.status}
                          onChange={() =>
                            void change(
                              db.ribbons.map((r) =>
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

                      {/* Display Order */}
                      <td>
                        <span className="ribbon-order-badge">
                          {(currentPage - 1) * PAGE_SIZE + i + 1}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="row-actions">
                          <button
                            className="icon-button"
                            aria-label={`View ${e.text || "ribbon"}`}
                            onClick={() => setPreview(e)}
                          >
                            <Eye size={15} />
                          </button>
                          <Link
                            className="icon-button"
                            aria-label={`Edit ${e.text || "ribbon"}`}
                            href={`/admin/ribbons/edit/${e.id}`}
                          >
                            <Pencil size={14} />
                          </Link>
                          <button
                            className="icon-button delete"
                            aria-label={`Delete ${e.text || "ribbon"}`}
                            onClick={() => setDeleting(e)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="ribbon-empty">
              <EmptyState title="No ribbon announcements yet">
                <p className="ribbon-empty-desc">
                  Add your first announcement to display promotional content on the storefront.
                </p>
                <Link className="button" href="/admin/ribbons/add">
                  <Plus size={15} /> Add item
                </Link>
              </EmptyState>
            </div>
          )}
        </fieldset>

        {/* Pagination */}
        <Pagination
          page={currentPage}
          total={rows.length}
          size={PAGE_SIZE}
          onChange={setPage}
        />
      </section>

      {/* Delete confirm modal */}
      {deleting && (
        <ConfirmModal
          title="Delete Ribbon?"
          message={`Are you sure you want to delete "${deleting.text || "this ribbon"}"? This cannot be undone.`}
          confirmLabel="Delete"
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            canDelete(db, "ribbons", deleting.id);
            await onChange(
              db.ribbons.filter((e) => e.id !== deleting.id),
              "Item deleted",
            );
            setDeleting(null);
          }}
        />
      )}

      {/* Preview modal */}
      {preview && (
        <Modal
          title={entryName(db, preview)}
          onClose={() => setPreview(null)}
        >
          <EntryPreview entry={preview} db={db} />
          <div className="modal-actions">
            <Link
              className="button"
              href={`/admin/ribbons/edit/${preview.id}`}
            >
              Edit item
            </Link>
          </div>
        </Modal>
      )}
    </>
  );
}
