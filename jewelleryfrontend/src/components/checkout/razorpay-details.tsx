"use client";
import { useId, useState } from "react";
import {
  CreditCard,
  Landmark,
  QrCode,
  Wallet,
  ShieldCheck,
} from "lucide-react";
import { money } from "@/lib/catalog";

const methods = [
  {
    id: "upi",
    title: "UPI",
    Icon: QrCode,
    summary: "Google Pay, PhonePe, Paytm & any UPI app.",
    detail:
      "In live checkout, choose an available UPI app and approve the request there. Enter your UPI PIN only inside your UPI app.",
  },
  {
    id: "card",
    title: "Credit / debit card",
    Icon: CreditCard,
    summary: "Visa, Mastercard, RuPay & more.",
    detail:
      "In live checkout, Razorpay collects your card details and your bank may ask you to verify the payment. No card details are collected in this preview.",
  },
  {
    id: "netbanking",
    title: "Netbanking",
    Icon: Landmark,
    summary: "All major Indian banks supported.",
    detail:
      "In live checkout, choose a supported bank and complete its authentication steps. You return to the store after the bank processes the payment.",
  },
  {
    id: "wallet",
    title: "Wallets",
    Icon: Wallet,
    summary: "Amazon Pay, Mobikwik & more.",
    detail:
      "In live checkout, select a supported wallet and follow its approval steps. Available wallets depend on the merchant's enabled payment methods.",
  },
] as const;

export function RazorpayInformation() {
  return (
    <div className="payment-information">
      <p>
        Razorpay supports UPI, credit/debit cards, netbanking and wallets.
        Available options will be shown in the live checkout.
      </p>
      <div className="payment-method-chips">
        {methods.map(({ id, title, Icon }) => (
          <span key={id}>
            <Icon size={16} aria-hidden="true" />
            {title}
          </span>
        ))}
      </div>
      <p className="payment-security">
        <ShieldCheck size={18} aria-hidden="true" /> This store is in preview.
        No payment is taken.
      </p>
    </div>
  );
}

export function RazorpayPreview({
  subtotal,
  discount,
  shipping,
  email,
}: {
  subtotal: number;
  discount: number;
  shipping: number;
  email: string;
}) {
  const [selected, setSelected] =
    useState<(typeof methods)[number]["id"]>("upi");
  const id = useId();
  const method = methods.find((item) => item.id === selected)!;
  return (
    <div className="payment-preview">
      <p className="notice">
        Payment preview only. No money will be charged and no order will be
        placed.
      </p>
      <dl className="summary">
        <div>
          <dt>Payment provider</dt>
          <dd>Razorpay</dd>
        </div>
        <div>
          <dt>Subtotal</dt>
          <dd>{money(subtotal)}</dd>
        </div>
        <div>
          <dt>Discount</dt>
          <dd>-{money(discount)}</dd>
        </div>
        <div>
          <dt>Delivery</dt>
          <dd>{shipping ? money(shipping) : "Complimentary"}</dd>
        </div>
        <div className="total">
          <dt>Order total</dt>
          <dd>{money(subtotal - discount + shipping)}</dd>
        </div>
      </dl>
      <p className="payment-email">
        Contact email <strong>{email}</strong>
      </p>
      <fieldset className="payment-methods">
        <legend>Explore payment methods</legend>
        {methods.map(({ id: value, title, Icon, summary }) => (
          <label key={value} className={selected === value ? "selected" : ""}>
            <input
              type="radio"
              name={id}
              value={value}
              checked={selected === value}
              onChange={() => setSelected(value)}
            />
            <Icon size={20} aria-hidden="true" />
            <span>
              <strong>{title}</strong>
              <small>{summary}</small>
            </span>
          </label>
        ))}
      </fieldset>
      <div className="payment-explanation" role="status">
        <h3>{method.title}</h3>
        <p>{method.detail}</p>
      </div>
      <p className="payment-security">
        <ShieldCheck size={18} aria-hidden="true" /> Never share a UPI PIN, card
        OTP or bank password with the store.
      </p>
    </div>
  );
}
