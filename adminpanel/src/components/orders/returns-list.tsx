/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCcw,
  FilterX,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  ReturnRequest,
  ReturnStatus,
  returnStatuses,
  displayDate,
  commerceMoney,
} from "@/lib/commerce";
import { Modal } from "../ui";

interface ReturnsListProps {
  returns: ReturnRequest[];
  loading?: boolean;
  onUpdateStatus: (
    id: string,
    status: ReturnStatus,
    notes?: string,
  ) => Promise<void>;
  onToast: (msg: string) => void;
}

export function ReturnsList({
  returns,
  loading,
  onUpdateStatus,
  onToast,
}: ReturnsListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Selected return for view/update modal
  const [activeReturn, setActiveReturn] = useState<ReturnRequest | null>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<ReturnStatus>("Requested");
  const [actionNotes, setActionNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filteredReturns = useMemo(() => {
    return returns.filter((ret) => {
      // Search: Return ID, Order ID, Customer Name
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchId = ret.id.toLowerCase().includes(q);
        const matchOrder = ret.orderId.toLowerCase().includes(q);
        const matchCust = ret.customerName.toLowerCase().includes(q);
        const matchProd = ret.product.name.toLowerCase().includes(q);
        if (!matchId && !matchOrder && !matchCust && !matchProd) return false;
      }

      // Status filter
      if (statusFilter !== "All" && ret.status !== statusFilter) {
        return false;
      }

      // Date filter
      if (dateFilter !== "All") {
        const reqDate = new Date(ret.requestDate);
        const now = new Date();
        if (dateFilter === "Today") {
          if (reqDate.toDateString() !== now.toDateString()) return false;
        } else if (dateFilter === "7days") {
          const diffDays =
            (now.getTime() - reqDate.getTime()) / (1000 * 3600 * 24);
          if (diffDays > 7) return false;
        } else if (dateFilter === "30days") {
          const diffDays =
            (now.getTime() - reqDate.getTime()) / (1000 * 3600 * 24);
          if (diffDays > 30) return false;
        }
      }

      return true;
    });
  }, [returns, search, statusFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredReturns.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedReturns = filteredReturns.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setDateFilter("All");
    setPage(1);
  }

  async function handleStatusSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeReturn) return;
    setSaving(true);
    setError("");
    try {
      await onUpdateStatus(
        activeReturn.id,
        selectedStatus,
        actionNotes.trim() || undefined,
      );
      onToast(`Return ${activeReturn.id} marked as ${selectedStatus}`);
      setActiveReturn(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update return request status.");
    } finally {
      setSaving(false);
    }
  }

  async function quickAction(
    returnItem: ReturnRequest,
    nextStatus: ReturnStatus,
  ) {
    try {
      await onUpdateStatus(returnItem.id, nextStatus);
      onToast(`Return ${returnItem.id} updated to ${nextStatus}`);
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  if (loading) {
    return (
      <div className="panel" style={{ padding: "48px", textAlign: "center" }}>
        <p className="muted">Loading returns...</p>
      </div>
    );
  }

  return (
    <div className="list-panel list-page">
      <div className="page-heading">
        <div>
          <h1>Return & Refund Requests</h1>
          <p className="muted" style={{ marginTop: "4px" }}>
            Review, approve, reject and process returns and refunds
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="panel list-filters">
        <div
          className="filters"
        >
          <div className="search-input" style={{ flex: "1 1 260px" }}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search Return ID, Order ID, customer..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              aria-label="Search return requests"
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              flex: "1 1 300px",
            }}
          >
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by return status"
            >
              <option value="All">All Return Statuses</option>
              {returnStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by date range"
            >
              <option value="All">All Time</option>
              <option value="Today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>

            {(search || statusFilter !== "All" || dateFilter !== "All") && (
              <button
                type="button"
                className="button secondary"
                style={{
                  minHeight: "36px",
                  padding: "6px 14px",
                  fontSize: "var(--type-label)",
                }}
                onClick={resetFilters}
              >
                <FilterX size={14} />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      {paginatedReturns.length === 0 ? (
        <div
          className="panel empty-panel list-results"
        >
          <RotateCcw
            size={42}
            style={{ color: "var(--color-text-muted)", margin: "0 auto 16px" }}
          />
          <h3>No return requests found</h3>
          <p
            className="muted"
            style={{ maxWidth: "420px", margin: "8px auto 20px" }}
          >
            There are currently no return or refund requests matching your
            criteria.
          </p>
          <button
            type="button"
            className="button secondary"
            onClick={resetFilters}
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="panel list-results">
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Return ID</th>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Reason</th>
                  <th>Return Status</th>
                  <th>Request Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReturns.map((ret) => (
                  <tr key={ret.id}>
                    <td>
                      <strong
                        style={{
                          fontFamily: "var(--font-body)", fontVariantNumeric: "tabular-nums",
                          color: "var(--color-primary)",
                        }}
                      >
                        {ret.id}
                      </strong>
                    </td>
                    <td>
                      <Link
                        href={`/admin/orders/${ret.orderId}`}
                        className="table-link"
                        style={{ fontFamily: "var(--font-body)", fontVariantNumeric: "tabular-nums", fontWeight: 500 }}
                      >
                        {ret.orderId}
                      </Link>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 500 }}>
                          {ret.customerName}
                        </span>
                        <small className="muted">{ret.customerEmail}</small>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        {ret.product.image ? (
                          <img
                            src={ret.product.image}
                            alt={ret.product.name}
                            style={{
                              width: "36px",
                              height: "36px",
                              objectFit: "cover",
                              borderRadius: "4px",
                              border: "1px solid var(--color-border)",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              background: "var(--color-surface-secondary)",
                              borderRadius: "4px",
                            }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: 500, fontSize: "var(--type-small)" }}>
                            {ret.product.name}
                          </div>
                          <small className="muted">{ret.product.sku}</small>
                        </div>
                      </div>
                    </td>
                    <td>{ret.quantity}</td>
                    <td style={{ maxWidth: "220px", fontSize: "var(--type-small)" }}>
                      <span
                        title={ret.reason}
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {ret.reason}
                      </span>
                    </td>
                    <td>
                      <ReturnStatusBadge status={ret.status} />
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "var(--type-small)",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {displayDate(ret.requestDate)}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "8px" }}>
                        {ret.status === "Requested" && (
                          <>
                            <button
                              type="button"
                              className="button"
                              style={{
                                minHeight: "28px",
                                padding: "2px 8px",
                                fontSize: "var(--type-badge)",
                                background: "var(--color-success)",
                                borderColor: "var(--color-success)",
                              }}
                              title="Approve Return"
                              onClick={() => quickAction(ret, "Approved")}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="button secondary"
                              style={{
                                minHeight: "28px",
                                padding: "2px 8px",
                                fontSize: "var(--type-badge)",
                                color: "var(--color-error)",
                                borderColor: "var(--color-border)",
                              }}
                              title="Reject Return"
                              onClick={() => quickAction(ret, "Rejected")}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          className="button secondary"
                          style={{
                            minHeight: "28px",
                            padding: "2px 10px",
                            fontSize: "var(--type-badge)",
                          }}
                          onClick={() => {
                            setActiveReturn(ret);
                            setSelectedStatus(ret.status);
                            setActionNotes(ret.notes || "");
                            setError("");
                          }}
                        >
                          <Eye size={12} />
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            className="pagination"
          >
            <span className="muted" style={{ fontSize: "var(--type-small)" }}>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredReturns.length)} of{" "}
              {filteredReturns.length} requests
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                className="icon-button"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              <span style={{ fontSize: "var(--type-small)", padding: "0 8px" }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                className="icon-button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View & Update Return Modal */}
      {activeReturn && (
        <Modal
          title={`Return Request ${activeReturn.id}`}
          onClose={() => setActiveReturn(null)}
        >
          <form
            onSubmit={handleStatusSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {error && (
              <div className="error-text" role="alert">
                {error}
              </div>
            )}

            <div
              style={{
                background: "var(--color-surface-secondary)",
                padding: "14px 16px",
                borderRadius: "8px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                fontSize: "var(--type-small)",
              }}
            >
              <div>
                <span className="muted">Order:</span>{" "}
                <Link
                  href={`/admin/orders/${activeReturn.orderId}`}
                  style={{ color: "var(--color-primary)", fontWeight: 600 }}
                >
                  {activeReturn.orderId}
                </Link>
              </div>
              <div>
                <span className="muted">Request Date:</span>{" "}
                {displayDate(activeReturn.requestDate, true)}
              </div>
              <div>
                <span className="muted">Customer:</span>{" "}
                <strong>{activeReturn.customerName}</strong>
              </div>
              <div>
                <span className="muted">Email:</span>{" "}
                {activeReturn.customerEmail}
              </div>
              <div
                style={{
                  gridColumn: "1 / -1",
                  borderTop: "1px solid var(--color-border)",
                  paddingTop: "8px",
                }}
              >
                <span className="muted">Returned Product:</span>{" "}
                <strong>
                  {activeReturn.product.name} ({activeReturn.quantity} unit)
                </strong>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <span className="muted">Reason:</span>{" "}
                <em>&ldquo;{activeReturn.reason}&rdquo;</em>
              </div>
            </div>

            <div>
              <label
                htmlFor="return-status-select"
                className="form-label"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500,
                }}
              >
                Update Return Status *
              </label>
              <select
                id="return-status-select"
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as ReturnStatus)
                }
                style={{ width: "100%" }}
              >
                {returnStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="return-notes"
                className="form-label"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500,
                }}
              >
                Status Notes / Resolution
              </label>
              <textarea
                id="return-notes"
                placeholder="Enter internal inspection, courier, or refund remarks..."
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={3}
                style={{ width: "100%" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "12px",
              }}
            >
              <button
                type="button"
                className="button secondary"
                onClick={() => setActiveReturn(null)}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="button" disabled={saving}>
                {saving ? "Updating..." : "Save Return Status"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export function ReturnStatusBadge({ status }: { status: ReturnStatus }) {
  let styleClass = "badge-neutral";
  if (status === "Approved" || status === "Refunded")
    styleClass = "badge-success";
  else if (status === "Picked Up" || status === "Received")
    styleClass = "badge-gold";
  else if (status === "Requested") styleClass = "badge-info";
  else if (status === "Rejected") styleClass = "badge-danger";

  return <span className={`status-badge ${styleClass}`}>{status}</span>;
}
