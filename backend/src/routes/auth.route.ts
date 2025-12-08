import express from "express";
import { users } from "../data";
import { hash } from "../utils";
import { signAccess, signRefresh, verifyRefresh } from "../jwt";
import { z } from "zod";
const router = express.Router();

function cookieOptions(expiresMs: number) {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    maxAge: expiresMs,
    path: "/",
  };
}

router.post("/login", (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(3) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: "Invalid input" });
  const { email, password } = parsed.data;
  const user = users.find(
    (u) => u.email === email && u.password === hash(password)
  );
  if (!user)
    return res
      .status(401)
      .json({ success: false, error: "Invalid credentials" });

  const accessToken = signAccess(
    { id: user.id, email: user.email, roles: user.roles },
    { expiresIn: "15m" }
  );
  const refreshToken = signRefresh(
    { id: user.id, email: user.email, roles: user.roles },
    { expiresIn: "7d" }
  );

  // set cookies
  res.cookie("access_token", accessToken, cookieOptions(15 * 60 * 1000));
  res.cookie("refresh_token", refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    },
  });
});

router.post("/refresh", (req, res) => {
  const token = (req as any).cookies?.refresh_token as string | undefined;
  if (!token) return res.status(401).json({ success: false, error: "No token" });
  try {
    const payload = verifyRefresh(token) as any;
    const newAccess = signAccess({ id: payload.id, email: payload.email, roles: payload.roles }, { expiresIn: "15m" });
    res.cookie("access_token", newAccess, cookieOptions(15 * 60 * 1000));
    return res.json({ success: true });
  } catch (e) {
    return res.status(401).json({ success: false, error: "Invalid refresh token" });
  }
});

router.get("/me", (req, res) => {
  const token = (req as any).cookies?.access_token as string | undefined;
  if (!token) return res.status(401).json({ success: false, error: "Unauthorized" });
  try {
    const payload = require("../jwt").verifyAccess(token) as any;
    return res.json({ success: true, user: { id: payload.id, email: payload.email, roles: payload.roles } });
  } catch (e) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("access_token", { path: "/" });
  res.clearCookie("refresh_token", { path: "/" });
  res.json({ success: true });
});

export default router;
