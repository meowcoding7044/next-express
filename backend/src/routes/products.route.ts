import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleGuard } from "../middlewares/role.middleware";
import { z } from "zod";
import { readProducts, writeProducts } from "../storage";
import { Product } from "../types";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const q = (req.query.q as string) || "";
  const page = parseInt((req.query.page as string) || "1", 10);
  const pageSize = parseInt((req.query.pageSize as string) || "10", 10);
  const products = await readProducts();
  let filtered = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);
  res.json({ success: true, data, meta: { page, pageSize, total } });
});

const createSchema = z.object({
  name: z.string().min(1),
  count: z.preprocess((v) => Number(v), z.number().int().nonnegative()),
  price: z.preprocess((v) => Number(v), z.number().nonnegative()),
  groupType: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

router.post("/", authMiddleware, roleGuard(["admin", "manage"]), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: "Invalid input", details: parsed.error.format() });
  }
  const { name, count, price, groupType, status } = parsed.data;
  const products = await readProducts();
  const id = "p" + Date.now();
  const p: Product = { id, name, count, price, groupType, status } as Product;
  products.push(p);
  await writeProducts(products);
  res.json({ success: true, data: p });
});

router.put("/:id", authMiddleware, roleGuard(["admin", "manage"]), async (req, res) => {
  const id = req.params.id;
  const products = await readProducts();
  const p = products.find((x) => x.id === id);
  if (!p) return res.status(404).json({ success: false, error: "Not found" });
  Object.assign(p, req.body);
  await writeProducts(products);
  res.json({ success: true, data: p });
});

router.delete("/:id", authMiddleware, roleGuard(["admin", "manage"]), async (req, res) => {
  const id = req.params.id;
  const products = await readProducts();
  const idx = products.findIndex((x) => x.id === id);
  if (idx === -1) return res.status(404).json({ success: false, error: "Not found" });
  products.splice(idx, 1);
  await writeProducts(products);
  res.json({ success: true });
});

export default router;
