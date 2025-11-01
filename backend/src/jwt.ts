import jwt from "jsonwebtoken";
const SECRET = process.env.ACCESS_SECRET || "dev_secret";
export function sign(payload: object, opts: any = {}) {
  return jwt.sign(payload, SECRET, { expiresIn: opts.expiresIn || "1h" });
}
export function verify(token: string) {
  return jwt.verify(token, SECRET);
}
