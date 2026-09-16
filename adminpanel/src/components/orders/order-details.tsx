/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Clock,
  MapPin,
  CreditCard,
  Truck,
  Package,
  User,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileText,
  Save,
} from "lucide-react";
import {
  Order,
  OrderStatus,
  orderStatuses,
  shippingStatuses,
  commerceMoney,
  lineTotal,
  orderTotal,
  orderQuantity,
  displayDate,
  OrderUpdate,
} from "@/lib/commerce";
import { Modal } from "../ui";
import { OrderStatusBadge, PaymentBadge, ShippingBadge } from "./orders-list";

interface OrderDetailsProps {
  order: Order;
  onUpdate: (update: OrderUpdate, version: number) => Promise<void>;
  onToast: (msg: string) => void;
}

export function OrderDetails({ order, onUpdate, onToast }: OrderDetailsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status,
  );
  const [shippingStatus, setShippingStatus] = useState(order.shipping.status);
  const [courier, setCourier] = useState(order.shipping.courier || "");
  const [trackingNumber, setTrackingNumber] = useState(
    order.shipping.trackingNumber || "",
  );
  const [deliveryDate, setDeliveryDate] = useState(
    order.shipping.deliveryDate || "",
  );
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const subtotal = order.items.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0,
  );
  const discountTotal = order.items.reduce(
    (sum, line) => sum + line.unitDiscount * line.quantity,
    0,
  );
  const grandTotal = orderTotal(order);

  async function handleSaveStatus(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const isDelivered =
      selectedStatus === "Delivered" || shippingStatus === "Delivered";
    const resolvedDeliveryDate = isDelivered
      ? deliveryDate || new Date().toISOString().slice(0, 10)
      : deliveryDate || undefined;
    const resolvedShippingStatus =
      selectedStatus === "Delivered" ? "Delivered" : shippingStatus;

    try {
      await onUpdate(
        {
          status: selectedStatus,
          shipping: {
            ...order.shipping,
            status: resolvedShippingStatus,
            courier,
            trackingNumber,
            deliveryDate: resolvedDeliveryDate,
          },
          notes: notes.trim() || undefined,
        },
        order.version,
      );
      setModalOpen(false);
      onToast(`Order ${order.id} status updated to ${selectedStatus}`);
    } catch (err: any) {
      setError(err.message || "Failed to update order status");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="order-details-layout">
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
            href="/admin/orders"
            className="button secondary"
            style={{ minHeight: "36px", padding: "6px 14px" }}
          >
            <ArrowLeft size={15} />
            Back to Orders
          </Link>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h1>Order {order.id}</h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="muted" style={{ marginTop: "4px", fontSize: "12px" }}>
              Placed on {displayDate(order.date, true)}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="button"
          onClick={() => {
            setSelectedStatus(order.status);
            setShippingStatus(order.shipping.status);
            setCourier(order.shipping.courier || "");
            setTrackingNumber(order.shipping.trackingNumber || "");
            setDeliveryDate(order.shipping.deliveryDate || "");
            setNotes("");
            setError("");
            setModalOpen(true);
          }}
        >
          Update Order Status
        </button>
      </div>

      {/* Grid of 6 Sections */}
      <div
        className="order-grid-container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "16px",
        }}
      >
        {/* 1. Order Information */}
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
            <FileText size={18} style={{ color: "var(--color-primary)" }} />
            <h3 style={{ margin: 0 }}>Order Information</h3>
          </div>
          <div
            className="details-list"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              fontSize: "12.5px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Order ID</span>
              <strong style={{ fontFamily: "monospace", fontSize: "13px" }}>
                {order.id}
              </strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Order Date</span>
              <span>{displayDate(order.date, true)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="muted">Order Status</span>
              <OrderStatusBadge status={order.status} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Stock Allocated</span>
              <span
                style={{
                  color: order.stockDeducted
                    ? "var(--color-success)"
                    : "var(--color-text-muted)",
                }}
              >
                {order.stockDeducted
                  ? "Yes (Deducted from catalog)"
                  : "No (Released)"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Total Items</span>
              <span>
                {orderQuantity(order)} items ({order.items.length} unique)
              </span>
            </div>
          </div>
        </div>

        {/* 2. Customer Details */}
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
            <h3 style={{ margin: 0 }}>Customer Details</h3>
          </div>
          <div
            className="details-list"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              fontSize: "12.5px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Name</span>
              <strong>{order.customer.name}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Email</span>
              <span>{order.customer.email}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Phone</span>
              <span>{order.customer.phone}</span>
            </div>
            <div style={{ marginTop: "4px" }}>
              <span
                className="muted"
                style={{ display: "block", marginBottom: "4px" }}
              >
                Shipping Address:
              </span>
              <div
                style={{
                  background: "var(--color-surface-secondary)",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  lineHeight: "1.5",
                }}
              >
                {order.customer.shippingAddress.line1}
                {order.customer.shippingAddress.line2 && (
                  <>, {order.customer.shippingAddress.line2}</>
                )}
                <br />
                {order.customer.shippingAddress.city},{" "}
                {order.customer.shippingAddress.state} -{" "}
                {order.customer.shippingAddress.postalCode}
                <br />
                {order.customer.shippingAddress.country}
              </div>
            </div>
            <div>
              <span
                className="muted"
                style={{ display: "block", marginBottom: "4px" }}
              >
                Billing Address:
              </span>
              <div
                style={{
                  background: "var(--color-surface-secondary)",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  lineHeight: "1.5",
                }}
              >
                {order.customer.billingAddress.line1}
                {order.customer.billingAddress.line2 && (
                  <>, {order.customer.billingAddress.line2}</>
                )}
                <br />
                {order.customer.billingAddress.city},{" "}
                {order.customer.billingAddress.state} -{" "}
                {order.customer.billingAddress.postalCode}
                <br />
                {order.customer.billingAddress.country}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Payment Details */}
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
            <CreditCard size={18} style={{ color: "var(--color-primary)" }} />
            <h3 style={{ margin: 0 }}>Payment Details</h3>
          </div>
          <div
            className="details-list"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              fontSize: "12.5px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Payment Method</span>
              <strong>{order.payment.method}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Transaction ID / Ref</span>
              <span style={{ fontFamily: "monospace" }}>
                {order.payment.reference || "N/A (Cash on Delivery)"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Payment Date</span>
              <span>
                {order.payment.date
                  ? displayDate(order.payment.date, true)
                  : "Pending"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="muted">Payment Status</span>
              <PaymentBadge status={order.payment.status} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1px solid var(--color-border)",
                paddingTop: "10px",
              }}
            >
              <span className="muted">Payment Amount</span>
              <strong
                style={{ fontSize: "14px", color: "var(--color-primary)" }}
              >
                {commerceMoney(order.payment.amount)}
              </strong>
            </div>
          </div>
        </div>

        {/* 4. Shipping Details */}
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
            <Truck size={18} style={{ color: "var(--color-primary)" }} />
            <h3 style={{ margin: 0 }}>Shipping Details</h3>
          </div>
          <div
            className="details-list"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              fontSize: "12.5px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Shipping Method</span>
              <span>{order.shipping.method || "Standard Delivery"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Courier Partner</span>
              <span>{order.shipping.courier || "Pending Assignment"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Tracking Number</span>
              <span style={{ fontFamily: "monospace" }}>
                {order.shipping.trackingNumber || "N/A"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="muted">Shipping Status</span>
              <ShippingBadge status={order.shipping.status} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Estimated Delivery</span>
              <span>
                {order.shipping.estimatedDelivery
                  ? displayDate(order.shipping.estimatedDelivery)
                  : "N/A"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Actual Delivery Date</span>
              <span
                style={{ fontWeight: order.shipping.deliveryDate ? 600 : 400 }}
              >
                {order.shipping.deliveryDate
                  ? displayDate(order.shipping.deliveryDate)
                  : "Not delivered yet"}
              </span>
            </div>
          </div>
        </div>

        {/* 5. Product Details (spans 2 columns on desktop) */}
        <div
          className="panel"
          style={{ padding: "16px", gridColumn: "1 / -1" }}
        >
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
              Product Details ({order.items.length}{" "}
              {order.items.length === 1 ? "Item" : "Items"})
            </h3>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              className="data-table"
              style={{ width: "100%", textAlign: "left" }}
            >
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Discount</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => {
                  const lineAmt = lineTotal(item);
                  return (
                    <tr key={item.productId || idx}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: "48px",
                                height: "48px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                border: "1px solid var(--color-border)",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "48px",
                                height: "48px",
                                background: "var(--color-surface-secondary)",
                                borderRadius: "6px",
                              }}
                            />
                          )}
                          <div>
                            <strong style={{ fontSize: "13px" }}>
                              {item.name}
                            </strong>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontFamily: "monospace", fontSize: "12px" }}>
                        {item.sku || "—"}
                      </td>
                      <td>{item.quantity}</td>
                      <td>{commerceMoney(item.unitPrice)}</td>
                      <td
                        style={{
                          color:
                            item.unitDiscount > 0
                              ? "var(--color-success)"
                              : "inherit",
                        }}
                      >
                        {item.unitDiscount > 0
                          ? `-${commerceMoney(item.unitDiscount)}`
                          : "—"}
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>
                        {commerceMoney(lineAmt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pricing summary */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                width: "320px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "13px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="muted">Subtotal:</span>
                <span>{commerceMoney(subtotal)}</span>
              </div>
              {discountTotal > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "var(--color-success)",
                  }}
                >
                  <span>Discounts:</span>
                  <span>-{commerceMoney(discountTotal)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="muted">Shipping & Handling:</span>
                <span style={{ color: "var(--color-success)" }}>FREE</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "2px solid var(--color-border)",
                  paddingTop: "8px",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "var(--color-primary)",
                }}
              >
                <span>Grand Total:</span>
                <span>{commerceMoney(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Order Timeline */}
        <div
          className="panel"
          style={{ padding: "16px", gridColumn: "1 / -1" }}
        >
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
            <Clock size={18} style={{ color: "var(--color-primary)" }} />
            <h3 style={{ margin: 0 }}>Order Timeline & History</h3>
          </div>

          <div
            className="order-timeline"
            style={{
              position: "relative",
              paddingLeft: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {/* Timeline vertical line */}
            <div
              style={{
                position: "absolute",
                top: "8px",
                bottom: "8px",
                left: "7px",
                width: "2px",
                background: "var(--color-border)",
              }}
            />

            {(order.timeline && order.timeline.length > 0
              ? order.timeline
              : [
                  {
                    status: order.status,
                    date: order.date,
                    notes: `Order placed in state ${order.status}`,
                  },
                ]
            ).map((item, idx) => (
              <div key={idx} style={{ position: "relative" }}>
                {/* Node circle */}
                <div
                  style={{
                    position: "absolute",
                    left: "-24px",
                    top: "4px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "var(--color-surface)",
                    border: "3px solid var(--color-primary)",
                  }}
                />
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <OrderStatusBadge status={item.status} />
                    <span className="muted" style={{ fontSize: "11.5px" }}>
                      {displayDate(item.date, true)}
                    </span>
                  </div>
                  {item.notes && (
                    <p
                      style={{
                        margin: "6px 0 0",
                        fontSize: "12.5px",
                        color: "var(--color-text)",
                      }}
                    >
                      {item.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Update Order Status Modal */}
      {modalOpen && (
        <Modal
          title={`Update Order ${order.id}`}
          onClose={() => setModalOpen(false)}
        >
          <form
            onSubmit={handleSaveStatus}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {error && (
              <div className="error-text" role="alert">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="order-status-select"
                className="form-label"
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                Order Status *
              </label>
              <select
                id="order-status-select"
                value={selectedStatus}
                onChange={(e) => {
                  const val = e.target.value as OrderStatus;
                  setSelectedStatus(val);
                  if (val === "Delivered") {
                    setShippingStatus("Delivered");
                    if (!deliveryDate) {
                      setDeliveryDate(new Date().toISOString().slice(0, 10));
                    }
                  }
                }}
                style={{ width: "100%" }}
              >
                {orderStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="shipping-status-select"
                className="form-label"
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                Shipping Status *
              </label>
              <select
                id="shipping-status-select"
                value={shippingStatus}
                onChange={(e) => setShippingStatus(e.target.value as any)}
                style={{ width: "100%" }}
              >
                {shippingStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div>
                <label
                  htmlFor="courier-input"
                  className="form-label"
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: 500,
                  }}
                >
                  Courier Partner
                </label>
                <input
                  id="courier-input"
                  type="text"
                  placeholder="e.g. BlueDart, Delhivery"
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label
                  htmlFor="tracking-input"
                  className="form-label"
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: 500,
                  }}
                >
                  Tracking Number
                </label>
                <input
                  id="tracking-input"
                  type="text"
                  placeholder="e.g. BD-8921827"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            {(selectedStatus === "Delivered" ||
              shippingStatus === "Delivered") && (
              <div>
                <label
                  htmlFor="delivery-date-input"
                  className="form-label"
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: 500,
                  }}
                >
                  Actual Delivery Date *
                </label>
                <input
                  id="delivery-date-input"
                  type="date"
                  value={deliveryDate || new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  style={{ width: "100%" }}
                  required
                />
              </div>
            )}

            <div>
              <label
                htmlFor="timeline-notes"
                className="form-label"
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                Timeline Notes (Optional)
              </label>
              <textarea
                id="timeline-notes"
                placeholder="Add internal notes about this status update..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                style={{ width: "100%" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "12px",
              }}
            >
              <button
                type="button"
                className="button secondary"
                onClick={() => setModalOpen(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="button" disabled={saving}>
                {saving ? "Saving Changes..." : "Save Status"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
