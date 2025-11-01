import express from "express";
import { users } from "../data";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleGuard } from "../middlewares/role.middleware";
import { hash } from "../utils";
const router = express.Router();
router.get("/", authMiddleware, roleGuard(["admin"]), (req, res) => {
  const safe = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    roles: u.roles,
  }));
  res.json({ success: true, data: safe });
});
router.post("/", authMiddleware, roleGuard(["admin"]), (req, res) => {
  const { name, email, password, roles } = req.body;
  const id = String(Date.now());
  users.push({
    id,
    name,
    email,
    password: hash(password || "password"),
    roles: roles || ["general"],
  });
  res.json({ success: true, data: users.find((u) => u.id === id) });
});
router.put("/:id", authMiddleware, roleGuard(["admin"]), (req, res) => {
  const id = req.params.id;
  const u = users.find((u) => u.id === id);
  if (!u) return res.status(404).json({ success: false, error: "Not found" });
  const { name, email, roles } = req.body;
  if (name) u.name = name;
  if (email) u.email = email;
  if (roles) u.roles = roles;
  res.json({
    success: true,
    data: { id: u.id, name: u.name, email: u.email, roles: u.roles },
  });
});
router.delete("/:id", authMiddleware, roleGuard(["admin"]), (req, res) => {
  const id = req.params.id;
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1)
    return res.status(404).json({ success: false, error: "Not found" });
  users.splice(idx, 1);
  res.json({ success: true });
});
export default router;
