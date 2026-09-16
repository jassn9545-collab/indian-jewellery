import type { Database, Entry } from "./admin-data";

export const orderStatuses = [
  "Pending",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Returned",
  "Refunded",
] as const;
export const shippingStatuses = [
  "Not Shipped",
  "Packed",
  "Shipped",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Failed Delivery",
  "Returned",
] as const;
export const paymentStatuses = [
  "Pending",
  "Paid",
  "Failed",
  "Refunded",
] as const;
export type OrderStatus = (typeof orderStatuses)[number];
export type ShippingStatus = (typeof shippingStatuses)[number];
export type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};
export type OrderLine = {
  productId: string;
  name: string;
  sku: string;
  image?: string;
  quantity: number;
  unitPrice: number;
  unitDiscount: number;
};
// Money is stored as integer paise. Never store credentials, full account/card numbers, CVV or PINs here.
export type Payment = {
  method: string;
  status: (typeof paymentStatuses)[number];
  reference: string;
  amount: number;
  date?: string;
  bank?: { name: string; accountLast4?: string };
};
export type Shipping = {
  method: string;
  courier: string;
  trackingNumber: string;
  status: ShippingStatus;
  estimatedDelivery?: string;
  deliveryDate?: string;
};
export const returnStatuses = [
  "Requested",
  "Approved",
  "Rejected",
  "Picked Up",
  "Received",
  "Refunded",
] as const;
export type ReturnStatus = (typeof returnStatuses)[number];

export type OrderTimelineEvent = {
  status: OrderStatus;
  date: string;
  notes?: string;
};

export type ReturnRequest = {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  product: {
    id: string;
    name: string;
    sku: string;
    image?: string;
    price: number;
  };
  quantity: number;
  reason: string;
  status: ReturnStatus;
  requestDate: string;
  notes?: string;
};

export type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: Address;
    shippingAddress: Address;
    billingAddress: Address;
  };
  items: OrderLine[];
  payment: Payment;
  shipping: Shipping;
  stockDeducted: boolean;
  version: number;
  demo?: boolean;
  timeline?: OrderTimelineEvent[];
};
export const customerStatuses = ["Active", "Inactive", "New"] as const;
export type CustomerStatus = (typeof customerStatuses)[number];

export type CustomerRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  joinedDate: string;
  avatar?: string;
  address: Address;
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
};

export type CommerceData = {
  version: 1;
  orders: Order[];
  returns: ReturnRequest[];
  customers: CustomerRecord[];
};
export type Workspace = { catalog: Database; commerce: CommerceData };
export type OrderUpdate = {
  status: OrderStatus;
  shipping: Shipping;
  notes?: string;
};
export const storeTimeZone = "Asia/Kolkata";
export const commerceMoney = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(paise / 100);
export const lineTotal = (line: OrderLine) =>
  (line.unitPrice - line.unitDiscount) * line.quantity;
export const orderTotal = (order: Order) =>
  order.items.reduce((sum, line) => sum + lineTotal(line), 0);
export const orderQuantity = (order: Order) =>
  order.items.reduce((sum, line) => sum + line.quantity, 0);
export function dateKey(date: string | Date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: storeTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}
export function displayDate(value?: string, withTime = false) {
  if (!value) return "Not available";
  const date = new Date(
    value.length === 10 ? `${value}T00:00:00+05:30` : value,
  );
  if (!Number.isFinite(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: storeTimeZone,
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime ? ({ hour: "2-digit", minute: "2-digit" } as const) : {}),
  }).format(date);
}
export function shiftDay(key: string, days: number) {
  const date = new Date(`${key}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
export const stockStatus = (available: number) =>
  available <= 0 ? "Out of Stock" : available <= 10 ? "Low Stock" : "In Stock";
export function inventory(product: Entry, orders: Order[]) {
  const sold = orders.reduce(
    (sum, o) =>
      sum +
      (o.stockDeducted
        ? o.items
            .filter((l) => l.productId === product.id)
            .reduce((n, l) => n + l.quantity, 0)
        : 0),
    0,
  );
  const available = product.stock || 0;
  return {
    current: available + sold,
    sold,
    available,
    status: stockStatus(available),
  };
}

export function safePayment(payment: Payment): Payment {
  return {
    method: payment.method,
    status: payment.status,
    reference: payment.reference,
    amount: payment.amount,
    date: payment.date,
    ...(payment.bank
      ? {
          bank: {
            name: payment.bank.name,
            ...(payment.bank.accountLast4 &&
            /^\d{4}$/.test(payment.bank.accountLast4)
              ? { accountLast4: payment.bank.accountLast4 }
              : {}),
          },
        }
      : {}),
  };
}
function validateOrder(order: Order) {
  if (
    !order.id.trim() ||
    !Number.isFinite(Date.parse(order.date)) ||
    !orderStatuses.includes(order.status)
  )
    throw new Error("Invalid order information.");
  if (
    !order.items.length ||
    order.items.some(
      (l) =>
        !l.productId ||
        !Number.isSafeInteger(l.quantity) ||
        l.quantity < 1 ||
        !Number.isSafeInteger(l.unitPrice) ||
        l.unitPrice < 0 ||
        !Number.isSafeInteger(l.unitDiscount) ||
        l.unitDiscount < 0 ||
        l.unitDiscount > l.unitPrice ||
        !Number.isSafeInteger(lineTotal(l)),
    )
  )
    throw new Error("Invalid product quantity or price.");
  if (
    !paymentStatuses.includes(order.payment.status) ||
    !Number.isSafeInteger(order.payment.amount) ||
    order.payment.amount < 0
  )
    throw new Error("Invalid payment information.");
  if (!shippingStatuses.includes(order.shipping.status))
    throw new Error("Invalid shipping status.");
}
function needsStock(status: OrderStatus, previous?: Order) {
  if (status === "Cancelled" || status === "Returned") return false;
  // A financial refund alone does not establish that goods were returned.
  if (status === "Refunded") return previous?.stockDeducted ?? true;
  return true;
}
function reconcileStock(
  workspace: Workspace,
  before: Order | undefined,
  after: Order | undefined,
): Database {
  const deltas = new Map<string, number>();
  for (const [order, direction] of [
    [before, 1],
    [after, -1],
  ] as const) {
    if (!order?.stockDeducted) continue;
    for (const line of order.items)
      deltas.set(
        line.productId,
        (deltas.get(line.productId) || 0) + direction * line.quantity,
      );
  }
  for (const [id, delta] of deltas) {
    const product = workspace.catalog.products.find((p) => p.id === id);
    if (!product && delta)
      throw new Error("An ordered product is missing from the catalog.");
    if (product && (product.stock || 0) + delta < 0)
      throw new Error(
        `Insufficient stock for ${product.name}. Update stock before restoring this order.`,
      );
  }
  return {
    ...workspace.catalog,
    products: workspace.catalog.products.map((p) => ({
      ...p,
      stock: (p.stock || 0) + (deltas.get(p.id) || 0),
    })),
  };
}
// Integration entry point for incoming sales. Repeated delivery of the same order ID is a no-op.
export function receiveOrder(workspace: Workspace, incoming: Order): Workspace {
  if (workspace.commerce.orders.some((o) => o.id === incoming.id))
    return workspace;
  validateOrder(incoming);
  if (
    incoming.items.some(
      (line) =>
        !workspace.catalog.products.some((p) => p.id === line.productId),
    )
  )
    throw new Error("An ordered product is missing from the catalog.");
  const order = {
    ...incoming,
    payment: safePayment(incoming.payment),
    stockDeducted: needsStock(incoming.status),
    version: 1,
  };
  return {
    catalog: reconcileStock(workspace, undefined, order),
    commerce: {
      ...workspace.commerce,
      orders: [order, ...workspace.commerce.orders],
    },
  };
}
export function updateOrder(
  workspace: Workspace,
  id: string,
  update: OrderUpdate,
  expectedVersion: number,
): Workspace {
  const previous = workspace.commerce.orders.find((o) => o.id === id);
  if (!previous) throw new Error("Order no longer exists.");
  if (previous.version !== expectedVersion)
    throw new Error(
      "This order changed in another tab. Reload before editing.",
    );
  if (
    !orderStatuses.includes(update.status) ||
    !shippingStatuses.includes(update.shipping.status)
  )
    throw new Error("Choose valid order and shipping statuses.");
  const shipping = { ...update.shipping };
  for (const value of [shipping.estimatedDelivery, shipping.deliveryDate]) {
    if (
      value &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        !Number.isFinite(Date.parse(value)) ||
        new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) !== value)
    )
      throw new Error("Enter a valid delivery date.");
    if (value && value < dateKey(previous.date))
      throw new Error("Delivery dates cannot be before the order date.");
  }
  if (shipping.deliveryDate && shipping.deliveryDate > dateKey())
    throw new Error("Actual delivery cannot be in the future.");
  if (
    (shipping.status === "Delivered" || update.status === "Delivered") &&
    !shipping.deliveryDate
  )
    throw new Error("Enter the actual delivery date for a delivered order.");
  if (update.status === "Delivered") shipping.status = "Delivered";
  if (
    shipping.status === "Delivered" &&
    !["Delivered", "Returned", "Refunded"].includes(update.status)
  )
    throw new Error(
      "Delivered shipping requires a delivered, returned or refunded order status.",
    );
  if (
    [
      "Shipped",
      "In Transit",
      "Out for Delivery",
      "Delivered",
      "Failed Delivery",
    ].includes(shipping.status) &&
    (!shipping.courier.trim() || !shipping.trackingNumber.trim())
  )
    throw new Error("Enter the courier and tracking number.");
  if (!shipping.method.trim()) throw new Error("Enter a shipping method.");
  const timelineEntry: OrderTimelineEvent = {
    status: update.status,
    date: new Date().toISOString(),
    notes: update.notes || `Order marked as ${update.status}`,
  };
  const updatedTimeline = [...(previous.timeline || []), timelineEntry];
  const next: Order = {
    ...previous,
    status: update.status,
    shipping,
    stockDeducted: needsStock(update.status, previous),
    version: previous.version + 1,
    payment: safePayment(
      update.status === "Refunded"
        ? { ...previous.payment, status: "Refunded" }
        : previous.payment,
    ),
    timeline: updatedTimeline,
  };
  return {
    catalog: reconcileStock(workspace, previous, next),
    commerce: {
      ...workspace.commerce,
      orders: workspace.commerce.orders.map((o) => (o.id === id ? next : o)),
    },
  };
}
export function updateReturnStatus(
  workspace: Workspace,
  returnId: string,
  status: ReturnStatus,
  notes?: string,
): Workspace {
  const existing = workspace.commerce.returns.find((r) => r.id === returnId);
  if (!existing) throw new Error("Return request no longer exists.");
  const updated: ReturnRequest = {
    ...existing,
    status,
    notes: notes || existing.notes,
  };
  return {
    ...workspace,
    commerce: {
      ...workspace.commerce,
      returns: workspace.commerce.returns.map((r) =>
        r.id === returnId ? updated : r,
      ),
    },
  };
}
export function deleteOrder(
  workspace: Workspace,
  id: string,
  expectedVersion: number,
): Workspace {
  const order = workspace.commerce.orders.find((o) => o.id === id);
  if (!order) throw new Error("Order no longer exists.");
  if (order.version !== expectedVersion)
    throw new Error("This order changed. Reload before deleting.");
  // Removing a record must not create physical stock. Cancel/return it first to release stock.
  return {
    ...workspace,
    commerce: {
      ...workspace.commerce,
      orders: workspace.commerce.orders.filter((o) => o.id !== id),
    },
  };
}
export function updateStock(
  workspace: Workspace,
  productId: string,
  current: number,
  expectedAvailable: number,
): Workspace {
  const product = workspace.catalog.products.find((p) => p.id === productId);
  if (!product) throw new Error("Product no longer exists.");
  if (product.stock !== expectedAvailable)
    throw new Error(
      "Stock changed while you were editing. Reload and try again.",
    );
  const { sold } = inventory(product, workspace.commerce.orders);
  if (!Number.isSafeInteger(current) || current < sold)
    throw new Error(
      `Current stock must be a whole number of at least ${sold} (the sold quantity).`,
    );
  return {
    ...workspace,
    catalog: {
      ...workspace.catalog,
      products: workspace.catalog.products.map((p) =>
        p.id === productId ? { ...p, stock: current - sold } : p,
      ),
    },
  };
}

export function updateCustomer(
  workspace: Workspace,
  id: string,
  update: Partial<CustomerRecord>,
): Workspace {
  const existing = (workspace.commerce.customers || []).find(
    (c) => c.id === id,
  );
  if (!existing) throw new Error("Customer not found.");
  const updated = { ...existing, ...update };
  return {
    ...workspace,
    commerce: {
      ...workspace.commerce,
      customers: (workspace.commerce.customers || []).map((c) =>
        c.id === id ? updated : c,
      ),
    },
  };
}

export function deleteCustomer(workspace: Workspace, id: string): Workspace {
  return {
    ...workspace,
    commerce: {
      ...workspace.commerce,
      customers: (workspace.commerce.customers || []).filter(
        (c) => c.id !== id,
      ),
    },
  };
}

export function customerStats(customer: CustomerRecord, orders: Order[]) {
  const customerOrders = orders.filter(
    (o) =>
      o.customer.email.toLowerCase() === customer.email.toLowerCase() ||
      o.customer.name.toLowerCase() === customer.name.toLowerCase(),
  );
  const totalOrders = customerOrders.length;
  const totalSpent = customerOrders.reduce((sum, o) => {
    if (
      ["Paid", "Delivered"].includes(o.payment.status) ||
      [
        "Delivered",
        "Confirmed",
        "Processing",
        "Shipped",
        "Out for Delivery",
      ].includes(o.status)
    ) {
      return sum + orderTotal(o);
    }
    return sum;
  }, 0);
  const sorted = customerOrders
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const lastOrderDate = sorted[0]?.date;

  return {
    totalOrders,
    totalSpent,
    lastOrderDate,
    orders: sorted,
  };
}

export type PaymentRecord = {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  method: string;
  amount: number;
  status: "Paid" | "Pending" | "Failed" | "Refunded" | "Partially Refunded";
  date: string;
  bank?: { name: string; accountLast4?: string };
  refund?: {
    status: string;
    amount: number;
    date: string;
    referenceId: string;
  };
  order: Order;
};

export function projectPayments(orders: Order[]): PaymentRecord[] {
  return orders.map((o) => {
    const isRefunded =
      o.payment.status === "Refunded" || o.status === "Refunded";
    const status = isRefunded
      ? "Refunded"
      : (o.payment.status as
          | "Paid"
          | "Pending"
          | "Failed"
          | "Refunded"
          | "Partially Refunded");

    return {
      id: o.payment.reference || `TXN-${o.id}`,
      orderId: o.id,
      customerName: o.customer.name,
      customerEmail: o.customer.email,
      customerPhone: o.customer.phone,
      method: o.payment.method || "UPI",
      amount: o.payment.amount || orderTotal(o),
      status,
      date: o.payment.date || o.date,
      bank: o.payment.bank,
      refund: isRefunded
        ? {
            status: "Completed",
            amount: o.payment.amount || orderTotal(o),
            date: shiftDay(o.date.slice(0, 10), 3),
            referenceId: `REF-${o.id.replace("DEMO-", "")}-01`,
          }
        : undefined,
      order: o,
    };
  });
}

export type ShipmentRecord = {
  orderId: string;
  customerName: string;
  customerCity: string;
  customerState: string;
  customerPhone: string;
  customerAddress: Address;
  items: OrderLine[];
  method: string;
  courier: string;
  trackingNumber: string;
  status: ShippingStatus;
  shippingDate?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  orderDate: string;
  timeline?: OrderTimelineEvent[];
  order: Order;
};

export function projectShipments(orders: Order[]): ShipmentRecord[] {
  return orders.map((o) => ({
    orderId: o.id,
    customerName: o.customer.name,
    customerCity: o.customer.shippingAddress.city,
    customerState: o.customer.shippingAddress.state,
    customerPhone: o.customer.phone,
    customerAddress: o.customer.shippingAddress,
    items: o.items,
    method: o.shipping.method || "Standard delivery",
    courier:
      o.shipping.courier ||
      (["Shipped", "In Transit", "Out for Delivery", "Delivered"].includes(
        o.shipping.status,
      )
        ? "BlueDart Express"
        : "Pending Assignment"),
    trackingNumber:
      o.shipping.trackingNumber ||
      (["Shipped", "In Transit", "Out for Delivery", "Delivered"].includes(
        o.shipping.status,
      )
        ? `BD-${o.id.replace("DEMO-", "892")}`
        : "—"),
    status: o.shipping.status,
    shippingDate: [
      "Shipped",
      "In Transit",
      "Out for Delivery",
      "Delivered",
    ].includes(o.shipping.status)
      ? shiftDay(o.date.slice(0, 10), 2)
      : undefined,
    estimatedDelivery: o.shipping.estimatedDelivery,
    actualDelivery: o.shipping.deliveryDate,
    orderDate: o.date,
    timeline: o.timeline,
    order: o,
  }));
}

// Clearly labelled historical preview records. Existing available inventory is preserved on migration.
export function seedCommerce(
  catalog: Database,
  now = new Date(),
): CommerceData {
  if (!catalog.products.length)
    return { version: 1, orders: [], returns: [], customers: [] };
  const today = dateKey(now);
  const offsets = [
    0, 1, 2, 4, 6, 9, 14, 20, 29, 45, 65, 90, 120, 160, 210, 270, 320, 350,
  ];
  const orders = offsets.map((days, i): Order => {
    const product = catalog.products[i % catalog.products.length];
    const date = `${shiftDay(today, -days)}T09:00:00+05:30`;
    const status: OrderStatus =
      orderStatuses[Math.min(i, 9)] === "Refunded" && i > 9
        ? "Delivered"
        : orderStatuses[Math.min(i, 9)];
    const delivered = ["Delivered", "Returned", "Refunded"].includes(status);
    const address: Address = {
      line1: `Sample House ${i + 1}, Demo Street`,
      line2: "Preview address",
      city: "Jaipur",
      state: "Rajasthan",
      postalCode: "302001",
      country: "India",
    };
    const items: OrderLine[] = [
      {
        productId: product.id,
        name: product.name || "Product",
        sku: product.sku || "",
        image: product.image,
        quantity: i % 3 === 0 ? 2 : 1,
        unitPrice: Math.round((product.price || 0) * 100),
        unitDiscount: Math.max(
          0,
          Math.round(((product.price || 0) - (product.salePrice || 0)) * 100),
        ),
      },
    ];
    if (i === 0 && catalog.products.length > 1) {
      const second = catalog.products[1];
      items.push({
        productId: second.id,
        name: second.name || "Product",
        sku: second.sku || "",
        image: second.image,
        quantity: 1,
        unitPrice: Math.round((second.price || 0) * 100),
        unitDiscount: Math.max(
          0,
          Math.round(((second.price || 0) - (second.salePrice || 0)) * 100),
        ),
      });
    }
    const timeline: OrderTimelineEvent[] = [
      {
        status: "Confirmed",
        date,
        notes: "Order placed by customer and confirmed.",
      },
    ];
    if (status !== "Pending") {
      timeline.push({
        status: "Processing",
        date: `${shiftDay(today, -days + 1)}T10:30:00+05:30`,
        notes: "Order is being packed at Jaipur facility.",
      });
    }
    if (
      [
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Returned",
        "Refunded",
      ].includes(status)
    ) {
      timeline.push({
        status: "Shipped",
        date: `${shiftDay(today, -days + 2)}T14:15:00+05:30`,
        notes: `Handed over to courier. Tracking: DEMO-TRACK-${1001 + i}`,
      });
    }
    if (
      ["Out for Delivery", "Delivered", "Returned", "Refunded"].includes(status)
    ) {
      timeline.push({
        status: "Out for Delivery",
        date: `${shiftDay(today, -days + 4)}T08:45:00+05:30`,
        notes: "Shipment is out for delivery with local courier agent.",
      });
    }
    if (["Delivered", "Returned", "Refunded"].includes(status)) {
      timeline.push({
        status: "Delivered",
        date: `${shiftDay(today, -days + 5)}T16:20:00+05:30`,
        notes: "Delivered to customer address.",
      });
    }
    if (status === "Returned" || status === "Refunded") {
      timeline.push({
        status,
        date: `${shiftDay(today, -days + 7)}T11:00:00+05:30`,
        notes: "Customer return / refund processed.",
      });
    }
    return {
      id: `DEMO-${String(1001 + i)}`,
      demo: true,
      date: days ? date : now.toISOString(),
      status,
      customer: {
        name: `Demo Customer ${String(i + 1).padStart(2, "0")}`,
        phone: "+91 98765 00000",
        email: `customer${i + 1}@example.test`,
        address,
        shippingAddress: address,
        billingAddress: {
          ...address,
          line1: `Sample Billing House ${i + 1}, Demo Street`,
        },
      },
      items,
      payment: {
        method: i % 3 === 0 ? "Cash on Delivery" : i % 3 === 1 ? "UPI" : "Card",
        status:
          status === "Refunded"
            ? "Refunded"
            : status === "Cancelled"
              ? "Failed"
              : i === 0
                ? "Pending"
                : "Paid",
        reference: i === 0 ? "" : `DEMO-PAY-${1001 + i}`,
        amount: items.reduce((n, l) => n + lineTotal(l), 0),
        date: i === 0 ? undefined : date,
      },
      shipping: {
        method: "Standard delivery",
        courier: i >= 4 ? "BlueDart Express" : "",
        trackingNumber: i >= 4 ? `DEMO-TRACK-${1001 + i}` : "",
        status: delivered
          ? "Delivered"
          : status === "Packed"
            ? "Packed"
            : status === "Shipped"
              ? "Shipped"
              : status === "Out for Delivery"
                ? "Out for Delivery"
                : "Not Shipped",
        estimatedDelivery: shiftDay(today, -days + 5),
        deliveryDate: delivered ? shiftDay(today, -days + 6) : undefined,
      },
      stockDeducted: !["Cancelled", "Returned"].includes(status),
      version: 1,
      timeline,
    };
  });
  const returns: ReturnRequest[] = [
    {
      id: "RET-1001",
      orderId: "DEMO-1008",
      customerName: "Pooja Sharma",
      customerEmail: "pooja.sharma@example.test",
      customerPhone: "+91 98765 43210",
      product: {
        id: catalog.products[0]?.id || "p1",
        name: catalog.products[0]?.name || "Kundan Choker Set",
        sku: catalog.products[0]?.sku || "IJ-0001",
        image: catalog.products[0]?.image || "/images/necklace.webp",
        price:
          catalog.products[0]?.salePrice || catalog.products[0]?.price || 4500,
      },
      quantity: 1,
      reason: "Size mismatch - necklace choker fitting is too tight",
      status: "Requested",
      requestDate: `${shiftDay(today, -2)}T11:20:00+05:30`,
      notes: "Customer requested exchange for larger choker chain length.",
    },
    {
      id: "RET-1002",
      orderId: "DEMO-1009",
      customerName: "Rohan Verma",
      customerEmail: "rohan.v@example.test",
      customerPhone: "+91 98123 45678",
      product: {
        id: catalog.products[1]?.id || "p2",
        name: catalog.products[1]?.name || "Polki Jhumka Earrings",
        sku: catalog.products[1]?.sku || "IJ-0002",
        image: catalog.products[1]?.image || "/images/jhumka.webp",
        price:
          catalog.products[1]?.salePrice || catalog.products[1]?.price || 2800,
      },
      quantity: 1,
      reason: "Defective stone setting upon unboxing",
      status: "Approved",
      requestDate: `${shiftDay(today, -4)}T15:40:00+05:30`,
      notes: "Approved by store manager. Awaiting courier pickup.",
    },
    {
      id: "RET-1003",
      orderId: "DEMO-1010",
      customerName: "Simran Kaur",
      customerEmail: "simran.k@example.test",
      customerPhone: "+91 97654 32109",
      product: {
        id: catalog.products[2]?.id || "p3",
        name: catalog.products[2]?.name || "Temple Gold Bangle",
        sku: catalog.products[2]?.sku || "IJ-0003",
        image: catalog.products[2]?.image || "/images/bracelet.webp",
        price:
          catalog.products[2]?.salePrice || catalog.products[2]?.price || 6200,
      },
      quantity: 2,
      reason: "Ordered incorrect wrist size (2.6 instead of 2.4)",
      status: "Picked Up",
      requestDate: `${shiftDay(today, -6)}T09:15:00+05:30`,
      notes: "Courier picked up item from customer. In transit to warehouse.",
    },
    {
      id: "RET-1004",
      orderId: "DEMO-1011",
      customerName: "Ananya Iyer",
      customerEmail: "ananya.i@example.test",
      customerPhone: "+91 99887 76655",
      product: {
        id: catalog.products[3]?.id || "p4",
        name: catalog.products[3]?.name || "Pure Silver Floral Ring",
        sku: catalog.products[3]?.sku || "IJ-0004",
        image: catalog.products[3]?.image || "/images/ring.webp",
        price:
          catalog.products[3]?.salePrice || catalog.products[3]?.price || 1850,
      },
      quantity: 1,
      reason: "Color slightly different from website photos",
      status: "Received",
      requestDate: `${shiftDay(today, -9)}T14:30:00+05:30`,
      notes: "Received at warehouse inspection. Quality check passed.",
    },
    {
      id: "RET-1005",
      orderId: "DEMO-1012",
      customerName: "Meera Joshi",
      customerEmail: "meera.j@example.test",
      customerPhone: "+91 98220 11223",
      product: {
        id: catalog.products[0]?.id || "p1",
        name: catalog.products[0]?.name || "Kundan Choker Set",
        sku: catalog.products[0]?.sku || "IJ-0001",
        image: catalog.products[0]?.image || "/images/necklace.webp",
        price:
          catalog.products[0]?.salePrice || catalog.products[0]?.price || 4500,
      },
      quantity: 1,
      reason: "Event cancelled - no longer needed",
      status: "Refunded",
      requestDate: `${shiftDay(today, -14)}T10:00:00+05:30`,
      notes: "Refund credited back to original payment method.",
    },
    {
      id: "RET-1006",
      orderId: "DEMO-1013",
      customerName: "Vikram Malhotra",
      customerEmail: "vikram.m@example.test",
      customerPhone: "+91 98333 44556",
      product: {
        id: catalog.products[1]?.id || "p2",
        name: catalog.products[1]?.name || "Polki Jhumka Earrings",
        sku: catalog.products[1]?.sku || "IJ-0002",
        image: catalog.products[1]?.image || "/images/jhumka.webp",
        price:
          catalog.products[1]?.salePrice || catalog.products[1]?.price || 2800,
      },
      quantity: 1,
      reason: "Item returned after 30-day return window",
      status: "Rejected",
      requestDate: `${shiftDay(today, -20)}T16:45:00+05:30`,
      notes: "Return window expired. Customer notified via email.",
    },
  ];

  const customerCities = [
    { city: "Jaipur", state: "Rajasthan", postalCode: "302001" },
    { city: "Mumbai", state: "Maharashtra", postalCode: "400001" },
    { city: "Delhi", state: "NCR", postalCode: "110001" },
    { city: "Bengaluru", state: "Karnataka", postalCode: "560001" },
    { city: "Chennai", state: "Tamil Nadu", postalCode: "600001" },
    { city: "Ahmedabad", state: "Gujarat", postalCode: "380001" },
    { city: "Kolkata", state: "West Bengal", postalCode: "700001" },
    { city: "Hyderabad", state: "Telangana", postalCode: "500001" },
    { city: "Pune", state: "Maharashtra", postalCode: "411001" },
    { city: "Amritsar", state: "Punjab", postalCode: "143001" },
    { city: "Lucknow", state: "Uttar Pradesh", postalCode: "226001" },
    { city: "Udaipur", state: "Rajasthan", postalCode: "313001" },
  ];

  const customers: CustomerRecord[] = Array.from(
    { length: 12 },
    (_, i): CustomerRecord => {
      const custNum = String(i + 1).padStart(2, "0");
      const loc = customerCities[i % customerCities.length];
      const addr: Address = {
        line1: `Sample House ${i + 1}, Demo Street`,
        line2: "Preview address",
        city: loc.city,
        state: loc.state,
        postalCode: loc.postalCode,
        country: "India",
      };
      const status: CustomerStatus =
        i === 2 || i === 10
          ? "New"
          : i === 8 || i === 11
            ? "Inactive"
            : "Active";

      return {
        id: `CUST-${1001 + i}`,
        name: `Demo Customer ${custNum}`,
        email: `customer${i + 1}@example.test`,
        phone: `+91 98765 ${String(10000 + i * 111).slice(1)}`,
        status,
        joinedDate: `${shiftDay(today, -offsets[Math.min(i, offsets.length - 1)] - 15)}T10:00:00+05:30`,
        avatar: "",
        address: addr,
        shippingAddress: addr,
        billingAddress: {
          ...addr,
          line1: `Sample Billing House ${i + 1}, Demo Street`,
        },
      };
    },
  );

  return { version: 1, orders, returns, customers };
}

export const timeRanges = [
  "Today",
  "7 Days",
  "30 Days",
  "3 Months",
  "6 Months",
  "1 Year",
] as const;
export type TimeRange = (typeof timeRanges)[number];
export type SalesPoint = {
  key: string;
  label: string;
  sales: number;
  revenue: number;
  orders: number;
};
export function salesSeries(
  orders: Order[],
  range: TimeRange,
  now = new Date(),
): SalesPoint[] {
  const today = dateKey(now);
  const monthly = ["3 Months", "6 Months", "1 Year"].includes(range);
  const count =
    range === "Today"
      ? 24
      : range === "7 Days"
        ? 7
        : range === "30 Days"
          ? 30
          : range === "3 Months"
            ? 3
            : range === "6 Months"
              ? 6
              : 12;
  const points: SalesPoint[] = Array.from({ length: count }, (_, i) => {
    let key: string;
    let label: string;
    if (range === "Today") {
      key = `${today}T${String(i).padStart(2, "0")}`;
      label = `${String(i).padStart(2, "0")}:00`;
    } else if (monthly) {
      const d = new Date(`${today.slice(0, 7)}-01T12:00:00Z`);
      d.setUTCMonth(d.getUTCMonth() - count + 1 + i);
      key = d.toISOString().slice(0, 7);
      label = new Intl.DateTimeFormat("en-IN", {
        timeZone: storeTimeZone,
        month: "short",
        year: "2-digit",
      }).format(d);
    } else {
      key = shiftDay(today, -count + 1 + i);
      label = new Intl.DateTimeFormat("en-IN", {
        timeZone: storeTimeZone,
        day: "numeric",
        month: "short",
      }).format(new Date(`${key}T12:00:00Z`));
    }
    return { key, label, sales: 0, revenue: 0, orders: 0 };
  });
  function pointFor(value: string) {
    if (!Number.isFinite(Date.parse(value)) || new Date(value) > now)
      return undefined;
    const day = dateKey(value);
    const hour = new Intl.DateTimeFormat("en-GB", {
      timeZone: storeTimeZone,
      hour: "2-digit",
      hourCycle: "h23",
    }).format(new Date(value));
    const key =
      range === "Today" ? `${day}T${hour}` : monthly ? day.slice(0, 7) : day;
    return points.find((p) => p.key === key);
  }
  for (const order of orders) {
    const point = pointFor(order.date);
    if (point) {
      point.orders++;
      if (!["Cancelled", "Returned", "Refunded"].includes(order.status))
        point.sales += orderQuantity(order);
    }
    if (
      order.payment.status === "Paid" &&
      !["Cancelled", "Returned", "Refunded"].includes(order.status) &&
      order.payment.date
    ) {
      const paymentPoint = pointFor(order.payment.date);
      if (paymentPoint) paymentPoint.revenue += order.payment.amount;
    }
  }
  return points;
}
