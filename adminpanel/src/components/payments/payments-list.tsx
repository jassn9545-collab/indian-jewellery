/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  IndianRupee,
  FilterX,
} from "lucide-react";
import {
  PaymentRecord,
  projectPayments,
  commerceMoney,
  displayDate,
  Order,
} from "@/lib/commerce";

interface PaymentsListProps {
  orders: Order[];
  loading?: boolean;
}

export function PaymentStatusBadge({ status }: { status: string }) {
  let styleClass = "badge-neutral";
  if (status === "Paid") styleClass = "badge-success";
  else if (status === "Pending") styleClass = "badge-gold";
  else if (status === "Failed") styleClass = "badge-danger";
  else if (status === "Refunded" || status === "Partially Refunded")
    styleClass = "badge-info";

  return <span className={`status-badge ${styleClass}`}>{status}</span>;
}

export function PaymentsList({ orders, loading }: PaymentsListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [methodFilter, setMethodFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const payments = useMemo(() => projectPayments(orders), [orders]);

  // Top Summary Cards
  const summary = useMemo(() => {
    const totalPayments = payments.length;
    const successful = payments.filter((p) => p.status === "Paid").length;
    const pending = payments.filter((p) => p.status === "Pending").length;
    const failed = payments.filter((p) => p.status === "Failed").length;
    const totalAmountPaise = payments
      .filter((p) => p.status === "Paid")
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalPayments,
      successful,
      pending,
      failed,
      totalAmount: commerceMoney(totalAmountPaise),
    };
  }, [payments]);

  // Filter Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      // Text Search: Transaction ID, Order ID, Customer Name
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTxn = payment.id.toLowerCase().includes(q);
        const matchesOrder = payment.orderId.toLowerCase().includes(q);
        const matchesCustomer = payment.customerName.toLowerCase().includes(q);
        const matchesEmail = payment.customerEmail.toLowerCase().includes(q);
        if (!matchesTxn && !matchesOrder && !matchesCustomer && !matchesEmail) {
          return false;
        }
      }

      // Status Filter
      if (statusFilter !== "All" && payment.status !== statusFilter) {
        return false;
      }

      // Method Filter
      if (methodFilter !== "All" && payment.method !== methodFilter) {
        return false;
      }

      // Date Range Filter
      if (dateFilter !== "All") {
        const payDate = new Date(payment.date);
        const now = new Date();
        if (dateFilter === "Today") {
          if (payDate.toDateString() !== now.toDateString()) return false;
        } else if (dateFilter === "Last 7 Days") {
          const past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (payDate < past) return false;
        } else if (dateFilter === "Last 30 Days") {
          const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (payDate < past) return false;
        } else if (dateFilter === "This Month") {
          if (
            payDate.getMonth() !== now.getMonth() ||
            payDate.getFullYear() !== now.getFullYear()
          ) {
            return false;
          }
        }
      }

      return true;
    });
  }, [payments, search, statusFilter, methodFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setMethodFilter("All");
    setDateFilter("All");
    setPage(1);
  }

  if (loading) {
    return (
      <div className="panel" style={{ padding: "48px", textAlign: "center" }}>
        <p className="muted">Loading payment transactions...</p>
      </div>
    );
  }

  return (
    <div className="list-panel">
      {/* Top Page Heading */}
      <div className="page-heading">
        <div>
          <h1>Payments</h1>
          <p className="muted" style={{ marginTop: "4px" }}>
            Track and manage all payment transactions
          </p>
        </div>
      </div>

      {/* Top 5 Summary Cards */}
      <div
        className="stat-grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          marginBottom: "16px",
        }}
      >
        <div className="stat-card">
          <div className="stat-label">
            <span>Total Payments</span>
            <CreditCard size={18} />
          </div>
          <div className="stat-value">{summary.totalPayments}</div>
          <small className="muted">All recorded transactions</small>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <span>Successful Payments</span>
            <CheckCircle size={18} style={{ color: "var(--color-success)" }} />
          </div>
          <div className="stat-value">{summary.successful}</div>
          <small className="muted">Paid & completed</small>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <span>Pending Payments</span>
            <Clock size={18} style={{ color: "var(--color-gold)" }} />
          </div>
          <div className="stat-value">{summary.pending}</div>
          <small className="muted">Awaiting confirmation / COD</small>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <span>Failed Payments</span>
            <XCircle size={18} style={{ color: "var(--color-error)" }} />
          </div>
          <div className="stat-value">{summary.failed}</div>
          <small className="muted">Declined / cancelled</small>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <span>Total Payment Amount</span>
            <IndianRupee size={18} />
          </div>
          <div className="stat-value" style={{ fontSize: "22px" }}>
            {summary.totalAmount}
          </div>
          <small className="muted">Net settled revenue</small>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="panel" style={{ marginBottom: "16px" }}>
        <div
          className="filters"
          style={{ flexWrap: "wrap", gap: "12px", padding: "16px 20px" }}
        >
          <div className="search-input" style={{ flex: "1 1 260px" }}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search transaction ID, order ID, customer..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              aria-label="Search payments"
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              flex: "2 1 400px",
            }}
          >
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by payment status"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
              <option value="Partially Refunded">Partially Refunded</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => {
                setMethodFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by payment method"
            >
              <option value="All">All Payment Methods</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Wallet">Wallet</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by date range"
            >
              <option value="All">All Payment Dates</option>
              <option value="Today">Today</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Month">This Month</option>
            </select>

            {(search ||
              statusFilter !== "All" ||
              methodFilter !== "All" ||
              dateFilter !== "All") && (
              <button
                type="button"
                className="button secondary"
                onClick={resetFilters}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                }}
              >
                <FilterX size={14} />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payments Table */}
      {filteredPayments.length === 0 ? (
        <div
          className="panel empty-panel"
          style={{ padding: "48px 24px", textAlign: "center" }}
        >
          <CreditCard
            size={40}
            style={{
              color: "var(--color-text-muted)",
              margin: "0 auto 12px",
            }}
          />
          <h3>No payment transactions found</h3>
          <p className="muted" style={{ margin: "6px auto 16px" }}>
            No payments match your search and filter parameters.
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
        <div className="panel" style={{ overflow: "hidden" }}>
          <div className="table-container" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Payment Method</th>
                  <th>Amount</th>
                  <th>Payment Status</th>
                  <th>Payment Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td style={{ fontFamily: "monospace", fontSize: "12.5px" }}>
                      <strong>{payment.id}</strong>
                    </td>
                    <td style={{ fontFamily: "monospace", fontWeight: 600 }}>
                      <Link
                        href={`/admin/orders/${payment.orderId}`}
                        style={{
                          color: "var(--color-primary)",
                          textDecoration: "underline",
                        }}
                      >
                        {payment.orderId}
                      </Link>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "13px" }}>
                          {payment.customerName}
                        </div>
                        <small className="muted">{payment.customerEmail}</small>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12.5px",
                        }}
                      >
                        <CreditCard size={14} className="muted" />
                        {payment.method}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {commerceMoney(payment.amount)}
                    </td>
                    <td>
                      <PaymentStatusBadge status={payment.status} />
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {displayDate(payment.date, true)}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Link
                        href={`/admin/payments/${payment.id}`}
                        className="button secondary"
                        style={{
                          minHeight: "28px",
                          padding: "4px 10px",
                          fontSize: "11px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Eye size={12} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            className="pagination"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 20px",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <span className="muted" style={{ fontSize: "12px" }}>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredPayments.length)} of{" "}
              {filteredPayments.length} transactions
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

              <span style={{ fontSize: "12px", padding: "0 8px" }}>
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
    </div>
  );
}
