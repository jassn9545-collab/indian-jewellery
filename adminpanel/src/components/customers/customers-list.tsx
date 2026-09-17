/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  Trash2,
  Users,
  UserCheck,
  UserPlus,
  IndianRupee,
  FilterX,
  User,
} from "lucide-react";
import {
  CustomerRecord,
  CustomerStatus,
  customerStatuses,
  customerStats,
  commerceMoney,
  displayDate,
  Order,
} from "@/lib/commerce";
import { Modal, ConfirmModal } from "../ui";

interface CustomersListProps {
  customers: CustomerRecord[];
  orders: Order[];
  loading?: boolean;
  onUpdateCustomer: (
    id: string,
    update: Partial<CustomerRecord>,
  ) => Promise<void>;
  onDeleteCustomer: (id: string) => Promise<void>;
  onToast: (msg: string) => void;
}

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  let styleClass = "badge-neutral";
  if (status === "Active") styleClass = "badge-success";
  else if (status === "New") styleClass = "badge-gold";
  return <span className={`status-badge ${styleClass}`}>{status}</span>;
}

export function CustomersList({
  customers,
  orders,
  loading,
  onUpdateCustomer,
  onDeleteCustomer,
  onToast,
}: CustomersListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Edit Modal State
  const [editingCustomer, setEditingCustomer] = useState<CustomerRecord | null>(
    null,
  );
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editStatus, setEditStatus] = useState<CustomerStatus>("Active");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete Modal State
  const [deletingCustomer, setDeletingCustomer] =
    useState<CustomerRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Summary Metrics
  const summary = useMemo(() => {
    const totalCustomers = customers.length;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const newCustomers = customers.filter(
      (c) => c.status === "New" || new Date(c.joinedDate) >= thirtyDaysAgo,
    ).length;

    const activeCustomers = customers.filter(
      (c) => c.status === "Active",
    ).length;

    // Total spent across all customers from valid orders
    const totalSpentPaise = orders.reduce((sum, o) => {
      if (
        ["Paid", "Delivered"].includes(o.payment.status) ||
        [
          "Delivered",
          "Confirmed",
          "Processing",
          "Shipped",
          "Out for Delivery",
        ].includes(o.status)
      ) {
        return sum + (o.payment.amount || 0);
      }
      return sum;
    }, 0);

    return {
      totalCustomers,
      newCustomers,
      activeCustomers,
      totalSpent: commerceMoney(totalSpentPaise),
    };
  }, [customers, orders]);

  // Pre-calculate order stats map for performance
  const customerStatsMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof customerStats>>();
    for (const c of customers) {
      map.set(c.id, customerStats(c, orders));
    }
    return map;
  }, [customers, orders]);

  // Filter logic
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      // Text search: Name, Email, Phone
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = customer.name.toLowerCase().includes(q);
        const matchesEmail = customer.email.toLowerCase().includes(q);
        const matchesPhone = customer.phone.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone) {
          return false;
        }
      }

      // Customer Status filter
      if (statusFilter !== "All" && customer.status !== statusFilter) {
        return false;
      }

      // Date Range filter
      if (dateFilter !== "All") {
        const joined = new Date(customer.joinedDate);
        const now = new Date();
        if (dateFilter === "Today") {
          if (joined.toDateString() !== now.toDateString()) return false;
        } else if (dateFilter === "Last 7 Days") {
          const past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (joined < past) return false;
        } else if (dateFilter === "Last 30 Days") {
          const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (joined < past) return false;
        } else if (dateFilter === "This Month") {
          if (
            joined.getMonth() !== now.getMonth() ||
            joined.getFullYear() !== now.getFullYear()
          ) {
            return false;
          }
        }
      }

      return true;
    });
  }, [customers, search, statusFilter, dateFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / pageSize),
  );
  const currentPage = Math.min(page, totalPages);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setDateFilter("All");
    setPage(1);
  }

  function startEdit(customer: CustomerRecord) {
    setEditingCustomer(customer);
    setEditName(customer.name);
    setEditPhone(customer.phone);
    setEditStatus(customer.status);
    setEditError("");
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCustomer) return;
    setSavingEdit(true);
    setEditError("");
    try {
      await onUpdateCustomer(editingCustomer.id, {
        name: editName.trim(),
        phone: editPhone.trim(),
        status: editStatus,
      });
      onToast(`Customer ${editName} updated successfully`);
      setEditingCustomer(null);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to update customer");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deletingCustomer) return;
    setDeleting(true);
    try {
      await onDeleteCustomer(deletingCustomer.id);
      onToast(`Customer ${deletingCustomer.name} deleted successfully`);
      setDeletingCustomer(null);
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Failed to delete customer");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="panel" style={{ padding: "48px", textAlign: "center" }}>
        <p className="muted">Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="list-panel list-page">
      {/* Top Page Heading */}
      <div className="page-heading">
        <div>
          <h1>Customers</h1>
          <p className="muted" style={{ marginTop: "4px" }}>
            Manage and track all customers
          </p>
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <div
        className="stat-grid list-summary"
      >
        <div className="stat-card">
          <div className="stat-label">
            <span>Total Customers</span>
            <Users size={18} />
          </div>
          <div className="stat-value">{summary.totalCustomers}</div>
          <small className="muted">Registered customer accounts</small>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <span>New Customers</span>
            <UserPlus size={18} />
          </div>
          <div className="stat-value">{summary.newCustomers}</div>
          <small className="muted">Joined recently</small>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <span>Active Customers</span>
            <UserCheck size={18} />
          </div>
          <div className="stat-value">{summary.activeCustomers}</div>
          <small className="muted">Frequent & active shoppers</small>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <span>Total Spent</span>
            <IndianRupee size={18} />
          </div>
          <div className="stat-value" style={{ fontSize: "var(--type-section)" }}>
            {summary.totalSpent}
          </div>
          <small className="muted">Cumulative customer revenue</small>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="panel list-filters">
        <div
          className="filters"
        >
          <div className="search-input" style={{ flex: "1 1 260px" }}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search customer name, email, or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              aria-label="Search customers"
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
              aria-label="Filter by customer status"
            >
              <option value="All">All Customer Statuses</option>
              {customerStatuses.map((s) => (
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
              <option value="All">All Registration Dates</option>
              <option value="Today">Today</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Month">This Month</option>
            </select>

            {(search || statusFilter !== "All" || dateFilter !== "All") && (
              <button
                type="button"
                className="button secondary"
                onClick={resetFilters}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "var(--type-small)",
                }}
              >
                <FilterX size={14} />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Customers Table */}
      {filteredCustomers.length === 0 ? (
        <div
          className="panel empty-panel list-results"
        >
          <Users
            size={40}
            style={{
              color: "var(--color-text-muted)",
              margin: "0 auto 12px",
            }}
          />
          <h3>No customers found</h3>
          <p className="muted" style={{ margin: "6px auto 16px" }}>
            No customers match your current search and filter parameters.
          </p>
          <button
            type="button"
            className="button secondary"
            onClick={resetFilters}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="panel list-results">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Total Orders</th>
                  <th>Total Spent</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.map((customer) => {
                  const stats = customerStatsMap.get(customer.id) || {
                    totalOrders: 0,
                    totalSpent: 0,
                  };
                  const initials = customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  return (
                    <tr key={customer.id}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          {customer.avatar ? (
                            <img
                              src={customer.avatar}
                              alt={customer.name}
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "1px solid var(--color-border)",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                background: "var(--color-surface-secondary)",
                                color: "var(--color-primary)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 600,
                                fontSize: "var(--type-small)",
                                border: "1px solid var(--color-border)",
                              }}
                            >
                              {initials || <User size={16} />}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "var(--type-small)" }}>
                              {customer.name}
                            </div>
                            <small className="muted">{customer.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{customer.phone || "—"}</td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            background: "var(--color-surface-secondary)",
                            fontSize: "var(--type-small)",
                            fontWeight: 600,
                          }}
                        >
                          {stats.totalOrders}{" "}
                          {stats.totalOrders === 1 ? "order" : "orders"}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {commerceMoney(stats.totalSpent)}
                      </td>
                      <td>
                        <CustomerStatusBadge status={customer.status} />
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "var(--type-small)",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          {displayDate(customer.joinedDate)}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Link
                            href={`/admin/customers/${customer.id}`}
                            className="button secondary"
                            style={{
                              minHeight: "28px",
                              padding: "4px 8px",
                              fontSize: "var(--type-label)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                            title="View Customer"
                          >
                            <Eye size={12} />
                            View
                          </Link>
                          <button
                            type="button"
                            className="button secondary"
                            style={{
                              minHeight: "28px",
                              padding: "4px 8px",
                              fontSize: "var(--type-label)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                            onClick={() => startEdit(customer)}
                            title="Edit Customer"
                          >
                            <Edit2 size={12} />
                            Edit
                          </button>
                          <button
                            type="button"
                            className="button secondary"
                            style={{
                              minHeight: "28px",
                              padding: "4px 8px",
                              fontSize: "var(--type-label)",
                              color: "var(--color-error)",
                              borderColor: "var(--color-border)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                            onClick={() => setDeletingCustomer(customer)}
                            title="Delete Customer"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            className="pagination"
          >
            <span className="muted" style={{ fontSize: "var(--type-small)" }}>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredCustomers.length)} of{" "}
              {filteredCustomers.length} customers
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

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <Modal
          title={`Edit Customer: ${editingCustomer.name}`}
          onClose={() => setEditingCustomer(null)}
        >
          <form
            onSubmit={handleSaveEdit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {editError && (
              <div className="error-text" role="alert">
                {editError}
              </div>
            )}

            <div>
              <label
                htmlFor="edit-customer-name"
                className="form-label"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500,
                }}
              >
                Customer Name *
              </label>
              <input
                id="edit-customer-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{ width: "100%" }}
                required
              />
            </div>

            <div>
              <label
                htmlFor="edit-customer-phone"
                className="form-label"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500,
                }}
              >
                Phone Number *
              </label>
              <input
                id="edit-customer-phone"
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                style={{ width: "100%" }}
                required
              />
            </div>

            <div>
              <label
                htmlFor="edit-customer-status"
                className="form-label"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500,
                }}
              >
                Customer Status *
              </label>
              <select
                id="edit-customer-status"
                value={editStatus}
                onChange={(e) =>
                  setEditStatus(e.target.value as CustomerStatus)
                }
                style={{ width: "100%" }}
              >
                {customerStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
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
                onClick={() => setEditingCustomer(null)}
                disabled={savingEdit}
              >
                Cancel
              </button>
              <button type="submit" className="button" disabled={savingEdit}>
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCustomer && (
        <ConfirmModal
          title={`Delete Customer ${deletingCustomer.name}?`}
          message={`Are you sure you want to delete customer ${deletingCustomer.name} (${deletingCustomer.email})? This action cannot be undone.`}
          confirmLabel={deleting ? "Deleting..." : "Delete Customer"}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingCustomer(null)}
        />
      )}
    </div>
  );
}
