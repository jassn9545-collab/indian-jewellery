/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import {
  ArrowLeft,
  Truck,
  MapPin,
  Package,
  Calendar,
  Clock,
  ShoppingBag,
  CheckCircle2,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  ShipmentRecord,
  commerceMoney,
  displayDate,
  lineTotal,
  orderQuantity,
} from "@/lib/commerce";
import { ShippingBadge } from "../orders/orders-list";

interface ShippingDetailsProps {
  shipment: ShipmentRecord;
}

export function ShippingDetails({ shipment }: ShippingDetailsProps) {
  const { order } = shipment;

  // Timeline events from order or fallbacks
  const timelineEvents = order.timeline || [
    {
      status: "Confirmed" as const,
      date: order.date,
      notes: "Order placed and confirmed.",
    },
  ];

  return (
    <div className="shipping-details-layout">
      {/* Top Header */}
      <div className="page-heading" style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/admin/shipping"
            className="button secondary"
            style={{ minHeight: "36px", padding: "6px 14px" }}
          >
            <ArrowLeft size={15} />
            Back to Shipping
          </Link>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 style={{ margin: 0 }}>Shipment #{shipment.orderId}</h1>
              <ShippingBadge status={shipment.status} />
            </div>
            <p className="muted" style={{ margin: "4px 0 0" }}>
              Courier: {shipment.courier} · Tracking: {shipment.trackingNumber}
            </p>
          </div>
        </div>

        <Link
          href={`/admin/orders/${shipment.orderId}`}
          className="button"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <ShoppingBag size={15} />
          View Full Order
        </Link>
      </div>

      {/* Grid of 4 Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        {/* 1. Shipping Information */}
        <div className="panel" style={{ padding: "24px" }}>
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
            <h3 style={{ margin: 0 }}>Shipping Information</h3>
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
              <span className="muted">Shipping Method</span>
              <strong>{shipment.method}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Courier Partner</span>
              <span>{shipment.courier}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Tracking Number</span>
              <strong style={{ fontFamily: "monospace", fontSize: "13px" }}>
                {shipment.trackingNumber}
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="muted">Shipping Status</span>
              <ShippingBadge status={shipment.status} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Shipping Date</span>
              <span>
                {shipment.shippingDate
                  ? displayDate(shipment.shippingDate)
                  : "Not shipped yet"}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Estimated Delivery</span>
              <span>
                {shipment.estimatedDelivery
                  ? displayDate(shipment.estimatedDelivery)
                  : "N/A"}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Actual Delivery Date</span>
              <strong
                style={{
                  color: shipment.actualDelivery
                    ? "var(--color-success)"
                    : "var(--color-text-secondary)",
                }}
              >
                {shipment.actualDelivery
                  ? displayDate(shipment.actualDelivery, true)
                  : "Not delivered yet"}
              </strong>
            </div>
          </div>
        </div>

        {/* 2. Delivery Address */}
        <div className="panel" style={{ padding: "24px" }}>
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
            <h3 style={{ margin: 0 }}>Delivery Address</h3>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              fontSize: "13px",
            }}
          >
            <div>
              <span
                className="muted"
                style={{ display: "block", marginBottom: "4px" }}
              >
                Recipient Name:
              </span>
              <strong style={{ fontSize: "15px" }}>
                {shipment.customerName}
              </strong>
            </div>

            <div>
              <span
                className="muted"
                style={{ display: "block", marginBottom: "4px" }}
              >
                Contact Phone:
              </span>
              <span>{shipment.customerPhone}</span>
            </div>

            <div>
              <span
                className="muted"
                style={{ display: "block", marginBottom: "6px" }}
              >
                Complete Shipping Address:
              </span>
              <div
                style={{
                  background: "var(--color-surface-secondary)",
                  padding: "14px",
                  borderRadius: "6px",
                  lineHeight: "1.6",
                  border: "1px solid var(--color-border)",
                }}
              >
                {shipment.customerAddress.line1}
                {shipment.customerAddress.line2 && (
                  <>, {shipment.customerAddress.line2}</>
                )}
                <br />
                {shipment.customerAddress.city},{" "}
                {shipment.customerAddress.state} -{" "}
                {shipment.customerAddress.postalCode}
                <br />
                {shipment.customerAddress.country}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Order Information & Products Summary */}
        <div
          className="panel"
          style={{ padding: "24px", gridColumn: "1 / -1" }}
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
              Order Information & Packages ({orderQuantity(order)} items)
            </h3>
          </div>

          <div className="table-container" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {shipment.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
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
                        <strong style={{ fontSize: "13px" }}>
                          {item.name}
                        </strong>
                      </div>
                    </td>
                    <td style={{ fontFamily: "monospace", fontSize: "12px" }}>
                      {item.sku || "—"}
                    </td>
                    <td>{item.quantity}</td>
                    <td>{commerceMoney(item.unitPrice)}</td>
                    <td style={{ textAlign: "right", fontWeight: 600 }}>
                      {commerceMoney(lineTotal(item))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Order / Shipping Timeline */}
        <div
          className="panel"
          style={{ padding: "24px", gridColumn: "1 / -1" }}
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
            <h3 style={{ margin: 0 }}>Order & Shipping Timeline</h3>
          </div>

          <div
            className="timeline-container"
            style={{
              position: "relative",
              paddingLeft: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Vertical timeline connector bar */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                bottom: "10px",
                left: "8px",
                width: "2px",
                background: "var(--color-border)",
              }}
            />

            {timelineEvents.map((event, idx) => {
              const isDelivered = event.status === "Delivered";
              return (
                <div
                  key={idx}
                  style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {/* Timeline circle indicator */}
                  <div
                    style={{
                      position: "absolute",
                      left: "-28px",
                      top: "2px",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: isDelivered
                        ? "var(--color-success)"
                        : "var(--color-gold)",
                      border: "3px solid var(--color-surface)",
                      boxShadow: "0 0 0 1px var(--color-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <strong style={{ fontSize: "14px" }}>{event.status}</strong>
                    <span
                      className="muted"
                      style={{
                        fontSize: "12px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Calendar size={12} />
                      {displayDate(event.date, true)}
                    </span>
                  </div>

                  {event.notes && (
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: "12.5px",
                        color: "var(--color-text-secondary)",
                        lineHeight: "1.4",
                      }}
                    >
                      {event.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
