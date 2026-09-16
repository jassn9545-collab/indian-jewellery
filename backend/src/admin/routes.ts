import { Router, json, raw } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";
import { randomUUID } from "crypto";
import { prisma } from "../database/prisma";
import {
  modules,
  Database,
  Entry,
  Module,
  validateEntry,
  canDelete,
} from "./admin-data";
import {
  Workspace,
  updateOrder,
  updateReturnStatus,
  updateCustomer,
  deleteCustomer,
  deleteOrder,
  updateStock,
  orderStatuses,
  shippingStatuses,
  returnStatuses,
  customerStatuses,
} from "./commerce";

const empty = (): Workspace => ({
  catalog: Object.fromEntries(modules.map(([key]) => [key, []])) as Database,
  commerce: { version: 1, orders: [], returns: [], customers: [] },
});
const cookie = "ij_admin";
const secret = () => {
  if (
    !process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET.length < 32
  )
    throw new Error("Configure ADMIN_SESSION_SECRET (at least 32 characters).");
  return process.env.ADMIN_SESSION_SECRET;
};
const settingsSchema = Joi.object({
  storeName: Joi.string().trim().max(100).required(),
  contactEmail: Joi.string().email().allow("").required(),
  lowStockThreshold: Joi.number().integer().min(0).max(10000).required(),
});
const entrySchema = Joi.object({
  id: Joi.string().max(100).required(),
  status: Joi.string().valid("Active", "Inactive").required(),
  ...Object.fromEntries(
    [
      "name",
      "title",
      "image",
      "hoverImage",
      "description",
      "categoryId",
      "productId",
      "sku",
      "link",
      "buttonText",
      "text",
      "video",
      "location",
      "createdAt",
    ].map((key) => [key, Joi.string().max(10000).allow("")]),
  ),
  gallery: Joi.array().items(Joi.string().max(1000)).max(30),
  ...Object.fromEntries(
    ["price", "salePrice", "stock", "rating", "displayOrder"].map((key) => [
      key,
      Joi.number().min(0).max(Number.MAX_SAFE_INTEGER),
    ]),
  ),
  verified: Joi.boolean(),
});
const text = Joi.string().max(1000).allow("");
const address = Joi.object({
  line1: text.required(),
  line2: text,
  city: text.required(),
  state: text.required(),
  postalCode: text.required(),
  country: text.required(),
});
const payloadSchemas: Record<string, Joi.ObjectSchema> = {
  stock: Joi.object({
    id: Joi.string().required(),
    current: Joi.number().integer().min(0).required(),
    available: Joi.number().integer().min(0).required(),
  }),
  order: Joi.object({
    id: Joi.string().required(),
    version: Joi.number().integer().min(0).required(),
    update: Joi.object({
      status: Joi.string()
        .valid(...orderStatuses)
        .required(),
      notes: text,
      shipping: Joi.object({
        method: text.required(),
        courier: text.required(),
        trackingNumber: text.required(),
        status: Joi.string()
          .valid(...shippingStatuses)
          .required(),
        estimatedDelivery: text,
        deliveryDate: text,
      }).required(),
    }).required(),
  }),
  return: Joi.object({
    id: Joi.string().required(),
    status: Joi.string()
      .valid(...returnStatuses)
      .required(),
    notes: text,
  }),
  customer: Joi.object({
    id: Joi.string().required(),
    update: Joi.object({
      name: Joi.string().trim().max(150),
      email: Joi.string().email(),
      phone: text,
      status: Joi.string().valid(...customerStatuses),
      notes: text,
      address,
      shippingAddress: address,
      billingAddress: address,
    })
      .min(1)
      .required(),
  }),
  deleteCustomer: Joi.object({ id: Joi.string().required() }),
  deleteOrder: Joi.object({
    id: Joi.string().required(),
    version: Joi.number().integer().min(0).required(),
  }),
};

export const adminRouter = Router();
adminRouter.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  if (
    !["GET", "HEAD"].includes(req.method) &&
    req.headers["x-admin-request"] !== "1"
  ) {
    res.status(403).json({ error: "Invalid admin request." });
    return;
  }
  next();
});
adminRouter.use(json({ limit: "2mb" }));
// Bounded login throttling, keyed by the direct peer address (never trust forwarded headers).
const attempts = new Map<string, { count: number; until: number }>();
adminRouter.post("/signup", async (req, res) => {
  if (process.env.NODE_ENV === "production" && process.env.ADMIN_ALLOW_INITIAL_SIGNUP !== "true") {
    res.status(403).json({ error: "Initial admin setup is disabled. Sign in with your existing account." });
    return;
  }
  const key = `signup:${req.socket.remoteAddress || "unknown"}`;
  const now = Date.now();
  for (const [ip, record] of attempts) if (record.until < now) attempts.delete(ip);
  const record = attempts.get(key) || { count: 0, until: now + 15 * 60 * 1000 };
  attempts.set(key, record);
  if (++record.count > 10) {
    res.status(429).json({ error: "Too many setup attempts. Try again in 15 minutes." });
    return;
  }
  const { value, error } = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().email().max(254).required(),
    password: Joi.string().min(8).max(128).pattern(/[A-Za-z]/).pattern(/[0-9]/).required(),
  }).required().validate(req.body);
  if (error || Buffer.byteLength(value?.password || "", "utf8") > 72) {
    res.status(400).json({ error: "Enter a name, valid email and a password with 8–72 bytes including a letter and number." });
    return;
  }
  try {
    const signingSecret = secret();
    const password = await bcrypt.hash(value.password, 12);
    // A durable setup marker plus a row lock prevents concurrent first-admin creation.
    await prisma.adminWorkspace.upsert({ where: { id: "admin-setup" }, create: { id: "admin-setup", data: { completed: false } }, update: {} });
    const user = await prisma.$transaction(async tx => {
      const setup = await tx.adminWorkspace.update({ where: { id: "admin-setup" }, data: { version: { increment: 1 } } });
      if ((setup.data as { completed?: boolean }).completed || await tx.user.count({ where: { type: 1 } })) return null;
      const created = await tx.user.create({ data: { name: value.name, email: value.email.toLowerCase(), password, type: 1, status: 1 }, select: { id: true, name: true, email: true } });
      await tx.adminWorkspace.update({ where: { id: "admin-setup" }, data: { data: { completed: true } } });
      return created;
    });
    if (!user) {
      res.status(409).json({ error: "An administrator account already exists. Please sign in." });
      return;
    }
    const token = jwt.sign({ sub: String(user.id), purpose: "admin" }, signingSecret, { expiresIn: "8h" });
    res.cookie(cookie, token, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/admin-api", maxAge: 8 * 60 * 60 * 1000 });
    attempts.delete(key);
    res.status(201).json({ name: user.name, email: user.email });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      res.status(409).json({ error: "An account already exists for this email. Use another email or sign in." });
      return;
    }
    res.status(503).json({ error: "Account could not be created. Check the MySQL connection, migrations and ADMIN_SESSION_SECRET." });
  }
});
adminRouter.post("/login", async (req, res) => {
  try {
    const key = req.socket.remoteAddress || "unknown";
    const now = Date.now();
    for (const [ip, record] of attempts)
      if (record.until < now) attempts.delete(ip);
    const record = attempts.get(key) || {
      count: 0,
      until: now + 15 * 60 * 1000,
    };
    attempts.set(key, record);
    if (++record.count > 20) {
      res
        .status(429)
        .json({ error: "Too many attempts. Try again in 15 minutes." });
      return;
    }
    const { value, error } = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().max(128).required(),
    }).validate(req.body);
    if (error) {
      res.status(400).json({ error: "Enter a valid email and password." });
      return;
    }
    const user = await prisma.user.findUnique({
      where: { email: value.email.toLowerCase() },
    });
    if (
      !user ||
      user.type !== 1 ||
      user.status !== 1 ||
      user.isDeleted ||
      !(await bcrypt.compare(value.password, user.password))
    ) {
      res.status(401).json({ error: "Email or password is incorrect." });
      return;
    }
    const token = jwt.sign(
      { sub: String(user.id), purpose: "admin" },
      secret(),
      { expiresIn: "8h" },
    );
    res.cookie(cookie, token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/admin-api",
      maxAge: 8 * 60 * 60 * 1000,
    });
    attempts.delete(key);
    res.json({ name: user.name, email: user.email });
  } catch {
    res
      .status(503)
      .json({
        error:
          "Admin service is unavailable. Check database and server configuration.",
      });
  }
});
adminRouter.post("/logout", (_req, res) => {
  res.clearCookie(cookie, { path: "/admin-api" });
  res.json({ ok: true });
});
adminRouter.use(async (req, res, next) => {
  try {
    const token = req.headers.cookie
      ?.split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(cookie + "="))
      ?.slice(cookie.length + 1);
    const claims = jwt.verify(token || "", secret()) as jwt.JwtPayload;
    if (claims.purpose !== "admin") throw new Error();
    const user = await prisma.user.findUnique({
      where: { id: Number(claims.sub) },
    });
    if (!user || user.type !== 1 || user.status !== 1 || user.isDeleted)
      throw new Error();
    res.locals.admin = { name: user.name, email: user.email };
    next();
  } catch {
    res.status(401).json({ error: "Please sign in to your admin account." });
  }
});
adminRouter.get("/session", (_req, res) => {
  res.json(res.locals.admin);
});

async function workspaceRow() {
  return prisma.adminWorkspace.upsert({
    where: { id: "store" },
    create: { id: "store", data: JSON.parse(JSON.stringify(empty())) },
    update: {},
  });
}
adminRouter.get("/workspace", async (_req, res) => {
  try {
    const row = await workspaceRow();
    res.json({ ...(row.data as object), revision: row.version });
  } catch {
    res.status(503).json({ error: "Could not load MySQL admin data." });
  }
});
adminRouter.post("/command", async (req, res) => {
  try {
    const row = await workspaceRow();
    if (
      !Number.isInteger(req.body.revision) ||
      req.body.revision !== row.version
    ) {
      res
        .status(409)
        .json({ error: "Records changed. Reload the page before saving." });
      return;
    }
    const ws = row.data as unknown as Workspace & { settings?: unknown };
    let next = ws;
    const p = req.body.payload;
    if (!p || typeof p !== "object" || Array.isArray(p))
      throw new Error("Invalid action data.");
    const payloadSchema = payloadSchemas[req.body.action];
    if (payloadSchema) {
      const checked = payloadSchema.validate(p, { convert: false });
      if (checked.error) throw new Error(checked.error.message);
    }
    switch (req.body.action) {
      case "catalog": {
        if (!modules.some(([key]) => key === p.module))
          throw new Error("Unknown catalog section.");
        const moduleKey = p.module as Module;
        if (
          JSON.stringify(p.baseline) !== JSON.stringify(ws.catalog[moduleKey])
        ) {
          res
            .status(409)
            .json({
              error:
                "This section changed while editing. Reload before saving.",
            });
          return;
        }
        const checked = Joi.array()
          .items(entrySchema)
          .max(10000)
          .unique("id")
          .required()
          .validate(p.rows, { convert: false });
        if (checked.error) throw new Error(checked.error.message);
        const rows = checked.value as Entry[];
        for (const old of ws.catalog[moduleKey])
          if (!rows.some((item) => item.id === old.id)) {
            canDelete(ws.catalog, moduleKey, old.id);
            if (
              moduleKey === "products" &&
              ws.commerce.orders.some((order) =>
                order.items.some((item) => item.productId === old.id),
              )
            )
              throw new Error(
                "Products referenced by orders cannot be deleted.",
              );
          }
        const catalog = { ...ws.catalog, [moduleKey]: rows };
        for (const entry of rows) {
          validateEntry(catalog, moduleKey, entry);
          if (
            ["categories", "shop-by-style"].includes(moduleKey) &&
            !entry.name?.trim()
          )
            throw new Error("Name is required.");
          if (moduleKey === "ribbons" && !entry.text?.trim())
            throw new Error("Ribbon text is required.");
        }
        next = { ...ws, catalog };
        break;
      }
      case "stock":
        next = updateStock(ws, p.id, p.current, p.available);
        break;
      case "order":
        next = updateOrder(ws, p.id, p.update, p.version);
        break;
      case "return":
        next = updateReturnStatus(ws, p.id, p.status, p.notes);
        break;
      case "customer":
        next = updateCustomer(ws, p.id, p.update);
        break;
      case "deleteCustomer":
        next = deleteCustomer(ws, p.id);
        break;
      case "deleteOrder":
        next = deleteOrder(ws, p.id, p.version);
        break;
      case "settings": {
        const checked = settingsSchema.validate(p, { convert: false });
        if (checked.error) throw new Error(checked.error.message);
        next = { ...ws, settings: checked.value };
        break;
      }
      default:
        throw new Error("Unknown admin action.");
    }
    const saved = await prisma.adminWorkspace.updateMany({
      where: { id: "store", version: row.version },
      data: {
        data: JSON.parse(JSON.stringify(next)),
        version: { increment: 1 },
      },
    });
    if (!saved.count) {
      res
        .status(409)
        .json({
          error: "Another administrator saved changes. Reload and try again.",
        });
      return;
    }
    res.json({ ...next, revision: row.version + 1 });
  } catch (error) {
    res
      .status(400)
      .json({
        error:
          error instanceof Error && !("code" in error)
            ? error.message
            : "Could not save changes. Check the database connection.",
      });
  }
});
adminRouter.post(
  "/media",
  raw({
    type: ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"],
    limit: "30mb",
  }),
  async (req, res) => {
    try {
      const mime = req.headers["content-type"]?.split(";")[0] || "";
      if (
        !Buffer.isBuffer(req.body) ||
        !req.body.length ||
        (!mime.startsWith("video/") && req.body.length > 5 * 1024 * 1024)
      ) {
        res
          .status(400)
          .json({
            error: "Choose a valid image (up to 5 MB) or video (up to 30 MB).",
          });
        return;
      }
      const item = await prisma.adminMedia.create({
        data: { id: randomUUID(), mime, data: new Uint8Array(req.body) },
      });
      res.json({ id: `media:${item.id}` });
    } catch {
      res.status(500).json({ error: "Upload failed. Try again." });
    }
  },
);
adminRouter.get("/media/:id", async (req, res) => {
  try {
    const item = await prisma.adminMedia.findUnique({
      where: { id: req.params.id },
    });
    if (!item) {
      res.sendStatus(404);
      return;
    }
    res.type(item.mime).send(Buffer.from(item.data));
  } catch {
    res.sendStatus(500);
  }
});
