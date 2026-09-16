/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ShoppingBag,
  IndianRupee,
  Clock,
  Eye,
  Edit2,
  Package,
} from "lucide-react";
import {
  CustomerRecord,
  CustomerStatus,
  customerStatuses,
  customerStats,
  commerceMoney,
  displayDate,
  orderQuantity,
  orderTotal,
  Order,
} from "@/lib/commerce";
import { CustomerStatusBadge } from "./customers-list";
import { OrderStatusBadge, PaymentBadge } from "../orders/orders-list";
import { Modal } from "../ui";

interface CustomerDetailsProps {
  customer: CustomerRecord;
  orders: Order[];
  onUpdateCustomer: (
    id: string,
    update: Partial<CustomerRecord>,
  ) => Promise<void>;
  onToast: (msg: string) => void;
}

export function CustomerDetails({
  customer,
  orders,
  onUpdateCustomer,
  onToast,
}: CustomerDetailsProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone);
  const [status, setStatus] = useState<CustomerStatus>(customer.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const stats = customerStats(customer, orders);
  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleSaveCustomer(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onUpdateCustomer(customer.id, {
        name: name.trim(),
        phone: phone.trim(),
        status,
      });
      onToast(`Customer ${name} updated successfully`);
      setEditModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to update customer");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="customer-details-layout">
      {/* Top Header */}
      <div className="page-heading" style={{ marginBottom: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/admin/customers"
            className="button secondary"
            style={{ minHeight: "36px", padding: "6px 14px" }}
          >
            <ArrowLeft size={15} />
            Back to Customers
          </Link>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 style={{ margin: 0 }}>{customer.name}</h1>
              <CustomerStatusBadge status={customer.status} />
            </div>
            <p className="muted" style={{ margin: "4px 0 0" }}>
              Customer ID: {customer.id} · Registered on{" "}
              {displayDate(customer.joinedDate)}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="button"
          onClick={() => {
            setName(customer.name);
            setPhone(customer.phone);
            setStatus(customer.status);
            setError("");
            setEditModalOpen(true);
          }}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <Edit2 size={15} />
          Edit Customer
        </button>
      </div>

      {/* Grid of Summary & Details Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        {/* 1. Customer Information Card */}
        <div className="panel" style={{ padding: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
              borderBottom: "1px solid var(--color-border)",
              paddingBottom: "12px",
            }}
          >
            <User size={18} style={{ color: "var(--color-primary)" }} />
            <h3 style={{ margin: 0 }}>Customer Information</h3>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            {customer.avatar ? (
              <img
                src={customer.avatar}
                alt={customer.name}
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid var(--color-border)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "var(--color-surface-secondary)",
                  color: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: 600,
                  border: "2px solid var(--color-border)",
                }}
              >
                {initials || <User size={24} />}
              </div>
            )}
            <div>
              <strong style={{ fontSize: "16px", display: "block" }}>
                {customer.name}
              </strong>
              <span className="muted" style={{ fontSize: "12.5px" }}>
                Member since {displayDate(customer.joinedDate)}
              </span>
            </div>
          </div>

          <div
            className="details-list"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              fontSize: "13px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Email Address</span>
              <strong style={{ color: "var(--color-text)" }}>
                {customer.email}
              </strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Phone</span>
              <span>{customer.phone || "—"}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="muted">Account Status</span>
              <CustomerStatusBadge status={customer.status} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Registration Date</span>
              <span>{displayDate(customer.joinedDate, true)}</span>
            </div>
          </div>
        </div>

        {/* 2. Addresses Card */}
        <div className="panel" style={{ padding: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
              borderBottom: "1px solid var(--color-border)",
              paddingBottom: "12px",
            }}
          >
            <MapPin size={18} style={{ color: "var(--color-primary)" }} />
            <h3 style={{ margin: 0 }}>Address Information</h3>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <span
                className="muted"
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Shipping Address
              </span>
              <div
                style={{
                  background: "var(--color-surface-secondary)",
                  padding: "12px 14px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  border: "1px solid var(--color-border)",
                }}
              >
                {customer.shippingAddress.line1}
                {customer.shippingAddress.line2 && (
                  <>, {customer.shippingAddress.line2}</>
                )}
                <br />
                {customer.shippingAddress.city},{" "}
                {customer.shippingAddress.state} -{" "}
                {customer.shippingAddress.postalCode}
                <br />
                {customer.shippingAddress.country}
              </div>
            </div>

            <div>
              <span
                className="muted"
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Billing Address
              </span>
              <div
                style={{
                  background: "var(--color-surface-secondary)",
                  padding: "12px 14px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  border: "1px solid var(--color-border)",
                }}
              >
                {customer.billingAddress.line1}
                {customer.billingAddress.line2 && (
                  <>, {customer.billingAddress.line2}</>
                )}
                <br />
                {customer.billingAddress.city}, {customer.billingAddress.state}{" "}
                - {customer.billingAddress.postalCode}
                <br />
                {customer.billingAddress.country}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Customer Summary Card */}
        <div className="panel" style={{ padding: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
              borderBottom: "1px solid var(--color-border)",
              paddingBottom: "12px",
            }}
          >
            <ShoppingBag size={18} style={{ color: "var(--color-primary)" }} />
            <h3 style={{ margin: 0 }}>Customer Summary</h3>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                background: "var(--color-surface-secondary)",
                padding: "14px",
                borderRadius: "6px",
                textAlign: "center",
                border: "1px solid var(--color-border)",
              }}
            >
              <span
                className="muted"
                style={{ fontSize: "11px", display: "block" }}
              >
                Total Orders
              </span>
              <strong
                style={{ fontSize: "22px", color: "var(--color-primary)" }}
              >
                {stats.totalOrders}
              </strong>
            </div>

            <div
              style={{
                background: "var(--color-surface-secondary)",
                padding: "14px",
                borderRadius: "6px",
                textAlign: "center",
                border: "1px solid var(--color-border)",
              }}
            >
              <span
                className="muted"
                style={{ fontSize: "11px", display: "block" }}
              >
                Total Spent
              </span>
              <strong
                style={{ fontSize: "20px", color: "var(--color-primary)" }}
              >
                {commerceMoney(stats.totalSpent)}
              </strong>
            </div>
          </div>

          <div
            className="details-list"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontSize: "13px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Last Order Date</span>
              <strong>
                {stats.lastOrderDate
                  ? displayDate(stats.lastOrderDate)
                  : "No orders yet"}
              </strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Average Order Value</span>
              <span>
                {stats.totalOrders > 0
                  ? commerceMoney(
                      Math.round(stats.totalSpent / stats.totalOrders),
                    )
                  : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Order History Table */}
      <div className="panel" style={{ overflow: "hidden", padding: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
            borderBottom: "1px solid var(--color-border)",
            paddingBottom: "12px",
          }}
        >
          <Package size={18} style={{ color: "var(--color-primary)" }} />
          <h3 style={{ margin: 0 }}>
            Order History ({stats.orders.length}{" "}
            {stats.orders.length === 1 ? "Order" : "Orders"})
          </h3>
        </div>

        {stats.orders.length === 0 ? (
          <div
            style={{
              padding: "36px 16px",
              textAlign: "center",
              color: "var(--color-text-muted)",
            }}
          >
            <ShoppingBag size={32} style={{ margin: "0 auto 8px" }} />
            <p>No orders placed by this customer yet.</p>
          </div>
        ) : (
          <div className="table-container" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Payment Status</th>
                  <th>Order Status</th>
                  <th>Order Date</th>
                  <th style={{ textAlign: "right" }}>View Order</th>
                </tr>
              </thead>
              <tbody>
                {stats.orders.map((order) => {
                  const firstItem = order.items[0];
                  return (
                    <tr key={order.id}>
                      <td style={{ fontFamily: "monospace", fontWeight: 600 }}>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          style={{
                            color: "var(--color-primary)",
                            textDecoration: "underline",
                          }}
                        >
                          {order.id}
                        </Link>
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
                            {order.items.length > 1 && (
                              <small className="muted">
                                +{order.items.length - 1} more items
                              </small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{orderQuantity(order)}</td>
                      <td style={{ fontWeight: 600 }}>
                        {commerceMoney(orderTotal(order))}
                      </td>
                      <td>
                        <PaymentBadge status={order.payment.status} />
                      </td>
                      <td>
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "12px",
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
                            minHeight: "28px",
                            padding: "3px 10px",
                            fontSize: "11px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Eye size={12} />
                          View Order
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Customer Modal */}
      {editModalOpen && (
        <Modal
          title={`Edit Customer: ${customer.name}`}
          onClose={() => setEditModalOpen(false)}
        >
          <form
            onSubmit={handleSaveCustomer}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {error && (
              <div className="error-text" role="alert">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="details-edit-name"
                className="form-label"
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                Customer Name *
              </label>
              <input
                id="details-edit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%" }}
                required
              />
            </div>

            <div>
              <label
                htmlFor="details-edit-phone"
                className="form-label"
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                Phone Number *
              </label>
              <input
                id="details-edit-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: "100%" }}
                required
              />
            </div>

            <div>
              <label
                htmlFor="details-edit-status"
                className="form-label"
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                Customer Status *
              </label>
              <select
                id="details-edit-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as CustomerStatus)}
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
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button
                type="button"
                className="button secondary"
                onClick={() => setEditModalOpen(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="button" disabled={saving}>
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
