import {
  Database,
  Entry,
  Module,
  canDelete,
  seedDatabase,
  validateEntry,
} from "./admin-data";
import {
  type CommerceData,
  type Workspace,
  type Order,
  type OrderUpdate,
  type ReturnStatus,
  type CustomerRecord,
  seedCommerce,
  receiveOrder,
  updateOrder,
  updateReturnStatus,
  deleteOrder,
  updateStock,
  updateCustomer,
  deleteCustomer,
} from "./commerce";

// Replace this repository adapter with authenticated HTTP calls when the API is available.
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("indian-jewellery-admin", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("data");
      request.result.createObjectStore("media");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(
        new Error(
          "Browser storage is unavailable. Please enable site storage.",
        ),
      );
  });
}
async function transact<T>(
  store: string,
  mode: IDBTransactionMode,
  action: (s: IDBObjectStore) => IDBRequest,
): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const request = action(tx.objectStore(store));
    tx.oncomplete = () => {
      resolve(request.result as T);
      db.close();
    };
    tx.onerror = () => {
      reject(new Error("Could not save changes. Browser storage may be full."));
      db.close();
    };
    tx.onabort = () => {
      reject(new Error("Storage operation was cancelled. Please retry."));
      db.close();
    };
  });
}
export const repository = {
  async load() {
    const saved = await transact<Database | undefined>(
      "data",
      "readonly",
      (s) => s.get("catalog"),
    );
    if (saved) return saved;
    const seed = seedDatabase();
    await transact("data", "readwrite", (s) => s.put(seed, "catalog"));
    return seed;
  },
  async save(data: Database) {
    await transact("data", "readwrite", (s) => s.put(data, "catalog"));
  },
};

// All order/inventory writes share one IndexedDB transaction. In production this
// same boundary must be implemented by the backend, including webhook deduplication.
async function mutateWorkspace(
  update: (workspace: Workspace) => Workspace,
): Promise<Workspace> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("data", "readwrite");
    const store = tx.objectStore("data");
    const catalogRequest = store.get("catalog");
    const ordersRequest = store.get("commerce");
    let result: Workspace;
    let failure: Error | undefined;
    let loaded = 0;
    function ready() {
      if (++loaded !== 2) return;
      try {
        const catalog: Database = catalogRequest.result || seedDatabase();
        const baseCommerce = seedCommerce(catalog);
        const commerce: CommerceData = ordersRequest.result
          ? {
              ...baseCommerce,
              ...ordersRequest.result,
              returns:
                Array.isArray(ordersRequest.result.returns) &&
                ordersRequest.result.returns.length > 0
                  ? ordersRequest.result.returns
                  : baseCommerce.returns,
              customers:
                Array.isArray(ordersRequest.result.customers) &&
                ordersRequest.result.customers.length > 0
                  ? ordersRequest.result.customers
                  : baseCommerce.customers,
            }
          : baseCommerce;
        result = update({ catalog, commerce });
        store.put(result.catalog, "catalog");
        store.put(result.commerce, "commerce");
      } catch (error) {
        failure =
          error instanceof Error ? error : new Error("Could not save changes.");
        tx.abort();
      }
    }
    catalogRequest.onsuccess = ready;
    ordersRequest.onsuccess = ready;
    tx.oncomplete = () => {
      db.close();
      resolve(result);
    };
    tx.onabort = () => {
      db.close();
      reject(failure || new Error("Could not save changes. Please try again."));
    };
    tx.onerror = () => {
      failure ||= new Error(
        "Storage is unavailable or full. Changes were not saved.",
      );
    };
  });
}
export const commerceRepository = {
  load: () => mutateWorkspace((workspace) => workspace),
  receive: (order: Order) =>
    mutateWorkspace((workspace) => receiveOrder(workspace, order)),
  updateOrder: (id: string, update: OrderUpdate, version: number) =>
    mutateWorkspace((workspace) => updateOrder(workspace, id, update, version)),
  updateReturn: (id: string, status: ReturnStatus, notes?: string) =>
    mutateWorkspace((workspace) =>
      updateReturnStatus(workspace, id, status, notes),
    ),
  updateCustomer: (id: string, update: Partial<CustomerRecord>) =>
    mutateWorkspace((workspace) => updateCustomer(workspace, id, update)),
  deleteCustomer: (id: string) =>
    mutateWorkspace((workspace) => deleteCustomer(workspace, id)),
  deleteOrder: (id: string, version: number) =>
    mutateWorkspace((workspace) => deleteOrder(workspace, id, version)),
  updateStock: (id: string, current: number, available: number) =>
    mutateWorkspace((workspace) =>
      updateStock(workspace, id, current, available),
    ),
  saveCatalog: (moduleKey: Module, rows: Entry[], baseline: Entry[]) =>
    mutateWorkspace((workspace) => {
      const liveRows = workspace.catalog[moduleKey];
      const removed = baseline.filter(
        (old) => !rows.some((row) => row.id === old.id),
      );
      for (const entry of removed) {
        const live = liveRows.find((row) => row.id === entry.id);
        if (JSON.stringify(live) !== JSON.stringify(entry))
          throw new Error(
            "This item changed in another tab. Reload before deleting.",
          );
        canDelete(workspace.catalog, moduleKey, entry.id);
        if (
          moduleKey === "products" &&
          workspace.commerce.orders.some((order) =>
            order.items.some((line) => line.productId === entry.id),
          )
        )
          throw new Error(
            "This product belongs to an order. Keep it inactive or remove the order before deleting the product.",
          );
      }
      const nextRows = liveRows.filter(
        (row) => !removed.some((entry) => entry.id === row.id),
      );
      for (const row of rows) {
        const before = baseline.find((entry) => entry.id === row.id);
        if (!before) {
          if (nextRows.some((entry) => entry.id === row.id))
            throw new Error("This item already exists.");
          nextRows.push(row);
          continue;
        }
        if (JSON.stringify(before) === JSON.stringify(row)) continue;
        const index = nextRows.findIndex((entry) => entry.id === row.id);
        if (index < 0) throw new Error("This item was deleted in another tab.");
        const merged = { ...nextRows[index] };
        for (const key of new Set([
          ...Object.keys(before),
          ...Object.keys(row),
        ]) as Set<keyof Entry>) {
          if (JSON.stringify(before[key]) === JSON.stringify(row[key]))
            continue;
          if (
            JSON.stringify(nextRows[index][key]) !== JSON.stringify(before[key])
          )
            throw new Error(
              `${key === "stock" ? "Stock" : "This item"} changed while you were editing. Reload and try again.`,
            );
          Object.assign(merged, { [key]: row[key] });
        }
        nextRows[index] = merged;
      }
      const catalog = { ...workspace.catalog, [moduleKey]: nextRows };
      for (const row of rows.filter(
        (row) =>
          JSON.stringify(row) !==
          JSON.stringify(baseline.find((old) => old.id === row.id)),
      ))
        validateEntry(
          catalog,
          moduleKey,
          nextRows.find((live) => live.id === row.id)!,
        );
      return { ...workspace, catalog };
    }),
};
export const uploadService = {
  async upload(file: File, video = false) {
    const allowed = video
      ? ["video/mp4", "video/webm"]
      : ["image/jpeg", "image/png", "image/webp"];
    const max = video ? 30 : 5;
    if (!allowed.includes(file.type))
      throw new Error(
        video ? "Use MP4 or WebM video." : "Use JPG, PNG or WEBP images.",
      );
    if (file.size > max * 1024 * 1024)
      throw new Error(`File must be smaller than ${max} MB.`);
    if (file.size === 0)
      throw new Error("This file is empty. Choose another file.");
    if (!video) {
      try {
        const bitmap = await createImageBitmap(file);
        bitmap.close();
      } catch {
        throw new Error(
          "This image could not be read. Choose a valid JPG, PNG or WEBP image.",
        );
      }
    }
    const id = `media:${crypto.randomUUID()}`;
    await transact("media", "readwrite", (s) => s.put(file, id));
    return id;
  },
  async read(id: string) {
    return transact<Blob | undefined>("media", "readonly", (s) => s.get(id));
  },
};
export type Session = { name: string; email: string };
type Account = Session & { salt: string; hash: string };
async function hashPassword(password: string, salt: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return Array.from(new Uint8Array(hash), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}
// Demo-only identity. Client-side sessions are not a production security boundary.
export const authService = {
  session(): Session | null {
    const value = sessionStorage.getItem("ij-admin-session");
    return value ? JSON.parse(value) : null;
  },
  async signup(name: string, email: string, password: string) {
    const accounts =
      (await transact<Account[] | undefined>("data", "readonly", (s) =>
        s.get("accounts"),
      )) || [];
    if (accounts.some((a) => a.email === email))
      throw new Error("An account already exists for this email.");
    const salt = crypto.randomUUID();
    const hash = await hashPassword(password, salt);
    await transact("data", "readwrite", (s) =>
      s.put([...accounts, { name, email, salt, hash }], "accounts"),
    );
    const session = { name, email };
    sessionStorage.setItem("ij-admin-session", JSON.stringify(session));
    return session;
  },
  async login(email: string, password: string) {
    const accounts =
      (await transact<Account[] | undefined>("data", "readonly", (s) =>
        s.get("accounts"),
      )) || [];
    const account = accounts.find((a) => a.email === email);
    if (
      !account ||
      (await hashPassword(password, account.salt)) !== account.hash
    )
      throw new Error("Email or password is incorrect.");
    const session = { name: account.name, email };
    sessionStorage.setItem("ij-admin-session", JSON.stringify(session));
    return session;
  },
  logout() {
    sessionStorage.removeItem("ij-admin-session");
  },
};
