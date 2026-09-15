"use client";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/modal";
import { ShieldCheck, CreditCard } from "lucide-react";
import { useShop } from "@/store/shop";
import { products, money } from "@/lib/catalog";
import {
  RazorpayInformation,
  RazorpayPreview,
} from "@/components/checkout/razorpay-details";
const schema = z.object({
  name: z.string().min(2, "Enter your full name."),
  email: z.email("Enter a valid email."),
  phone: z
    .string()
    .regex(/^[6-9][0-9]{9}$/, "Enter a valid 10-digit Indian mobile number."),
  address: z.string().min(8, "Enter your complete address."),
  city: z.string().min(2, "Enter your city."),
  state: z.string().min(2, "Enter your state."),
  pin: z.string().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode."),
});
type Form = z.infer<typeof schema>;
function Checkout() {
  const bag = useShop((s) => s.bag);
  const query = useSearchParams();
  const [review, setReview] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) });
  const items = bag.flatMap((i) => {
    const p = products.find((p) => p.id === i.id);
    return p ? [{ ...i, product: p }] : [];
  });
  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );
  const discount =
    query.get("offer") === "WELCOME10" ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal >= 799 ? 0 : 79;
  return (
    <main id="main" className="container page-shell">
      <div className="page-heading">
        <h1>A little closer to yours</h1>
      </div>
      {!items.length ? (
        <div className="empty-state">
          <h2>Your bag is empty</h2>
          <Link className="button" href="/collections/all">
            Explore jewellery
          </Link>
        </div>
      ) : (
        <>
          <div className="notice">
            Store preview: checkout is not live. No payment will be taken and no
            order will be placed.
          </div>
          {paymentOpen && (
            <Modal
              title="Razorpay payment preview"
              onClose={() => setPaymentOpen(false)}
              footer={(close) => (
                <button
                  type="button"
                  className="button full"
                  onClick={() => close()}
                >
                  Back to checkout
                </button>
              )}
            >
              <RazorpayPreview
                subtotal={subtotal}
                discount={discount}
                shipping={shipping}
                email={getValues("email")}
              />
            </Modal>
          )}
          <div className="checkout-layout">
            <form
              onChange={() => setReview(false)}
              onSubmit={handleSubmit(() => {
                setReview(true);
                setPaymentOpen(true);
              })}
              noValidate
            >
              <h2 style={{ marginBottom: 24 }}>Delivery details</h2>
              <div className="form-grid">
                {(
                  [
                    ["name", "Full name", "name"],
                    ["email", "Email", "email"],
                    ["phone", "Mobile number", "tel"],
                    ["address", "Street address", "street-address"],
                    ["city", "City", "address-level2"],
                    ["state", "State", "address-level1"],
                    ["pin", "Pincode", "postal-code"],
                  ] as const
                ).map(([key, label, auto]) => (
                  <label
                    key={key}
                    className={key === "address" ? "span-2" : ""}
                  >
                    {label}
                    <input
                      type={key === "email" ? "email" : "text"}
                      autoComplete={auto}
                      inputMode={
                        key === "pin" || key === "phone" ? "numeric" : undefined
                      }
                      {...register(key)}
                      aria-invalid={!!errors[key]}
                    />
                    {errors[key] && (
                      <span className="form-error" role="alert">
                        {errors[key]?.message}
                      </span>
                    )}
                  </label>
                ))}
              </div>
              <fieldset className="checkout-payment">
                <legend>Payment method</legend>
                <label className="checkout-payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    defaultChecked
                    aria-describedby="razorpay-preview-note"
                  />
                  <CreditCard size={24} aria-hidden="true" />
                  <span>
                    <strong>Razorpay</strong>
                    <span className="checkout-payment-caption">
                      UPI, cards, netbanking and wallets
                    </span>
                  </span>
                </label>
                <RazorpayInformation />
                <p id="razorpay-preview-note" className="fine-print">
                  Preview the payment step after entering your delivery details.
                  No payment information is collected.
                </p>
              </fieldset>
              <button
                className="button"
                style={{ marginTop: 24 }}
                type="submit"
              >
                Preview Razorpay payment
              </button>
              {review && (
                <p className="notice" role="status" style={{ marginTop: 24 }}>
                  Your details are valid. Razorpay is selected for this preview.
                  No payment has been made or order placed. Your bag is
                  unchanged.
                </p>
              )}
            </form>
            <section>
              <h2>Order summary</h2>
              <dl className="summary">
                {items.map((i) => (
                  <div key={i.id}>
                    <dt>
                      {i.product.name} &times; {i.quantity}
                    </dt>
                    <dd>{money(i.product.price * i.quantity)}</dd>
                  </div>
                ))}
                <div>
                  <dt>Discount</dt>
                  <dd>-{money(discount)}</dd>
                </div>
                <div>
                  <dt>Shipping</dt>
                  <dd>{shipping ? money(shipping) : "Complimentary"}</dd>
                </div>
                <div>
                  <dt>Taxes</dt>
                  <dd>Included in MRP</dd>
                </div>
                <div className="total">
                  <dt>Total</dt>
                  <dd>{money(subtotal - discount + shipping)}</dd>
                </div>
              </dl>
              <p className="fine-print">
                <ShieldCheck size={16} style={{ display: "inline" }} /> Your
                payment details are never collected in this preview.
              </p>
              <Link className="text-link" href="/cart">
                Edit your bag
              </Link>
            </section>
          </div>
        </>
      )}
    </main>
  );
}
export default function Page() {
  return (
    <Suspense
      fallback={
        <main id="main" className="container page-shell">
          Loading checkout...
        </main>
      }
    >
      <Checkout />
    </Suspense>
  );
}
