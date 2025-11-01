import express from "express";
import { products } from "../data";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleGuard } from "../middlewares/role.middleware";
const router = express.Router();
router.get("/", authMiddleware, (req, res) => {
  const q = (req.query.q as string) || "";
  const page = parseInt((req.query.page as string) || "1", 10);
  const pageSize = parseInt((req.query.pageSize as string) || "10", 10);
  let filtered = products.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);
  res.json({ success: true, data, meta: { page, pageSize, total } });
});
router.post("/", authMiddleware, roleGuard(["admin", "manage"]), (req, res) => {
  const { name, count, price, groupType, status } = req.body;
  const id = "p" + Date.now();
  const p = { id, name, count, price, groupType, status };
  products.push(p);
  res.json({ success: true, data: p });
});
router.put(
  "/:id",
  authMiddleware,
  roleGuard(["admin", "manage"]),
  (req, res) => {
    const id = req.params.id;
    const p = products.find((x) => x.id === id);
    if (!p) return res.status(404).json({ success: false, error: "Not found" });
    Object.assign(p, req.body);
    res.json({ success: true, data: p });
  }
);
router.delete(
  "/:id",
  authMiddleware,
  roleGuard(["admin", "manage"]),
  (req, res) => {
    const id = req.params.id;
    const idx = products.findIndex((x) => x.id === id);
    if (idx === -1)
      return res.status(404).json({ success: false, error: "Not found" });
    products.splice(idx, 1);
    res.json({ success: true });
  }
);
export default router;
