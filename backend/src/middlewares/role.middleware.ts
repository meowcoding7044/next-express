import { Request, Response, NextFunction } from "express";
export function roleGuard(allowed: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user)
      return res.status(401).json({ success: false, error: "Unauthorized" });
    const ok = (user as any).roles?.some((r: string) => allowed.includes(r));
    if (!ok)
      return res.status(403).json({ success: false, error: "Forbidden" });
    next();
  };
}
