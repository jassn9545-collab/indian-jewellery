"use client";
import { useState } from "react";
import Link from "next/link";
import { UserRound } from "lucide-react";
const tabs = [
  "Profile",
  "Orders",
  "Wishlist",
  "Addresses",
  "Saved Payments",
  "Returns",
];
export default function Page() {
  const [tab, setTab] = useState("Profile");
  const [saved, setSaved] = useState(false);
  return (
    <main id="main" className="container page-shell">
      <div className="page-heading">
        <h1>Your Indian Jewellery</h1>
        <p>A space for your favourite pieces and beautiful moments.</p>
      </div>
      <div className="notice">
        Account preview. Sign-in, saved addresses and order history will be
        available at launch.
      </div>
      <div className="account-tabs" role="group" aria-label="Account sections">
        {tabs.map((t) => (
          <button
            key={t}
            aria-pressed={tab === t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <section>
        {tab === "Profile" ? (
          <form
            style={{ maxWidth: 600 }}
            onChange={() => setSaved(false)}
            onSubmit={(e) => {
              e.preventDefault();
              setSaved(true);
            }}
          >
            <h2 style={{ marginBottom: 24 }}>Your profile</h2>
            <div className="form-grid">
              <label>
                Full name
                <input required name="name" autoComplete="name" minLength={2} />
              </label>
              <label>
                Email
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                />
              </label>
            </div>
            <button className="button" style={{ marginTop: 24 }}>
              Review profile
            </button>
            {saved && (
              <p className="notice" role="status" style={{ marginTop: 20 }}>
                Your profile details are ready. Account saving will be available
                at launch.
              </p>
            )}
          </form>
        ) : tab === "Wishlist" ? (
          <div className="empty-state">
            <h2>Your saved favourites</h2>
            <Link className="button" href="/wishlist">
              Open wishlist
            </Link>
          </div>
        ) : (
          <div className="empty-state">
            <UserRound size={36} />
            <h2>
              {tab === "Orders"
                ? "Your story is just beginning"
                : tab === "Addresses"
                  ? "A place for your treasures"
                  : tab === "Returns"
                    ? "No returns to show"
                    : "Your payment preferences"}
            </h2>
            <p>
              {tab === "Orders"
                ? "Your orders and tracking details will appear here after launch."
                : tab === "Addresses"
                  ? "Delivery addresses can be saved once accounts are available."
                  : tab === "Returns"
                    ? "Return requests will be available for eligible orders."
                    : "Payment methods can be managed once secure checkout is available."}
            </p>
            <Link className="button secondary" href="/collections/all">
              Continue shopping
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
