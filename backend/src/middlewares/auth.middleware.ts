import { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../jwt";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = (req as any).cookies?.access_token as string | undefined;
  if (!token)
    return res.status(401).json({ success: false, error: "Unauthorized" });
  try {
    const payload = verifyAccess(token as string) as any;
    (req as any).user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
}
