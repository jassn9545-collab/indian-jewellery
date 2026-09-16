import type { Entry, Module } from "./admin-data";
import type {
  Workspace,
  OrderUpdate,
  ReturnStatus,
  CustomerRecord,
} from "./commerce";
export type Settings = {
  storeName: string;
  contactEmail: string;
  lowStockThreshold: number;
};
export type RemoteWorkspace = Workspace & {
  revision: number;
  settings?: Settings;
};
export type Session = { name: string; email: string };
let revision: number | undefined;
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/admin-api${path}`, {
    ...init,
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Request": "1",
      ...init?.headers,
    },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data)
    throw new Error(
      data?.error ||
        "Admin service is unavailable. Check the backend connection.",
    );
  return data as T;
}
async function load(): Promise<RemoteWorkspace> {
  const ws = await api<RemoteWorkspace>("/workspace");
  revision = ws.revision;
  return ws;
}
async function command(
  action: string,
  payload: unknown,
): Promise<RemoteWorkspace> {
  if (revision === undefined)
    throw new Error("Load the workspace before saving.");
  const ws = await api<RemoteWorkspace>("/command", {
    method: "POST",
    body: JSON.stringify({ action, payload, revision }),
  });
  revision = ws.revision;
  return ws;
}
export const repository = { load: async () => (await load()).catalog };
export const commerceRepository = {
  load,
  updateOrder: (id: string, update: OrderUpdate, version: number) =>
    command("order", { id, update, version }),
  updateReturn: (id: string, status: ReturnStatus, notes?: string) =>
    command("return", { id, status, notes }),
  updateCustomer: (id: string, update: Partial<CustomerRecord>) =>
    command("customer", { id, update }),
  deleteCustomer: (id: string) => command("deleteCustomer", { id }),
  deleteOrder: (id: string, version: number) =>
    command("deleteOrder", { id, version }),
  updateStock: (id: string, current: number, available: number) =>
    command("stock", { id, current, available }),
  saveCatalog: (module: Module, rows: Entry[], baseline: Entry[]) =>
    command("catalog", { module, rows, baseline }),
  saveSettings: (settings: Settings) => command("settings", settings),
};
export const uploadService = {
  async upload(file: File, video = false) {
    const allowed = video
      ? ["video/mp4", "video/webm"]
      : ["image/jpeg", "image/png", "image/webp"];
    if (
      !allowed.includes(file.type) ||
      !file.size ||
      file.size > (video ? 30 : 5) * 1024 * 1024
    )
      throw new Error(
        video ? "Use MP4/WebM up to 30 MB." : "Use JPG/PNG/WEBP up to 5 MB.",
      );
    const result = await api<{ id: string }>("/media", {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    return result.id;
  },
  async read(id: string) {
    const response = await fetch(
      `/admin-api/media/${encodeURIComponent(id.slice(6))}`,
      { cache: "no-store" },
    );
    if (!response.ok) throw new Error("Media could not be loaded.");
    return response.blob();
  },
};
export const authService = {
  async session(): Promise<Session | null> {
    const response = await fetch("/admin-api/session", { cache: "no-store" });
    if (response.status === 401) return null;
    if (!response.ok)
      throw new Error(
        "Admin server is unavailable. Start the Express backend and check MySQL.",
      );
    return response.json() as Promise<Session>;
  },
  signup: (name: string, email: string, password: string) =>
    api<Session>("/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  login: (email: string, password: string) =>
    api<Session>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  async logout() {
    await api("/logout", { method: "POST" });
    revision = undefined;
  },
};
