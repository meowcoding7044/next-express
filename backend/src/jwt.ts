import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET || "dev_access_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "dev_refresh_secret";

export function signAccess(payload: object, opts: any = {}) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: opts.expiresIn || "15m" });
}

export function signRefresh(payload: object, opts: any = {}) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: opts.expiresIn || "7d" });
}

export function verifyAccess(token: string) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefresh(token: string) {
  return jwt.verify(token, REFRESH_SECRET);
}
