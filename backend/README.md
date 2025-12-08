# Backend README

Run locally:

```powershell
cd backend
npm install
cp .env.example .env
# edit .env to set secrets
npm run dev
```

Important env variables:
- `ACCESS_SECRET` - secret for signing access tokens
- `REFRESH_SECRET` - secret for signing refresh tokens
- `FRONTEND_URL` - allowed CORS origin

Endpoints:
- `POST /auth/login` - body `{ email, password }` -> sets httpOnly cookies and returns `user` object
- `POST /auth/refresh` - uses refresh cookie to issue new access cookie
- `GET /auth/me` - returns user according to access cookie
- `POST /auth/logout` - clears cookies
