# สรุปโปรเจค — Next.js (v16) + Express (TypeScript)

สรุปนี้อธิบายโครงสร้างหลัก วิธีรัน และจุดสำคัญของโค้ดในโปรเจค

## ภาพรวม
- **Frontend:** Next.js 16 (App Router) + React 19, TypeScript, Zustand, React Query, Tailwind
- **Backend:** Express + TypeScript, JWT-based auth, รันบนพอร์ต `4000` by default

## Backend (สำคัญ)
- **Entry:** `backend/src/index.ts` — ตั้งค่า Express, CORS (origin `http://localhost:3000`), routes `/auth`, `/users`, `/products`, `/health`.
- **Auth:** `backend/src/routes/auth.route.ts` — endpoint `/auth/login` ตรวจสอบผู้ใช้จาก `data.ts` และส่ง JWT (ใช้ `backend/src/jwt.ts`).
- **JWT helper:** `backend/src/jwt.ts` — wrapper ของ `jsonwebtoken` (ใช้ secret จาก `process.env.ACCESS_SECRET` หรือค่า default `dev_secret`).
- **Auth middleware:** `backend/src/middlewares/auth.middleware.ts` — ตรวจ header `Authorization` แบบ `Bearer <token>` และ verify token.
- **Utilities / Data:** `backend/src/utils.ts` (hash), `backend/src/data.ts` (mocked users) — โปรเจคนี้ใช้ข้อมูลผู้ใช้ตัวอย่างในไฟล์ `data.ts`.
- **Run:** ในโฟลเดอร์ `backend` ใช้ `npm install` แล้ว `npm run dev` (สคริปต์รัน `ts-node` + `nodemon`).

## Frontend (สำคัญ)
- **Framework:** Next.js v16 (app router). โค้ดอยู่ใน `frontend/app` และฟีเจอร์/ส่วนประกอบใน `frontend/features` และ `frontend/shared`.
- **Auth flow:**
  - ฟอร์ม login ที่ `frontend/features/auth/components/LoginForm.tsx` เรียก `useAuth` (hook) เพื่อ login
  - `frontend/shared/lib/api-client.ts` — axios instance: `baseURL` มาจาก `NEXT_PUBLIC_API_URL` หรือ `http://localhost:4000` และใส่ header `Authorization` จาก `localStorage` via `auth.store`.
  - `frontend/shared/stores/auth.store.ts` — Zustand store เก็บ `user` และ `access_token` ใน `localStorage` (ฟังก์ชัน `initAuthStore`, `getToken`, `clearToken` มีให้เรียกใช้)
- **Guard / Roles:** `frontend/shared/components/RequireRole.tsx` — ใช้ตรวจ role จาก store และ redirect ถ้าไม่ผ่านเงื่อนไข
- **Pages:** ตัวอย่าง: `frontend/app/auth/login/page.tsx`, `frontend/app/page.tsx`, `frontend/app/products/page.tsx` (ถ้ามี)
- **Run:** ในโฟลเดอร์ `frontend` ใช้ `npm install` แล้ว `npm run dev` (Next dev server)

## Env / Config ที่สำคัญ
- `NEXT_PUBLIC_API_URL` — base URL ของ backend (default `http://localhost:4000`)
- `ACCESS_SECRET` (backend) — secret สำหรับ sign/verify JWT (อย่าใช้ค่า default ใน production)
- CORS: backend `index.ts` ตั้ง origin เป็น `http://localhost:3000` — ปรับเมื่อ deploy

## การทำงานของ auth (สรุป)
- ผู้ใช้ส่ง `POST /auth/login` กับ `email`/`password`.
- Backend ตรวจสอบกับ `data.ts` (hash password) และส่ง `accessToken` (JWT) กลับมาพร้อมข้อมูลผู้ใช้.
- Frontend เก็บ token และ user ใน `localStorage` ผ่าน `auth.store`.
- `api-client` แนบ `Authorization: Bearer <token>` ในแต่ละ request.
- ถ้า API ตอบ `401` client จะ `clearToken()` และ redirect ไปที่ `/auth/login`.

## จุดสังเกต / ความเสี่ยง
- Token เก็บใน `localStorage` — เสี่ยง XSS; ถ้าเป็น production ควรพิจารณาใช้ httpOnly cookie + refresh token
- Secret สำหรับ JWT ถูกตั้ง default เป็น `dev_secret` — ต้องกำหนดใน env สำหรับ production
- ไม่มี mechanism สำหรับ refresh token / token rotation — ถ้าต้องการ session ยาวขึ้น ควรเพิ่ม flow refresh token
- CORS และ origin ควรปรับให้เข้ากับการ deploy (และเปิดเฉพาะ origin ที่เชื่อถือได้)

## ไฟล์สำคัญ (map)
- `backend/src/index.ts` — เริ่ม server, ตั้ง CORS, ลงทะเบียน routes
- `backend/src/routes/auth.route.ts` — login flow
- `backend/src/middlewares/auth.middleware.ts` — middleware ตรวจ token
- `backend/src/jwt.ts` — sign / verify JWT
- `frontend/shared/lib/api-client.ts` — axios client + interceptors
- `frontend/shared/stores/auth.store.ts` — zustand store + persistence
- `frontend/features/auth/components/LoginForm.tsx` — UI สำหรับ login
- `frontend/shared/components/RequireRole.tsx` — role-based guard

## คำสั่งรัน (local)
Backend (พาธ `backend`):
```
npm install
npm run dev
```
Frontend (พาธ `frontend`):
```
npm install
npm run dev
```

## ที่จะอัปเดตในอนาคต (ถัดไป)
- เก็บ `ACCESS_SECRET` และ config อื่นใน `.env` และไม่คอมมิต
- เปลี่ยนการเก็บ token เป็น httpOnly cookie + เพิ่ม refresh-token flow
- เพิ่ม validation / error handling ฝั่ง backend (เช่น zod หรือ class-validator)
- เพิ่ม unit tests สำหรับ auth และ integration tests สำหรับ API
- สร้าง README แยกสำหรับ `backend` และ `frontend` ที่อธิบาย env vars และตัวอย่าง request/response

---
