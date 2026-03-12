# Architecture

**Analysis Date:** 2026-03-12

---

## High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Browser / Client                             │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │               Next.js 15 Frontend (App Router)               │  │
│  │                                                              │  │
│  │  middleware.js ──► Route Protection (cookie: access_token)   │  │
│  │                                                              │  │
│  │  app/layout.js                                               │  │
│  │   └─ ThemeProvider                                           │  │
│  │       └─ AuthProvider (AuthContext)                          │  │
│  │           └─ LayoutWrapper (Header / Footer)                 │  │
│  │               └─ {page}                                      │  │
│  │                                                              │  │
│  │  lib/api.js  ──► fetchApi() ──► Bearer token (cookie)        │  │
│  └────────────────────────────┬─────────────────────────────────┘  │
└───────────────────────────────│─────────────────────────────────────┘
                                │ HTTPS REST (JSON)
                                │ /v1/...
┌───────────────────────────────▼─────────────────────────────────────┐
│              NestJS Backend  (Node.js / TypeScript)                 │
│              Deployed: Vercel serverless  (handler export)          │
│                                                                     │
│  main.ts → bootstrap() → NestFactory → AppModule                   │
│                                                                     │
│  Global middleware: Helmet · cookieParser · CORS                    │
│  Global pipes:      ValidationPipe (whitelist + transform)          │
│  Global filter:     HttpExceptionFilter  (structured JSON errors)   │
│  Global interceptor: TransformInterceptor ({statusCode, msg, data}) │
│                                                                     │
│  URI versioning: all routes under /v1/                              │
│                                                                     │
│  Modules:                                                           │
│    Auth · Users · Posts · Comments · Follows                        │
│    Notifications · Notes · Events · Notices                         │
│    Blogs · Films · Publications · Upload                            │
│                                                                     │
│  DatabaseModule (Global) ──► Drizzle ORM ──► pg.Pool               │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ DATABASE_URL (env)
                    ┌───────────▼───────────┐
                    │   PostgreSQL Database  │
                    │   (hosted externally)  │
                    └───────────────────────┘

                    ┌───────────────────────┐
                    │   Vercel Blob Storage  │
                    │  (avatars, post images,│
                    │   PDFs, uploads)       │
                    └───────────────────────┘
```

---

## Pattern Overview

**Overall:** Decoupled monorepo — Next.js SPA frontend + NestJS REST API backend. Both deployed independently (both on Vercel). Communication is entirely via HTTP REST with JWT Bearer auth.

**Key Characteristics:**
- Frontend is fully client-side rendered for authenticated pages (all page files use `"use client"`)
- Backend uses NestJS module system with a Controller → Service → Drizzle ORM layering
- Single shared database schema file (`backend/src/database/schema.ts`) defines all tables
- Global response envelope: every API response is wrapped as `{ statusCode, message, data }` by `TransformInterceptor`
- Frontend's `lib/api.js` transparently unwraps the `data` field before returning to callers

---

## Layers

### Frontend — Pages Layer
- Purpose: Route-level UI components, data fetching, and page composition
- Location: `app/*/page.js` and `app/*/page.jsx`
- Contains: Client components that call `fetchApi()` inside `useEffect` hooks
- Depends on: `lib/api.js`, `app/context/AuthContext.js`, `app/components/**`
- Pattern: Each page manages its own local state via `useState`/`useEffect`. No shared data-fetching layer.

### Frontend — Context Layer
- Purpose: Global client-side state
- Location: `app/context/AuthContext.js`
- Contains: `AuthProvider` and `useAuth` hook — tracks `isAuthenticated`, `user` object, and exposes `login()` / `logout()` / `refreshUser()`
- Used by: Header, all protected pages, `withRoleProtection` HOC

### Frontend — Component Layer
- Purpose: Reusable UI units
- Location: `app/components/`
- Sub-directories:
  - `auth/` — Form components per auth action + `withRoleProtection` HOC
  - `feed/` — `PostCard`, `CreatePost`, `CommentSection`, `CommentItem`
  - `notes/` — `NoteCard`, `NotesList`, `CreateNoteModal`
  - `notifications/` — `NotificationCenter`
  - `settings/` — `SecuritySection`
  - `ui/` — Primitive shared components: `Button`, `GlassCard`, `Modal`
- Top-level components: `Header.jsx`, `Footer.jsx`, `Hero.jsx`, `LayoutWrapper.jsx`

### Frontend — API Client Layer
- Purpose: Centralized HTTP client
- Location: `lib/api.js`
- Contains: `fetchApi(endpoint, options)` — attaches Bearer token from `access_token` cookie, handles 401 globally (clears cookie + redirects to `/login`), unwraps `{ statusCode, message, data }` response envelope
- `API_BASE_URL` resolves from `NEXT_PUBLIC_API_URL` env var, defaults to `http://localhost:8000` in dev and `https://frl-backend.vercel.app` in prod

### Backend — Controller Layer
- Purpose: HTTP request handling and routing
- Location: `backend/src/<module>/<module>.controller.ts`
- Contains: Route decorators, guard application, DTO extraction, delegation to service
- Depends on: Services, Guards (`JwtAuthGuard`, `RolesGuard`)

### Backend — Service Layer
- Purpose: Business logic and database access
- Location: `backend/src/<module>/<module>.service.ts`
- Contains: Drizzle ORM queries, data transformations, cross-service calls
- Depends on: `DRIZZLE` token (injected DB client), other services (e.g., `PostsService` → `FollowsService`)

### Backend — Database Layer
- Purpose: PostgreSQL connection and schema definition
- Location: `backend/src/database/`
  - `database.module.ts` — provides the global `DRIZZLE` injection token using `drizzle-orm/node-postgres`
  - `schema.ts` — single source of truth for all table definitions and Drizzle relations
- All services inject the `DRIZZLE` token directly via `@Inject(DRIZZLE)`

---

## Data Flow

### Standard API Request (Authenticated Page):

1. Page component mounts → `useEffect` fires
2. `fetchApi('/v1/resource', options)` called from `lib/api.js`
3. `fetchApi` reads `access_token` from `document.cookie`, injects as `Authorization: Bearer <token>` header
4. HTTP request hits NestJS backend at `https://frl-backend.vercel.app/v1/resource`
5. `JwtAuthGuard` validates JWT (from `Authorization` header OR `access_token` cookie)
6. `JwtStrategy.validate()` returns `{ sub, email, role }` → populates `req.user`
7. Controller method executes → delegates to service
8. Service runs Drizzle query against PostgreSQL
9. Controller returns plain object → `TransformInterceptor` wraps it: `{ statusCode, message, data: <payload> }`
10. `fetchApi` receives response → monkey-patches `.json()` to auto-unwrap `data` field
11. Page component receives unwrapped payload and sets state via `setState`

### State Management:
- No global state store (no Redux/Zustand). Each page owns its data in local `useState`.
- Only truly global state is auth state (`AuthContext`): `isAuthenticated`, `user` object.
- `user` is populated by fetching `/v1/users/profile` after login is confirmed.

---

## Authentication Flow

### Login:
1. User submits `LoginForm` (`app/components/auth/LoginForm.jsx`)
2. POST `/v1/auth/login` with `{ email, password }`
3. `AuthService.login()` validates credentials via bcrypt, calls `generateTokens()`
4. `generateTokens()` issues JWT (access + refresh, both currently `36500d` expiry)
5. Response returns `{ access_token, refresh_token, user: { id, email, name } }`
6. `AuthContext.login(token)` writes `access_token` to browser cookie: `document.cookie = access_token=<token>; path=/; max-age=...; SameSite=Lax`
7. `isAuthenticated` set to `true`, `/v1/users/profile` fetched to populate `user`

### Route Protection (Two Layers):
**Layer 1 — Next.js middleware** (`middleware.js`):
- Reads `access_token` cookie on every request
- Unauthenticated users accessing protected paths → redirect to `/login`
- Authenticated users accessing auth pages (login/signup) → redirect to `/profile`
- Protected paths: `/profile/*`, `/settings/*`, `/people/*`, `/dashboard/*`, auth pages

**Layer 2 — Client-side HOC** (`app/components/auth/withRoleProtection.js`):
- Wraps admin/super-admin pages
- Reads `user.role` from `AuthContext` after mount
- Redirects to `/` if role not in `allowedRoles`
- Usage: `export default withRoleProtection(AdminPanel, ["Admin", "SuperAdmin"])`

### JWT Verification (Backend):
- `JwtStrategy` (`backend/src/auth/jwt.strategy.ts`) extracts token from:
  1. `Authorization: Bearer <token>` header
  2. `request.cookies['access_token']` (fallback)
- Token validated against `JWT_SECRET` env var
- `req.user` populated with `{ sub, email, role }`

### Role System:
- Three roles: `Individual` (default), `Admin`, `SuperAdmin`
- Backend enforcement: `RolesGuard` + `@Roles('SuperAdmin')` decorator on sensitive routes
- `SuperAdmin` is seeded automatically on startup via `AuthService.onModuleInit()`

### Password Reset Flow:
1. POST `/v1/auth/forgot-password` → generates crypto token, stores hashed in DB with 1-hour expiry, logs reset URL to console (email not implemented)
2. POST `/v1/auth/reset-password` with token + new password → verifies token expiry, updates password, revokes refresh token

---

## Database Schema Overview

All tables defined in `backend/src/database/schema.ts` using Drizzle ORM `pgTable`.

**Core Identity:**
```
users
  id (PK, serial)
  email (unique, varchar 255)
  password (bcrypt hash, varchar 255)
  name, phone, bio, expertise, role
  avatarUrl, refreshToken, resetToken, resetTokenExpires
  -- Rich profile fields:
  values, professionalProfile, geographicalSpread,
  interventions, problem, systemChange, systemImpact,
  abundance, helpNeeded
  createdAt, updatedAt
```

**Social Layer:**
```
posts       (id, userId→users, content, imageUrl, category, timestamps)
likes       (id, userId→users, postId→posts, createdAt)
comments    (id, userId→users, postId→posts, parentId→comments [nested], content, timestamps)
follows     (id, followerId→users, followingId→users, createdAt)
notes       (id, userId→users, title, content, isVoiceNote, audioUrl, transcription, timestamps)
notifications (id, userId→users, title, message, type, isRead, createdAt)
```

**Admin-Managed Resources:**
```
events       (id, title, description, date, location, imageUrl, createdBy→users, timestamps)
notices      (id, title, content, priority, createdBy→users, timestamps)
blogs        (id, title, content, authorName, imageUrl, createdBy→users, timestamps)
films        (id, title, description, embedUrl, createdBy→users, timestamps)
publications (id, title, summary, authors, pdfUrl, createdBy→users, timestamps)
```

**Junction Tables:**
```
event_registrations (id, eventId→events, userId→users, registeredAt)
```

**Drizzle Relations:** Defined alongside tables in `schema.ts`. Used for query-builder `.query.*` API. `usersRelations` maps `users` → `many(events/notices/blogs/films/publications/eventRegistrations/notifications)`.

---

## Key Design Patterns

### Backend

**NestJS Module Pattern:**
Each domain is a self-contained module: `<name>.module.ts` + `<name>.controller.ts` + `<name>.service.ts` + `dto/` folder. Example: `backend/src/posts/`.

**Global Response Envelope:**
`TransformInterceptor` wraps all non-string responses in `{ statusCode, message: 'Success', data }`. The frontend `fetchApi` transparently unwraps `data` before resolving.

**Drizzle Injection:**
`DatabaseModule` is `@Global()` and exports the `DRIZZLE` symbol token. Services receive it via `@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>`.

**Vercel Serverless Adapter:**
`backend/src/main.ts` exports a `handler(req, res)` function used as a Vercel serverless function, bootstrapping the NestJS app lazily and reusing it across invocations. Local dev falls back to `app.listen(port)`.

**File Upload via Vercel Blob:**
Both `UploadController` (`/v1/upload`) and `PostsController` use `@vercel/blob`'s `put()` to store files at `general/` or `posts/` prefixes. The returned public URL is persisted in the database.

### Frontend

**`withRoleProtection` HOC:**
Located at `app/components/auth/withRoleProtection.js`. Wraps any page component and enforces role-based access client-side. Takes `allowedRoles` array.
```js
export default withRoleProtection(AdminPanel, ["Admin", "SuperAdmin"]);
```

**Optimistic UI Updates:**
`PostCard` applies like/unlike immediately in local state, then reverts on API error.

**Infinite Scroll via IntersectionObserver:**
`app/feed/page.js` uses a `useRef` + `IntersectionObserver` on the last post element to trigger `setPage(prev => prev + 1)` for cursor-based pagination.

---

## Component Organization

```
app/
├── layout.js                    # Root layout: ThemeProvider → AuthProvider → LayoutWrapper
├── page.js                      # Landing / home page
├── context/
│   └── AuthContext.js           # Global auth state + useAuth hook
├── components/
│   ├── Header.jsx               # Sticky nav with user menu + NotificationCenter
│   ├── Footer.jsx               # Site footer
│   ├── Hero.jsx                 # Landing hero section
│   ├── LayoutWrapper.jsx        # Conditionally renders Header/Footer
│   ├── auth/
│   │   ├── AuthLayout.jsx       # Wrapper for auth pages
│   │   ├── LoginForm.jsx
│   │   ├── SignupForm.jsx
│   │   ├── ForgotPasswordForm.jsx
│   │   ├── ResetPasswordForm.jsx
│   │   ├── ChangePasswordForm.jsx
│   │   └── withRoleProtection.js   # HOC for role-based page protection
│   ├── feed/
│   │   ├── CreatePost.jsx
│   │   ├── PostCard.jsx
│   │   ├── CommentSection.jsx
│   │   └── CommentItem.jsx
│   ├── notes/
│   │   ├── CreateNoteModal.jsx
│   │   ├── NoteCard.jsx
│   │   └── NotesList.jsx
│   ├── notifications/
│   │   └── NotificationCenter.jsx
│   ├── settings/
│   │   └── SecuritySection.jsx
│   └── ui/
│       ├── Button.jsx
│       ├── GlassCard.jsx
│       └── Modal.jsx
```

---

## Entry Points

### Frontend Entry Points:

**Root Layout:**
- Location: `app/layout.js`
- Wraps all pages with `ThemeProvider` → `AuthProvider` → `LayoutWrapper`
- Registers global `<Toaster>` (sonner) for toast notifications

**Next.js Middleware:**
- Location: `middleware.js` (root of project)
- Runs on edge before every matched request
- Matcher: `/profile/:path*`, `/settings/:path*`, `/people/:path*`, `/dashboard/:path*`, auth pages

**API Client:**
- Location: `lib/api.js`
- `fetchApi(endpoint, options)` — the single function all pages use to call the backend
- `API_BASE_URL` is derived from `NEXT_PUBLIC_API_URL` env var

### Backend Entry Points:

**Serverless Handler:**
- Location: `backend/src/main.ts`
- Exports `handler(req, res)` for Vercel deployment
- Bootstraps NestJS app once, reuses across invocations

**App Module:**
- Location: `backend/src/app.module.ts`
- Imports all feature modules, registers global filter and interceptor

---

## Error Handling

**Backend Strategy:** Global exception filter catches all errors. Structured response format:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "...",
  "timestamp": "...",
  "path": "/v1/..."
}
```
- `HttpExceptionFilter` (`backend/src/common/filters/http-exception.filter.ts`) — catches all, logs 500s
- Services throw typed NestJS exceptions: `NotFoundException`, `ForbiddenException`, `ConflictException`, `UnauthorizedException`, `BadRequestException`

**Frontend Strategy:**
- `fetchApi` catches network failures and returns a mock `{ ok: false, status: 500 }` object to prevent crashes
- 401 responses trigger automatic cookie clear + redirect to `/login` with `?message=session_expired`
- Pages display inline error states. Toasts via `sonner` for user-facing feedback.

---

## Cross-Cutting Concerns

**Logging:** `console.log` / `console.error` only. No structured logging library.

**Validation:** NestJS `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true` on all backend routes. DTOs defined per module in `dto/` folders using `class-validator`.

**Authentication:** JWT Bearer tokens stored as browser cookies (`access_token`). Dual extraction in `JwtStrategy`: `Authorization` header or cookie. Token expiry currently set to `36500d` (effectively permanent).

**API Documentation:** Swagger UI auto-generated at `/docs` on the backend. All controllers annotated with `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiBearerAuth`.

**Theme:** `next-themes` with `ThemeProvider` at root. Default: dark mode. Toggled via Header button.

**Notifications:** `NotificationsModule` is `@Global()` and exports `NotificationsService`, allowing any other module to inject and create notifications without importing the module explicitly.

---

*Architecture analysis: 2026-03-12*
