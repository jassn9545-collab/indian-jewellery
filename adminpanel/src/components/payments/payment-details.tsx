/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  User,
  ShoppingBag,
  RotateCcw,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  ShieldCheck,
  Building,
} from "lucide-react";
import {
  PaymentRecord,
  commerceMoney,
  displayDate,
  lineTotal,
} from "@/lib/commerce";
import { PaymentStatusBadge } from "./payments-list";

interface PaymentDetailsProps {
  payment: PaymentRecord;
}

export function PaymentDetails({ payment }: PaymentDetailsProps) {
  const { order } = payment;

  return (
    <div className="payment-details-layout">
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
            href="/admin/payments"
            className="button secondary"
            style={{ minHeight: "36px", padding: "6px 14px" }}
          >
            <ArrowLeft size={15} />
            Back to Payments
          </Link>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h1 style={{ margin: 0 }}>Transaction {payment.id}</h1>
              <PaymentStatusBadge status={payment.status} />
            </div>
            <p className="muted" style={{ margin: "4px 0 0" }}>
              Processed for Order {payment.orderId} ·{" "}
              {displayDate(payment.date, true)}
            </p>
          </div>
        </div>

        <Link
          href={`/admin/orders/${payment.orderId}`}
          className="button"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
        >
          <ShoppingBag size={15} />
          View Linked Order
        </Link>
      </div>

      {/* Security Assurance Banner */}
      <div
        className="panel"
        style={{
          padding: "12px 16px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "var(--color-surface-secondary)",
          borderColor: "var(--color-border)",
          fontSize: "var(--type-small)",
        }}
      >
        <ShieldCheck size={18} style={{ color: "var(--color-success)" }} />
        <span>
          <strong>Payment Gateway Verified:</strong> All sensitive payment
          credentials (full card numbers, CVVs, UPI PINs) are tokenized and
          encrypted by the payment gateway and are never stored on this server.
        </span>
      </div>

      {/* Grid of 4 Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        {/* 1. Payment Information */}
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
            <h3 style={{ margin: 0 }}>Payment Information</h3>
          </div>

          <div
            className="details-list"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              fontSize: "var(--type-small)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Transaction Reference ID</span>
              <strong style={{ fontFamily: "var(--font-body)", fontVariantNumeric: "tabular-nums", fontSize: "var(--type-small)" }}>
                {payment.id}
              </strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Order Reference</span>
              <Link
                href={`/admin/orders/${payment.orderId}`}
                style={{
                  color: "var(--color-primary)",
                  fontFamily: "var(--font-body)", fontVariantNumeric: "tabular-nums",
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                {payment.orderId}
              </Link>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Payment Method</span>
              <span style={{ fontWeight: 600 }}>{payment.method}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="muted">Payment Status</span>
              <PaymentStatusBadge status={payment.status} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Transaction Date</span>
              <span>{displayDate(payment.date, true)}</span>
            </div>

            {payment.bank && (
              <div
                style={{
                  background: "var(--color-surface-secondary)",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  fontSize: "var(--type-small)",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <Building size={14} className="muted" />
                  <strong>Bank / Issuer:</strong> {payment.bank.name}
                </div>
                {payment.bank.accountLast4 && (
                  <span className="muted">
                    Masked Account: •••• {payment.bank.accountLast4}
                  </span>
                )}
              </div>
            )}

            <div
              style={{
                borderTop: "2px solid var(--color-border)",
                paddingTop: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "var(--type-body)", fontWeight: 600 }}>
                Total Paid Amount
              </span>
              <strong
                style={{
                  fontSize: "var(--type-card)",
                  color: "var(--color-primary)",
                }}
              >
                {commerceMoney(payment.amount)}
              </strong>
            </div>
          </div>
        </div>

        {/* 2. Customer Information */}
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
            className="details-list"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              fontSize: "var(--type-small)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Customer Name</span>
              <strong>{payment.customerName}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Email Address</span>
              <span>{payment.customerEmail}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Phone Number</span>
              <span>{payment.customerPhone || "—"}</span>
            </div>

            {order?.customer?.billingAddress && (
              <div style={{ marginTop: "8px" }}>
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
                    fontSize: "var(--type-small)",
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
            )}
          </div>
        </div>

        {/* 3. Order Information */}
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
            <FileText size={18} style={{ color: "var(--color-primary)" }} />
            <h3 style={{ margin: 0 }}>Order Information (Order #{order.id})</h3>
          </div>

          <div className="table-container" style={{ overflowX: "auto" }}>
            <table>
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
                  const itemLineTotal = lineTotal(item);
                  return (
                    <tr key={idx}>
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
                          <strong style={{ fontSize: "var(--type-small)" }}>
                            {item.name}
                          </strong>
                        </div>
                      </td>
                      <td style={{ fontFamily: "var(--font-body)", fontVariantNumeric: "tabular-nums", fontSize: "var(--type-small)" }}>
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
                        {commerceMoney(itemLineTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "16px",
              paddingTop: "12px",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <div
              style={{
                width: "280px",
                fontSize: "var(--type-small)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="muted">Order Amount:</span>
                <strong>{commerceMoney(payment.amount)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="muted">Shipping:</span>
                <span style={{ color: "var(--color-success)" }}>FREE</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "2px solid var(--color-border)",
                  paddingTop: "8px",
                  fontSize: "var(--type-product)",
                  fontWeight: 600,
                  color: "var(--color-primary)",
                }}
              >
                <span>Total Settled:</span>
                <span>{commerceMoney(payment.amount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Refund Information (when available) */}
        {payment.refund ? (
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
              <RotateCcw size={18} style={{ color: "var(--color-info)" }} />
              <h3 style={{ margin: 0 }}>Refund Information</h3>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                fontSize: "var(--type-small)",
              }}
            >
              <div>
                <span
                  className="muted"
                  style={{ display: "block", marginBottom: "4px" }}
                >
                  Refund Status
                </span>
                <span className="status-badge badge-info">
                  {payment.refund.status}
                </span>
              </div>

              <div>
                <span
                  className="muted"
                  style={{ display: "block", marginBottom: "4px" }}
                >
                  Refund Amount
                </span>
                <strong
                  style={{ fontSize: "var(--type-body-large)", color: "var(--color-primary)" }}
                >
                  {commerceMoney(payment.refund.amount)}
                </strong>
              </div>

              <div>
                <span
                  className="muted"
                  style={{ display: "block", marginBottom: "4px" }}
                >
                  Refund Date
                </span>
                <span>{displayDate(payment.refund.date, true)}</span>
              </div>

              <div>
                <span
                  className="muted"
                  style={{ display: "block", marginBottom: "4px" }}
                >
                  Refund Reference ID
                </span>
                <span style={{ fontFamily: "var(--font-body)", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                  {payment.refund.referenceId}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
