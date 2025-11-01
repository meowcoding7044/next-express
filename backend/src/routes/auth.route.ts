import express from "express";
import { users } from "../data";
import { hash } from "../utils";
import { sign } from "../jwt";
const router = express.Router();
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(
    (u) => u.email === email && u.password === hash(password)
  );
  if (!user)
    return res
      .status(401)
      .json({ success: false, error: "Invalid credentials" });
  const token = sign(
    { id: user.id, email: user.email, roles: user.roles },
    { expiresIn: "2h" }
  );
  res.json({
    success: true,
    accessToken: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    },
  });
});
export default router;
