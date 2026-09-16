/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PackageCheck,
  FilterX,
} from "lucide-react";
import {
  ShipmentRecord,
  projectShipments,
  shippingStatuses,
  displayDate,
  Order,
} from "@/lib/commerce";
import { ShippingBadge } from "../orders/orders-list";

interface ShippingListProps {
  orders: Order[];
  loading?: boolean;
}

export function ShippingList({ orders, loading }: ShippingListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [courierFilter, setCourierFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const shipments = useMemo(() => projectShipments(orders), [orders]);

  // Unique couriers for filter dropdown
  const couriers = useMemo(() => {
    const set = new Set<string>();
    shipments.forEach((s) => {
      if (s.courier) set.add(s.courier);
    });
    return Array.from(set);
  }, [shipments]);

  // Top 5 Summary Cards
  const summary = useMemo(() => {
    const total = shipments.length;
    const delivered = shipments.filter((s) => s.status === "Delivered").length;
    const inTransit = shipments.filter((s) =>
      ["In Transit", "Shipped", "Out for Delivery"].includes(s.status),
    ).length;
    const pending = shipments.filter((s) =>
      ["Not Shipped", "Packed"].includes(s.status),
    ).length;
    const failed = shipments.filter(
      (s) => s.status === "Failed Delivery" || s.status === "Returned",
    ).length;

    return { total, delivered, inTransit, pending, failed };
  }, [shipments]);

  // Filter Shipments
  const filteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      // Text Search: Order ID, Customer Name, Tracking Number
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesOrder = s.orderId.toLowerCase().includes(q);
        const matchesCustomer = s.customerName.toLowerCase().includes(q);
        const matchesTracking = s.trackingNumber.toLowerCase().includes(q);
        if (!matchesOrder && !matchesCustomer && !matchesTracking) {
          return false;
        }
      }

      // Status Filter
      if (statusFilter !== "All" && s.status !== statusFilter) {
        return false;
      }

      // Courier Filter
      if (courierFilter !== "All" && s.courier !== courierFilter) {
        return false;
      }

      // Date Range Filter
      if (dateFilter !== "All") {
        const orderDate = new Date(s.orderDate);
        const now = new Date();
        if (dateFilter === "Today") {
          if (orderDate.toDateString() !== now.toDateString()) return false;
        } else if (dateFilter === "Last 7 Days") {
          const past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (orderDate < past) return false;
        } else if (dateFilter === "Last 30 Days") {
          const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (orderDate < past) return false;
        } else if (dateFilter === "This Month") {
          if (
            orderDate.getMonth() !== now.getMonth() ||
            orderDate.getFullYear() !== now.getFullYear()
          ) {
            return false;
          }
        }
      }

      return true;
    });
  }, [shipments, search, statusFilter, courierFilter, dateFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredShipments.length / pageSize),
  );
  const currentPage = Math.min(page, totalPages);
  const paginatedShipments = filteredShipments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setCourierFilter("All");
    setDateFilter("All");
    setPage(1);
  }

  if (loading) {
    return (
      <div className="panel" style={{ padding: "48px", textAlign: "center" }}>
        <p className="muted">Loading shipping tracking...</p>
      </div>
    );
  }

  return (
    <div className="list-panel">
      {/* Top Page Heading */}
      <div className="page-heading">
        <div>
          <h1>Shipping</h1>
          <p className="muted" style={{ marginTop: "4px" }}>
            Track shipments and delivery status
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
            <span>Total Shipments</span>
            <Truck size={18} />
          </div>
          <div className="stat-value">{summary.total}</div>
          <small className="muted">All order fulfillment packages</small>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <span>Delivered</span>
            <CheckCircle2 size={18} style={{ color: "var(--color-success)" }} />
          </div>
          <div className="stat-value">{summary.delivered}</div>
          <small className="muted">Successfully delivered to customer</small>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <span>In Transit</span>
            <PackageCheck size={18} style={{ color: "var(--color-info)" }} />
          </div>
          <div className="stat-value">{summary.inTransit}</div>
          <small className="muted">With courier or out for delivery</small>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <span>Pending</span>
            <Clock size={18} style={{ color: "var(--color-gold)" }} />
          </div>
          <div className="stat-value">{summary.pending}</div>
          <small className="muted">Packing & warehouse preparation</small>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <span>Failed Delivery</span>
            <AlertTriangle size={18} style={{ color: "var(--color-error)" }} />
          </div>
          <div className="stat-value">{summary.failed}</div>
          <small className="muted">Undelivered or returned</small>
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
              placeholder="Search Order ID, customer, or tracking number..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              aria-label="Search shipments"
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
              value={courierFilter}
              onChange={(e) => {
                setCourierFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by courier"
            >
              <option value="All">All Couriers</option>
              {couriers.map((c) => (
                <option key={c} value={c}>
                  {c}
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
              <option value="All">All Order Dates</option>
              <option value="Today">Today</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Month">This Month</option>
            </select>

            {(search ||
              statusFilter !== "All" ||
              courierFilter !== "All" ||
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

      {/* Shipping Table */}
      {filteredShipments.length === 0 ? (
        <div
          className="panel empty-panel"
          style={{ padding: "48px 24px", textAlign: "center" }}
        >
          <Truck
            size={40}
            style={{
              color: "var(--color-text-muted)",
              margin: "0 auto 12px",
            }}
          />
          <h3>No shipments found</h3>
          <p className="muted" style={{ margin: "6px auto 16px" }}>
            No packages match your search and filter parameters.
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
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Courier</th>
                  <th>Tracking Number</th>
                  <th>Shipping Status</th>
                  <th>Estimated Delivery</th>
                  <th>Actual Delivery</th>
                  <th>Order Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedShipments.map((shipment) => {
                  const firstItem = shipment.items[0];
                  return (
                    <tr key={shipment.orderId}>
                      <td style={{ fontFamily: "monospace", fontWeight: 600 }}>
                        <Link
                          href={`/admin/orders/${shipment.orderId}`}
                          style={{
                            color: "var(--color-primary)",
                            textDecoration: "underline",
                          }}
                        >
                          {shipment.orderId}
                        </Link>
                      </td>
                      <td>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "13px" }}>
                            {shipment.customerName}
                          </div>
                          <small className="muted">
                            {shipment.customerCity}, {shipment.customerState}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          {firstItem?.image ? (
                            <img
                              src={firstItem.image}
                              alt={firstItem.name}
                              style={{
                                width: "32px",
                                height: "32px",
                                objectFit: "cover",
                                borderRadius: "4px",
                                border: "1px solid var(--color-border)",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                background: "var(--color-surface-secondary)",
                                borderRadius: "4px",
                              }}
                            />
                          )}
                          <div>
                            <div style={{ fontWeight: 500, fontSize: "12px" }}>
                              {firstItem?.name || "Product"}
                            </div>
                            {shipment.items.length > 1 && (
                              <small className="muted">
                                +{shipment.items.length - 1} more items
                              </small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: "12.5px" }}>
                          {shipment.courier}
                        </span>
                      </td>
                      <td style={{ fontFamily: "monospace", fontSize: "12px" }}>
                        {shipment.trackingNumber !== "—" ? (
                          <span
                            style={{
                              background: "var(--color-surface-secondary)",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              border: "1px solid var(--color-border)",
                            }}
                          >
                            {shipment.trackingNumber}
                          </span>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                      <td>
                        <ShippingBadge status={shipment.status} />
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          {shipment.estimatedDelivery
                            ? displayDate(shipment.estimatedDelivery)
                            : "—"}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "12px",
                            color: shipment.actualDelivery
                              ? "var(--color-success)"
                              : "var(--color-text-secondary)",
                            fontWeight: shipment.actualDelivery ? 600 : 400,
                          }}
                        >
                          {shipment.actualDelivery
                            ? displayDate(shipment.actualDelivery)
                            : "—"}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          {displayDate(shipment.orderDate)}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <Link
                          href={`/admin/shipping/${shipment.orderId}`}
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
              padding: "12px 20px",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <span className="muted" style={{ fontSize: "12px" }}>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredShipments.length)} of{" "}
              {filteredShipments.length} packages
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
