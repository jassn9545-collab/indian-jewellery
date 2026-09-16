/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShoppingBag,
  FilterX,
  Calendar,
} from "lucide-react";
import {
  Order,
  OrderStatus,
  orderStatuses,
  paymentStatuses,
  shippingStatuses,
  Payment,
  commerceMoney,
  orderTotal,
  orderQuantity,
  displayDate,
} from "@/lib/commerce";

interface OrdersListProps {
  orders: Order[];
  loading?: boolean;
}

export function OrdersList({ orders, loading }: OrdersListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [paymentFilter, setPaymentFilter] = useState<string>("All");
  const [shippingFilter, setShippingFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Text search: Order ID, Customer Name, Product Name
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesCustomer = order.customer.name.toLowerCase().includes(q);
        const matchesEmail = order.customer.email.toLowerCase().includes(q);
        const matchesProduct = order.items.some(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.sku.toLowerCase().includes(q),
        );
        if (
          !matchesId &&
          !matchesCustomer &&
          !matchesEmail &&
          !matchesProduct
        ) {
          return false;
        }
      }

      // Order Status filter
      if (statusFilter !== "All" && order.status !== statusFilter) {
        return false;
      }

      // Payment Status filter
      if (paymentFilter !== "All" && order.payment.status !== paymentFilter) {
        return false;
      }

      // Shipping Status filter
      if (
        shippingFilter !== "All" &&
        order.shipping.status !== shippingFilter
      ) {
        return false;
      }

      // Date filter
      if (dateFilter !== "All") {
        const orderDate = new Date(order.date);
        const now = new Date();
        if (dateFilter === "Today") {
          if (orderDate.toDateString() !== now.toDateString()) return false;
        } else if (dateFilter === "7days") {
          const diffDays =
            (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
          if (diffDays > 7) return false;
        } else if (dateFilter === "30days") {
          const diffDays =
            (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
          if (diffDays > 30) return false;
        }
      }

      return true;
    });
  }, [orders, search, statusFilter, paymentFilter, shippingFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setPaymentFilter("All");
    setShippingFilter("All");
    setDateFilter("All");
    setPage(1);
  }

  if (loading) {
    return (
      <div className="panel" style={{ padding: "48px", textAlign: "center" }}>
        <p className="muted">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="list-panel">
      <div className="page-heading">
        <div>
          <h1>All Orders</h1>
          <p className="muted" style={{ marginTop: "4px" }}>
            Showing {filteredOrders.length}{" "}
            {filteredOrders.length === 1 ? "order" : "orders"} in your store
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="panel" style={{ marginBottom: "20px" }}>
        <div
          className="filters"
          style={{ flexWrap: "wrap", gap: "12px", padding: "16px 20px" }}
        >
          <div className="search-input" style={{ flex: "1 1 260px" }}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search Order ID, customer, product..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              aria-label="Search orders"
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
              aria-label="Filter by order status"
            >
              <option value="All">All Order Statuses</option>
              {orderStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by payment status"
            >
              <option value="All">All Payment Statuses</option>
              {paymentStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={shippingFilter}
              onChange={(e) => {
                setShippingFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by shipping status"
            >
              <option value="All">All Shipping Statuses</option>
              {shippingStatuses.map((s) => (
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

            {(search ||
              statusFilter !== "All" ||
              paymentFilter !== "All" ||
              shippingFilter !== "All" ||
              dateFilter !== "All") && (
              <button
                type="button"
                className="button secondary"
                style={{
                  minHeight: "36px",
                  padding: "6px 14px",
                  fontSize: "11px",
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

      {/* Orders Table */}
      {paginatedOrders.length === 0 ? (
        <div
          className="panel empty-panel"
          style={{ padding: "48px 24px", textAlign: "center" }}
        >
          <ShoppingBag
            size={42}
            style={{ color: "var(--color-text-muted)", margin: "0 auto 16px" }}
          />
          <h3>No orders found</h3>
          <p
            className="muted"
            style={{ maxWidth: "420px", margin: "8px auto 20px" }}
          >
            No orders match your current search and filter criteria. Try
            clearing filters or searching with a different term.
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
        <div className="panel" style={{ overflow: "hidden" }}>
          <div className="table-wrapper" style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Total Amount</th>
                  <th>Payment Status</th>
                  <th>Order Status</th>
                  <th>Shipping Status</th>
                  <th>Delivery Date</th>
                  <th>Order Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => {
                  const firstItem = order.items[0];
                  const total = orderTotal(order);
                  const qty = orderQuantity(order);

                  return (
                    <tr key={order.id}>
                      <td>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="table-link"
                          style={{
                            fontWeight: 600,
                            color: "var(--color-primary)",
                          }}
                        >
                          {order.id}
                        </Link>
                      </td>
                      <td>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span style={{ fontWeight: 500 }}>
                            {order.customer.name}
                          </span>
                          <small className="muted">
                            {order.customer.email}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          {firstItem?.image ? (
                            <img
                              src={firstItem.image}
                              alt={firstItem.name}
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
                            <div style={{ fontWeight: 500, fontSize: "12px" }}>
                              {firstItem?.name || "Product"}
                            </div>
                            {order.items.length > 1 && (
                              <small className="muted">
                                +{order.items.length - 1} more items
                              </small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{qty}</td>
                      <td style={{ fontWeight: 600 }}>
                        {commerceMoney(total)}
                      </td>
                      <td>
                        <PaymentBadge status={order.payment.status} />
                      </td>
                      <td>
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td>
                        <ShippingBadge status={order.shipping.status} />
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "11.5px",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          {order.shipping.deliveryDate
                            ? displayDate(order.shipping.deliveryDate)
                            : order.shipping.estimatedDelivery
                              ? `Est. ${displayDate(order.shipping.estimatedDelivery)}`
                              : "—"}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "11.5px",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          {displayDate(order.date)}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="button secondary"
                          style={{
                            minHeight: "30px",
                            padding: "4px 12px",
                            fontSize: "11px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <Eye size={13} />
                          View
                        </Link>
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
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span className="muted" style={{ fontSize: "12px" }}>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
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

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  let styleClass = "badge-neutral";
  if (status === "Delivered") styleClass = "badge-success";
  else if (
    status === "Confirmed" ||
    status === "Packed" ||
    status === "Shipped"
  )
    styleClass = "badge-gold";
  else if (status === "Processing" || status === "Out for Delivery")
    styleClass = "badge-info";
  else if (
    status === "Cancelled" ||
    status === "Returned" ||
    status === "Refunded"
  )
    styleClass = "badge-danger";

  return <span className={`status-badge ${styleClass}`}>{status}</span>;
}

export function PaymentBadge({ status }: { status: Payment["status"] }) {
  let styleClass = "badge-neutral";
  if (status === "Paid") styleClass = "badge-success";
  else if (status === "Pending") styleClass = "badge-gold";
  else if (status === "Failed" || status === "Refunded")
    styleClass = "badge-danger";

  return <span className={`status-badge ${styleClass}`}>{status}</span>;
}

export function ShippingBadge({ status }: { status: string }) {
  let styleClass = "badge-neutral";
  if (status === "Delivered") styleClass = "badge-success";
  else if (
    status === "Shipped" ||
    status === "In Transit" ||
    status === "Out for Delivery"
  )
    styleClass = "badge-gold";
  else if (status === "Failed Delivery") styleClass = "badge-danger";

  return <span className={`status-badge ${styleClass}`}>{status}</span>;
}
