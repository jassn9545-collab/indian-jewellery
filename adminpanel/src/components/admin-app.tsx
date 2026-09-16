/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useState, type FormEvent } from "react";
import {
  LayoutDashboard,
  Diamond,
  Grid2X2,
  Megaphone,
  House,
  Sparkles,
  Crown,
  Layers,
  Circle,
  Star,
  Play,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  ShoppingBag,
  Boxes,
  Users,
  CreditCard,
  Truck,
  BarChart3,
  Settings as SettingsIcon,
  CheckCircle2,
  ArrowRight,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  type Database,
  type Entry,
  type Module,
  modules,
} from "@/lib/admin-data";
import {
  type CommerceData,
  type Order,
  type OrderUpdate,
  type ReturnStatus,
} from "@/lib/commerce";
import {
  authService,
  repository,
  commerceRepository,
  type Session,
} from "@/lib/storage";
import { ConfirmModal, ErrorState, LoadingState, Modal } from "./ui";
import { Dashboard } from "./dashboard";
import { EntryList, EntryPreview } from "./entry-list";
import { EntryForm } from "./entry-form";
import { OrdersList } from "./orders/orders-list";
import { OrderDetails } from "./orders/order-details";
import { ReturnsList } from "./orders/returns-list";
import { CustomersList } from "./customers/customers-list";
import { CustomerDetails } from "./customers/customer-details";
import { PaymentsList } from "./payments/payments-list";
import { PaymentDetails } from "./payments/payment-details";
import { ShippingList } from "./shipping/shipping-list";
import { ShippingDetails } from "./shipping/shipping-details";
import {
  type CustomerRecord,
  projectPayments,
  projectShipments,
} from "@/lib/commerce";

const icons = {
  diamond: Diamond,
  grid: Grid2X2,
  ribbon: Megaphone,
  home: House,
  spark: Sparkles,
  crown: Crown,
  layers: Layers,
  circle: Circle,
  star: Star,
  play: Play,
  message: MessageSquare,
};
export function AdminApp() {
  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean).slice(1);
  const section = parts[0] || "dashboard";
  const isAuth = section === "login" || section === "signup";
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [db, setDb] = useState<Database | null>(null);
  const [commerce, setCommerce] = useState<CommerceData | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [logout, setLogout] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const isOrders = section === "orders";
  const activeOrderSub = !isOrders
    ? null
    : parts[1] === "returns"
      ? "returns"
      : parts[1]
        ? "details"
        : "all";
  const [ordersExpanded, setOrdersExpanded] = useState(isOrders);
  useEffect(() => {
    if (isOrders) {
      setOrdersExpanded(true);
    }
  }, [isOrders]);
  useEffect(() => {
    let alive = true;
    Promise.resolve()
      .then(async () => {
        const current = authService.session();
        if (!alive) return;
        setSession(current);
        setReady(true);
        if (!current && !isAuth) {
          router.replace("/admin/login");
          return;
        }
        if (current && isAuth) {
          router.replace("/admin/dashboard");
          return;
        }
        if (current) {
          const [data, ws] = await Promise.all([
            repository.load(),
            commerceRepository.load(),
          ]);
          if (alive) {
            setDb(data);
            setCommerce(ws.commerce);
          }
        }
      })
      .catch((e) => {
        if (alive) {
          setError(e.message);
          setReady(true);
        }
      });
    return () => {
      alive = false;
    };
  }, [isAuth, router]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const channel = new BroadcastChannel("ij-admin-catalog");
    channel.onmessage = () =>
      Promise.all([repository.load(), commerceRepository.load()])
        .then(([data, ws]) => {
          setDb(data);
          setCommerce(ws.commerce);
        })
        .catch((e) => setError(e.message));
    return () => channel.close();
  }, []);
  async function save(moduleKey: Module, rows: Entry[], message: string) {
    if (!db) return;
    const next = { ...db, [moduleKey]: rows };
    await repository.save(next);
    setDb(next);
    setToast(message);
    const channel = new BroadcastChannel("ij-admin-catalog");
    channel.postMessage("updated");
    channel.close();
  }
  async function handleUpdateOrder(update: OrderUpdate, version: number) {
    const orderId =
      parts[1] === ":id" ? commerce?.orders[0]?.id || "DEMO-1001" : parts[1];
    if (!orderId) return;
    const ws = await commerceRepository.updateOrder(orderId, update, version);
    setCommerce(ws.commerce);
    setDb(ws.catalog);
    const channel = new BroadcastChannel("ij-admin-catalog");
    channel.postMessage("updated");
    channel.close();
  }
  async function handleUpdateReturn(
    id: string,
    status: ReturnStatus,
    notes?: string,
  ) {
    const ws = await commerceRepository.updateReturn(id, status, notes);
    setCommerce(ws.commerce);
    const channel = new BroadcastChannel("ij-admin-catalog");
    channel.postMessage("updated");
    channel.close();
  }
  async function handleUpdateCustomer(
    id: string,
    update: Partial<CustomerRecord>,
  ) {
    const ws = await commerceRepository.updateCustomer(id, update);
    setCommerce(ws.commerce);
    const channel = new BroadcastChannel("ij-admin-catalog");
    channel.postMessage("updated");
    channel.close();
  }
  async function handleDeleteCustomer(id: string) {
    const ws = await commerceRepository.deleteCustomer(id);
    setCommerce(ws.commerce);
    const channel = new BroadcastChannel("ij-admin-catalog");
    channel.postMessage("updated");
    channel.close();
  }
  if (!ready) return <LoadingState />;
  if (isAuth)
    return (
      <AuthPage
        signup={section === "signup"}
        onComplete={(user) => {
          setSession(user);
          router.replace("/admin/dashboard");
        }}
        key={section}
      />
    );
  if (error)
    return (
      <ErrorState message={error} retry={() => window.location.reload()} />
    );
  if (!session || !db) return <LoadingState />;
  const moduleKey = modules.find((m) => m[0] === section)?.[0];
  const label =
    section === "dashboard"
      ? "Dashboard"
      : isOrders
        ? activeOrderSub === "returns"
          ? "Returns"
          : activeOrderSub === "details"
            ? "Order Details"
            : "All Orders"
        : section === "customers"
          ? parts.length > 1
            ? "Customer Details"
            : "Customers"
          : section === "payments"
            ? parts.length > 1
              ? "Payment Details"
              : "Payments"
            : section === "shipping"
              ? parts.length > 1
                ? "Shipping Details"
                : "Shipping"
              : ["inventory", "analytics", "settings"].includes(section)
                ? section.charAt(0).toUpperCase() + section.slice(1)
                : modules.find((m) => m[0] === section)?.[1] ||
                  "Page not found";
  function nav(close = false) {
    return (
      <>
        <div className="sidebar-brand">
          <img src="/images/indian-jewellery-logo.png" alt="Indian Jewellery" />
          <span>STORE ADMINISTRATION</span>
        </div>
        <div className="sidebar-scroll">
          <div className="nav-label">WORKSPACE</div>
          <Link
            href="/admin/dashboard"
            className={`nav-link ${section === "dashboard" ? "active" : ""}`}
            aria-current={section === "dashboard" ? "page" : undefined}
            onClick={() => {
              if (close) setDrawer(false);
            }}
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
            {section === "dashboard" && <span className="active-dot" />}
          </Link>

          <Link
            href="/admin/products"
            className={`nav-link ${section === "products" ? "active" : ""}`}
            aria-current={section === "products" ? "page" : undefined}
            onClick={() => {
              if (close) setDrawer(false);
            }}
          >
            <Diamond size={18} />
            <span>Products</span>
            {section === "products" && <span className="active-dot" />}
          </Link>

          <Link
            href="/admin/categories"
            className={`nav-link ${section === "categories" ? "active" : ""}`}
            aria-current={section === "categories" ? "page" : undefined}
            onClick={() => {
              if (close) setDrawer(false);
            }}
          >
            <Grid2X2 size={18} />
            <span>Categories</span>
            {section === "categories" && <span className="active-dot" />}
          </Link>

          <Link
            href="/admin/inventory"
            className={`nav-link ${section === "inventory" ? "active" : ""}`}
            aria-current={section === "inventory" ? "page" : undefined}
            onClick={() => {
              if (close) setDrawer(false);
            }}
          >
            <Boxes size={18} />
            <span>Inventory</span>
            {section === "inventory" && <span className="active-dot" />}
          </Link>

          <button
            type="button"
            className={`nav-link nav-parent ${isOrders ? "parent-active" : ""}`}
            aria-expanded={ordersExpanded}
            onClick={() => setOrdersExpanded((prev) => !prev)}
          >
            <ShoppingBag size={18} />
            <span>Orders</span>
            <ChevronDown
              size={15}
              className={`nav-chevron ${ordersExpanded ? "expanded" : ""}`}
            />
          </button>
          <div
            className={`nav-submenu ${ordersExpanded ? "expanded" : ""}`}
            role="region"
            aria-label="Orders submenu"
          >
            <div className="orders-tree">
              <div
                className={`orders-tree-node ${activeOrderSub === "all" ? "active" : ""}`}
              >
                <Link
                  href="/admin/orders"
                  className={`nav-sub-link ${activeOrderSub === "all" ? "active-gold active" : ""}`}
                  aria-current={activeOrderSub === "all" ? "page" : undefined}
                  onClick={() => {
                    if (close) setDrawer(false);
                  }}
                >
                  <span>All Orders</span>
                  {activeOrderSub === "all" && <span className="active-dot" />}
                </Link>
              </div>
              <div
                className={`orders-tree-node ${activeOrderSub === "details" ? "active" : ""}`}
              >
                <Link
                  href={
                    activeOrderSub === "details"
                      ? pathname
                      : "/admin/orders/:id"
                  }
                  className={`nav-sub-link ${activeOrderSub === "details" ? "active-gold active" : ""}`}
                  aria-current={
                    activeOrderSub === "details" ? "page" : undefined
                  }
                  onClick={() => {
                    if (close) setDrawer(false);
                  }}
                >
                  <span>Order Details</span>
                  {activeOrderSub === "details" && (
                    <span className="active-dot" />
                  )}
                </Link>
              </div>
              <div
                className={`orders-tree-node ${activeOrderSub === "returns" ? "active" : ""}`}
              >
                <Link
                  href="/admin/orders/returns"
                  className={`nav-sub-link ${activeOrderSub === "returns" ? "active-gold active" : ""}`}
                  aria-current={
                    activeOrderSub === "returns" ? "page" : undefined
                  }
                  onClick={() => {
                    if (close) setDrawer(false);
                  }}
                >
                  <span>Returns</span>
                  {activeOrderSub === "returns" && (
                    <span className="active-dot" />
                  )}
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/admin/customers"
            className={`nav-link ${section === "customers" ? "active" : ""}`}
            aria-current={section === "customers" ? "page" : undefined}
            onClick={() => {
              if (close) setDrawer(false);
            }}
          >
            <Users size={18} />
            <span>Customers</span>
            {section === "customers" && <span className="active-dot" />}
          </Link>

          <Link
            href="/admin/payments"
            className={`nav-link ${section === "payments" ? "active" : ""}`}
            aria-current={section === "payments" ? "page" : undefined}
            onClick={() => {
              if (close) setDrawer(false);
            }}
          >
            <CreditCard size={18} />
            <span>Payments</span>
            {section === "payments" && <span className="active-dot" />}
          </Link>

          <Link
            href="/admin/shipping"
            className={`nav-link ${section === "shipping" ? "active" : ""}`}
            aria-current={section === "shipping" ? "page" : undefined}
            onClick={() => {
              if (close) setDrawer(false);
            }}
          >
            <Truck size={18} />
            <span>Shipping</span>
            {section === "shipping" && <span className="active-dot" />}
          </Link>

          <div className="nav-divider" />

          <div className="nav-label">CATALOG & CONTENT</div>
          {modules
            .filter(([key]) => key !== "products" && key !== "categories")
            .map(([key, text, icon]) => {
              const Icon = icons[icon];
              return (
                <Link
                  key={key}
                  href={`/admin/${key}`}
                  className={`nav-link ${section === key ? "active" : ""}`}
                  aria-current={section === key ? "page" : undefined}
                  onClick={() => {
                    if (close) setDrawer(false);
                  }}
                >
                  <Icon size={18} />
                  <span>{text}</span>
                  {section === key && <span className="active-dot" />}
                </Link>
              );
            })}

          <div className="nav-divider" />

          <div className="nav-label">INSIGHTS & SYSTEM</div>
          <Link
            href="/admin/analytics"
            className={`nav-link ${section === "analytics" ? "active" : ""}`}
            aria-current={section === "analytics" ? "page" : undefined}
            onClick={() => {
              if (close) setDrawer(false);
            }}
          >
            <BarChart3 size={18} />
            <span>Analytics</span>
            {section === "analytics" && <span className="active-dot" />}
          </Link>

          <Link
            href="/admin/settings"
            className={`nav-link ${section === "settings" ? "active" : ""}`}
            aria-current={section === "settings" ? "page" : undefined}
            onClick={() => {
              if (close) setDrawer(false);
            }}
          >
            <SettingsIcon size={18} />
            <span>Settings</span>
            {section === "settings" && <span className="active-dot" />}
          </Link>
        </div>
        <div className="sidebar-footer">
          <div className="sidebar-note">
            <Sparkles size={17} />
            <span>
              Thoughtfully curated.
              <br />
              <strong>Beautifully managed.</strong>
            </span>
          </div>
          <button
            className="nav-link"
            onClick={() => {
              setDrawer(false);
              setLogout(true);
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </>
    );
  }
  let content;
  if (section === "dashboard" && parts.length <= 1)
    content = <Dashboard db={db} name={session.name} />;
  else if (moduleKey) {
    const action = parts[1];
    const id = parts[2];
    const existing = db[moduleKey].find((e) => e.id === id);
    const categoryProducts =
      moduleKey === "categories" &&
      parts[2] === "products" &&
      parts.length === 3;
    if (categoryProducts && db.categories.some((c) => c.id === parts[1]))
      content = (
        <EntryList
          key={pathname}
          module="products"
          db={db}
          categoryId={parts[1]}
          onChange={(rows, message) => save("products", rows, message)}
        />
      );
    else if (!action && parts.length === 1)
      content = (
        <EntryList
          key={pathname}
          module={moduleKey}
          db={db}
          onChange={(rows, message) => save(moduleKey, rows, message)}
        />
      );
    else if (
      (action === "add" && parts.length === 2) ||
      (action === "edit" && existing && parts.length === 3)
    )
      content = (
        <EntryForm
          key={pathname}
          module={moduleKey}
          db={db}
          existing={existing}
          onSave={async (entry) => {
            await save(
              moduleKey,
              existing
                ? db[moduleKey].map((e) => (e.id === entry.id ? entry : e))
                : [...db[moduleKey], entry],
              existing
                ? "Changes saved successfully"
                : "Item added successfully",
            );
            router.push(`/admin/${moduleKey}`);
          }}
        />
      );
    else if (action === "view" && existing && parts.length === 3)
      content = (
        <>
          <div className="page-heading">
            <h1>{existing.name || existing.title || label}</h1>
            <Link
              className="button"
              href={`/admin/${moduleKey}/edit/${existing.id}`}
            >
              Edit item
            </Link>
          </div>
          <div className="panel form-panel">
            <EntryPreview db={db} entry={existing} />
          </div>
        </>
      );
  } else if (isOrders) {
    if (activeOrderSub === "all") {
      content = (
        <OrdersList orders={commerce?.orders || []} loading={!commerce} />
      );
    } else if (activeOrderSub === "returns") {
      content = (
        <ReturnsList
          returns={commerce?.returns || []}
          loading={!commerce}
          onUpdateStatus={handleUpdateReturn}
          onToast={setToast}
        />
      );
    } else if (activeOrderSub === "details") {
      const orderId =
        parts[1] === ":id" ? commerce?.orders[0]?.id || "DEMO-1001" : parts[1];
      const order = (commerce?.orders || []).find((o) => o.id === orderId);
      if (order) {
        content = (
          <OrderDetails
            order={order}
            onUpdate={handleUpdateOrder}
            onToast={setToast}
          />
        );
      } else {
        content = (
          <div
            className="panel empty-panel"
            style={{ padding: "48px 24px", textAlign: "center" }}
          >
            <ShoppingBag
              size={42}
              style={{
                color: "var(--color-text-muted)",
                margin: "0 auto 16px",
              }}
            />
            <h3>Order not found</h3>
            <p className="muted" style={{ margin: "8px auto 20px" }}>
              Order "{parts[1]}" could not be located in the store catalog.
            </p>
            <Link href="/admin/orders" className="button">
              Back to All Orders
            </Link>
          </div>
        );
      }
    }
  } else if (section === "customers") {
    if (parts.length === 1) {
      content = (
        <CustomersList
          customers={commerce?.customers || []}
          orders={commerce?.orders || []}
          loading={!commerce}
          onUpdateCustomer={handleUpdateCustomer}
          onDeleteCustomer={handleDeleteCustomer}
          onToast={setToast}
        />
      );
    } else {
      const customerId =
        parts[1] === ":id"
          ? commerce?.customers[0]?.id || "CUST-1001"
          : parts[1];
      const customer = (commerce?.customers || []).find(
        (c) =>
          c.id.toLowerCase() === customerId.toLowerCase() ||
          c.email.toLowerCase() === customerId.toLowerCase(),
      );
      if (customer) {
        content = (
          <CustomerDetails
            customer={customer}
            orders={commerce?.orders || []}
            onUpdateCustomer={handleUpdateCustomer}
            onToast={setToast}
          />
        );
      } else {
        content = (
          <div
            className="panel empty-panel"
            style={{ padding: "48px 24px", textAlign: "center" }}
          >
            <Users
              size={42}
              style={{
                color: "var(--color-text-muted)",
                margin: "0 auto 16px",
              }}
            />
            <h3>Customer not found</h3>
            <p className="muted" style={{ margin: "8px auto 20px" }}>
              Customer "{parts[1]}" could not be located in the store records.
            </p>
            <Link href="/admin/customers" className="button">
              Back to Customers
            </Link>
          </div>
        );
      }
    }
  } else if (section === "payments") {
    if (parts.length === 1) {
      content = (
        <PaymentsList orders={commerce?.orders || []} loading={!commerce} />
      );
    } else {
      const paymentId =
        parts[1] === ":id"
          ? commerce?.orders[0]?.payment?.reference || "DEMO-PAY-1002"
          : parts[1];
      const payments = projectPayments(commerce?.orders || []);
      const payment = payments.find(
        (p) =>
          p.id.toLowerCase() === paymentId.toLowerCase() ||
          p.orderId.toLowerCase() === paymentId.toLowerCase(),
      );
      if (payment) {
        content = <PaymentDetails payment={payment} />;
      } else {
        content = (
          <div
            className="panel empty-panel"
            style={{ padding: "48px 24px", textAlign: "center" }}
          >
            <CreditCard
              size={42}
              style={{
                color: "var(--color-text-muted)",
                margin: "0 auto 16px",
              }}
            />
            <h3>Transaction not found</h3>
            <p className="muted" style={{ margin: "8px auto 20px" }}>
              Payment transaction "{parts[1]}" could not be located in the
              records.
            </p>
            <Link href="/admin/payments" className="button">
              Back to Payments
            </Link>
          </div>
        );
      }
    }
  } else if (section === "shipping") {
    if (parts.length === 1) {
      content = (
        <ShippingList orders={commerce?.orders || []} loading={!commerce} />
      );
    } else {
      const shipmentId =
        parts[1] === ":id" ? commerce?.orders[0]?.id || "DEMO-1001" : parts[1];
      const shipments = projectShipments(commerce?.orders || []);
      const shipment = shipments.find(
        (s) =>
          s.orderId.toLowerCase() === shipmentId.toLowerCase() ||
          (s.trackingNumber &&
            s.trackingNumber !== "—" &&
            s.trackingNumber.toLowerCase() === shipmentId.toLowerCase()),
      );
      if (shipment) {
        content = <ShippingDetails shipment={shipment} />;
      } else {
        content = (
          <div
            className="panel empty-panel"
            style={{ padding: "48px 24px", textAlign: "center" }}
          >
            <Truck
              size={42}
              style={{
                color: "var(--color-text-muted)",
                margin: "0 auto 16px",
              }}
            />
            <h3>Shipment not found</h3>
            <p className="muted" style={{ margin: "8px auto 20px" }}>
              Shipment for "{parts[1]}" could not be located in the tracking
              records.
            </p>
            <Link href="/admin/shipping" className="button">
              Back to Shipping
            </Link>
          </div>
        );
      }
    }
  } else if (["inventory", "analytics", "settings"].includes(section)) {
    const title = section.charAt(0).toUpperCase() + section.slice(1);
    content = (
      <div className="list-panel">
        <div className="page-heading">
          <h1>{title}</h1>
        </div>
        <div
          className="panel"
          style={{ padding: "48px 24px", textAlign: "center" }}
        >
          <p className="muted">
            {title} module preview. Detailed records and configuration will be
            connected in the upcoming release.
          </p>
        </div>
      </div>
    );
  }
  if (!content)
    content = (
      <div className="empty-state">
        <h1>Page not found</h1>
        <p>This item or page could not be found.</p>
        <Link href="/admin/dashboard" className="button">
          Back to dashboard
        </Link>
      </div>
    );
  return (
    <div className={`admin-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <aside className="sidebar" aria-label="Admin navigation">
        {nav()}
      </aside>
      {drawer && (
        <Modal title="Navigation" onClose={() => setDrawer(false)}>
          <nav
            className="drawer-navigation"
            aria-label="Mobile admin navigation"
          >
            {nav(true)}
          </nav>
        </Modal>
      )}
      <div className="admin-main">
        <header className="topbar">
          <div className="header-left">
            <button
              className="icon-button desktop-toggle"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              onClick={() => setCollapsed(!collapsed)}
            >
              <Menu size={20} />
            </button>
            <button
              className="icon-button mobile-toggle"
              aria-label="Open navigation"
              aria-expanded={drawer}
              onClick={() => setDrawer(true)}
            >
              <Menu size={20} />
            </button>
            <span className="header-divider" />
            <span className="header-title">{label}</span>
          </div>
          <div className="profile">
            <span className="workspace-pill">
              <span />
              Store workspace
            </span>
            <div className="avatar">{session.name.charAt(0).toUpperCase()}</div>
            <div className="profile-text">
              <strong>{session.name}</strong>
              <small>Administrator</small>
            </div>
            <button
              className="icon-button"
              aria-label="Logout"
              onClick={() => setLogout(true)}
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <main id="main-content" className="main-content">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/admin/dashboard">Admin</Link>
            <ChevronRight size={13} />
            <Link href={isOrders ? "/admin/orders" : `/admin/${section}`}>
              {isOrders ? "Orders" : label}
            </Link>
            {isOrders && activeOrderSub && activeOrderSub !== "all" && (
              <>
                <ChevronRight size={13} />
                <span>{label}</span>
              </>
            )}
            {!isOrders && parts.length > 1 && (
              <>
                <ChevronRight size={13} />
                <span>
                  {parts[1] === "add"
                    ? "Add new"
                    : parts[1] === "edit"
                      ? "Edit item"
                      : "Details"}
                </span>
              </>
            )}
          </nav>
          {content}
          <footer className="workspace-footer">
            <span>Indian Jewellery · Made with care</span>
            <span>Local preview workspace</span>
          </footer>
        </main>
      </div>
      {logout && (
        <ConfirmModal
          title="Logout"
          message="Are you sure you want to logout?"
          confirmLabel="Confirm Logout"
          onClose={() => setLogout(false)}
          onConfirm={() => {
            authService.logout();
            setSession(null);
            setDb(null);
            setLogout(false);
            router.replace("/admin/login");
          }}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={18} />
          {toast}
          <button
            className="icon-button"
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function AuthPage({
  signup,
  onComplete,
}: {
  signup: boolean;
  onComplete: (user: Session) => void;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email")).trim().toLowerCase();
    const password = String(form.get("password"));
    if (
      signup &&
      (name.length < 2 ||
        password.length < 8 ||
        !/[A-Za-z]/.test(password) ||
        !/[0-9]/.test(password))
    ) {
      setError(
        "Enter your name and a password with at least 8 characters, including a letter and number.",
      );
      return;
    }
    if (signup && password !== form.get("confirm")) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      onComplete(
        signup
          ? await authService.signup(name, email, password)
          : await authService.login(email, password),
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-layout">
      <section className="auth-story">
        <img
          className="auth-logo"
          src="/images/indian-jewellery-logo.png"
          alt="Indian Jewellery"
        />
        <div>
          <div className="eyebrow">THE ART OF CURATION</div>
          <h1>
            Behind every beautiful
            <br />
            collection, there’s you.
          </h1>
          <p>A thoughtful space to manage your pieces and tell your stories.</p>
          <div className="gold-rule" />
        </div>
        <small>Timeless jewellery. Thoughtfully managed.</small>
      </section>
      <main className="auth-main">
        <div className="auth-card">
          <span className="auth-icon">
            <LockKeyhole size={23} />
          </span>
          <div className="eyebrow">ADMIN WORKSPACE</div>
          <h2>{signup ? "Create your account" : "Welcome back"}</h2>
          <p>
            {signup
              ? "Set up your local admin workspace."
              : "Sign in to curate your collection."}
          </p>
          <form onSubmit={submit}>
            {signup && (
              <label className="field">
                Full name
                <input
                  name="name"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  placeholder="Your name"
                />
              </label>
            )}
            <label className="field">
              Email address
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                maxLength={254}
              />
            </label>
            <label className="field">
              Password
              <div className="password-field">
                <input
                  name="password"
                  type={show ? "text" : "password"}
                  required
                  minLength={signup ? 8 : 1}
                  maxLength={128}
                  autoComplete={signup ? "new-password" : "current-password"}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="icon-button"
                  aria-label={show ? "Hide password" : "Show password"}
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>
            {signup && (
              <>
                <small className="help-text">
                  At least 8 characters, including a letter and number.
                </small>
                <label className="field">
                  Confirm password
                  <input
                    name="confirm"
                    type={show ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                  />
                </label>
              </>
            )}
            {error && (
              <p className="error-text" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="button full-button"
            >
              {busy ? "Please wait…" : signup ? "Create account" : "Sign in"}
              <ArrowRight size={16} />
            </button>
          </form>
          <p className="auth-switch">
            {signup ? "Already have an account?" : "New to this workspace?"}{" "}
            <Link href={signup ? "/admin/login" : "/admin/signup"}>
              {signup ? "Sign in" : "Create account"}
            </Link>
          </p>
          <div className="demo-note">
            Frontend preview · Accounts and catalog changes are saved in this
            browser. Live store publishing is not connected.
          </div>
        </div>
      </main>
    </div>
  );
}
