# External Integrations

**Analysis Date:** 2026-03-12

---

## File Storage

**Vercel Blob:**
- Purpose: Primary file/image upload storage; used for user avatar uploads and general media
- SDK: `@vercel/blob ^2.3.1` (backend)
- Auth env var: `BLOB_READ_WRITE_TOKEN`
- Upload endpoint: `POST /v1/upload` — `backend/src/upload/upload.controller.ts`
- Access mode: `public` (files served from Vercel Blob CDN)
- CDN domain: `*.public.blob.vercel-storage.com` (allowlisted in `next.config.mjs`)
- Size limit: 2MB enforced in `backend/src/upload/upload.controller.ts`

---

## Image Services

**Unsplash:**
- Purpose: External image hosting (placeholder / content images)
- Integration: Domain allowlisted in `next.config.mjs` under `images.remotePatterns`
- No API key required — domain-level image optimisation only

**DiceBear Avatars (`api.dicebear.com`):**
- Purpose: Auto-generated avatars
- Integration: Domain allowlisted in `next.config.mjs`
- No API key required — used as fallback avatar URLs

---

## Data Storage

**PostgreSQL:**
- Purpose: Primary relational database
- Providers: Neon, Supabase, or self-hosted Postgres (all connection-string compatible)
- Connection: `DATABASE_URL` env var
- Client: `pg ^8.11.3` (connection pool via `pg.Pool`)
- ORM: Drizzle ORM `^0.29.3` (backend), `^0.45.1` (frontend)
- Schema: `backend/src/database/schema.ts`
- Pool settings: connectionTimeout 5000ms, idleTimeout 10000ms

**File storage (local static serving — development only):**
- `@nestjs/serve-static ^4.0.2` serves `backend/uploads/` at `/uploads`
- For production, Vercel Blob replaces local file storage

---

## Authentication & Identity

**Custom JWT Auth (no third-party identity provider):**
- Implementation: `backend/src/auth/` — fully custom
- Libraries: `@nestjs/jwt`, `passport-jwt`, `bcrypt`
- Token transport: HTTP-only-style cookie (`access_token`) set by client-side JS; also accepted via `Authorization: Bearer` header
- No OAuth, SAML, or external identity provider detected

---

## Deployment Platform

**Vercel (frontend + backend):**
- Frontend: Next.js deployed to Vercel (inferred from `NEXT_PUBLIC_API_URL` production value `https://frl-backend.vercel.app` and CORS allowlist in `backend/src/main.ts`)
- Backend: NestJS deployed as Vercel Serverless Function via `@vercel/node ^5.6.9`
  - Deployment config: `backend/vercel.json`
  - Serverless handler exported from `backend/src/main.ts`
- Production domains: `https://www.myfrl.in`, `https://myfrl.in`, `https://frl-two.vercel.app`

---

## API Documentation

**Swagger / OpenAPI:**
- Library: `@nestjs/swagger ^7.4.2`
- Available at: `http://localhost:8000/docs` (development only)
- CSS/JS served from Cloudflare CDN (`cdnjs.cloudflare.com`)
- Auth: Bearer token support (`addBearerAuth()`)

---

## Security Middleware

**Helmet (`helmet ^7.1.0`):**
- Applied globally in `backend/src/main.ts`
- CSP configured with allowlists for Cloudflare CDN and Google Fonts
- `crossOriginEmbedderPolicy` disabled

---

## Monitoring & Observability

**Error Tracking:** Not detected — no Sentry, Datadog, or similar SDK found.

**Logs:** `console.log` / `console.error` only — no structured logging library detected.

---

## Email / Notifications

**Email:** Not integrated — password reset links are currently logged to console only (noted in `backend/src/auth/auth.service.ts` comment: "In a real app, send email. For now, log to console").

**Push / In-App Notifications:** Internal only — `notifications` table in PostgreSQL, served via `backend/src/notifications/` REST endpoints. No external push service (FCM, OneSignal, etc.) detected.

---

## Webhooks & Callbacks

**Incoming:** None detected.

**Outgoing:** None detected.

---

## External Fonts

**Google Fonts:**
- Font: Inter loaded via `next/font/google` in `app/layout.js`
- CSS allowed in Helmet CSP: `https://fonts.googleapis.com`
- Font files: `https://fonts.gstatic.com`

---

## CDN

**Cloudflare CDN (`cdnjs.cloudflare.com`):**
- Used to serve Swagger UI assets (CSS + JS) in backend Swagger setup (`backend/src/main.ts`)
- No other Cloudflare products detected

---

## Environment Variables Summary

| Variable | Service | Where Used |
|---|---|---|
| `DATABASE_URL` | PostgreSQL | `backend/src/database/database.module.ts` |
| `JWT_SECRET` | Custom Auth | `backend/src/auth/jwt.strategy.ts` |
| `JWT_EXPIRES_IN` | Custom Auth | `backend/src/config/configuration.ts` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob | `backend/src/upload/upload.controller.ts` |
| `FRONTEND_URL` | CORS | `backend/src/main.ts` |
| `NEXT_PUBLIC_API_URL` | API Client | `lib/api.js` |
| `PORT` | Backend server | `backend/src/config/configuration.ts` |

---

*Integration audit: 2026-03-12*
