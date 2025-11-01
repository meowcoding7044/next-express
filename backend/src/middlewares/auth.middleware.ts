import { Request, Response, NextFunction } from "express";
import { verify } from "../jwt";
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const h = (req.headers.authorization as string) || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token)
    return res.status(401).json({ success: false, error: "Unauthorized" });
  try {
    const payload = verify(token as string);
    (req as any).user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
}
