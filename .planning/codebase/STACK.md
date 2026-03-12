# Technology Stack

**Analysis Date:** 2026-03-12

---

## Languages

**Frontend:**
- JavaScript (ES2020+) — Next.js app router pages, components, context, and lib utilities
- JSX — React components throughout `app/`

**Backend:**
- TypeScript 5.1 — All NestJS backend source in `backend/src/`
- Compiled target: ES2021 (`backend/tsconfig.json`)

---

## Runtime

**Environment:**
- Node.js (version unspecified in config; backend targets Node 20 types via `@types/node ^20.3.1`)

**Package Managers:**
- Frontend: npm (lockfile: `package-lock.json` at root)
- Backend: npm (lockfile: `backend/package-lock.json`)

---

## Frontend Framework

**Core:**
- Next.js `15.4.8` — App Router, React Server Components enabled
  - Config: `next.config.mjs`
  - Path alias: `@/*` → `./` (configured in `jsconfig.json`)
  - Dev server: Turbopack (`next dev --turbopack`)
  - No `src/` directory — pages live directly in `app/`

- React `19.1.0` / React DOM `19.1.0`

**Rendering:**
- Mix of Server Components (default) and Client Components (`"use client"` directive)
- RSC enabled in shadcn config (`"rsc": true`)
- Frontend is written in `.js` / `.jsx` (not TypeScript — `"tsx": false` in `components.json`)

---

## Backend Framework

**Core:**
- NestJS `^10.0.0` — Modular architecture with controllers, services, guards, interceptors
  - Entry: `backend/src/main.ts`
  - Root module: `backend/src/app.module.ts`
  - HTTP adapter: Express via `@nestjs/platform-express ^10.0.0`
  - API versioning: URI-based, default version `1` (routes are `/v1/...`)
  - Port: `8000` (default)

**NestJS Modules present:**
- `AuthModule` — `backend/src/auth/auth.module.ts`
- `UsersModule` — `backend/src/users/users.module.ts`
- `NotesModule` — `backend/src/notes/notes.module.ts`
- `PostsModule` — `backend/src/posts/posts.module.ts`
- `CommentsModule` — `backend/src/comments/comments.module.ts`
- `FollowsModule` — `backend/src/follows/follows.module.ts`
- `EventsModule` — `backend/src/events/events.module.ts`
- `NoticesModule` — `backend/src/notices/notices.module.ts`
- `BlogsModule` — `backend/src/blogs/blogs.module.ts`
- `PublicationsModule` — `backend/src/publications/publications.module.ts`
- `FilmsModule` — `backend/src/films/films.module.ts`
- `UploadModule` — `backend/src/upload/upload.module.ts`
- `NotificationsModule` — `backend/src/notifications/notifications.module.ts`
- `DatabaseModule` — `backend/src/database/database.module.ts` (global)

---

## Database

**Engine:** PostgreSQL (via connection string `DATABASE_URL`)
- Supported providers: Neon, Supabase, or local Postgres (per `.env.example`)
- Default local DB name: `frl_db`

**ORM:** Drizzle ORM
- Frontend: `drizzle-orm ^0.45.1` (root `package.json`) — used client-side for type imports/query shaping
- Backend: `drizzle-orm ^0.29.3` (`backend/package.json`) — primary runtime usage
- Driver: `node-postgres` (`pg ^8.11.3`)
- Schema file: `backend/src/database/schema.ts`
- Migrations output: `backend/src/database/migrations/`
- Drizzle config: `backend/drizzle.config.ts`

**Schema Tables (defined in `backend/src/database/schema.ts`):**
- `users` — profiles, roles, auth tokens, reset tokens
- `notes` — user notes with optional voice/audio support
- `posts` — social feed posts with category
- `likes` — post likes join table
- `comments` — threaded comments (self-referencing `parentId`)
- `follows` — follower/following join table
- `events` — admin-managed events with registrations
- `event_registrations` — event attendance join table
- `notices` — admin notice board
- `blogs` — admin blog posts
- `films` — admin film entries with embed URLs
- `publications` — admin publications with PDF links
- `notifications` — per-user notification records

**DB Connection (backend):**
- `pg.Pool` with connection timeout 5000ms, idle timeout 10000ms
- Injected application-wide via `DRIZZLE` symbol token from `DatabaseModule`

**Drizzle CLI commands (backend):**
```bash
npm run db:generate   # drizzle-kit generate:pg
npm run db:push       # drizzle-kit push:pg
npm run db:studio     # drizzle-kit studio
```

---

## Authentication

**Strategy:** Custom JWT-based auth (no third-party auth provider)

**Backend implementation:**
- `@nestjs/jwt ^10.2.0` — JWT signing/verification
- `@nestjs/passport ^11.0.5` + `passport ^0.7.0` + `passport-jwt ^4.0.1`
- JWT Strategy: `backend/src/auth/jwt.strategy.ts`
  - Extracts token from `Authorization: Bearer` header OR `access_token` cookie
  - Secret: `JWT_SECRET` env var (required)
- JWT Guard: `backend/src/auth/jwt-auth.guard.ts`
- Roles Guard: `backend/src/auth/guards/roles.guard.ts`
- Roles Decorator: `backend/src/auth/decorators/roles.decorator.ts`
- Password hashing: `bcrypt ^6.0.0` (10 salt rounds)
- Token storage: hashed refresh token stored in `users.refresh_token` DB column
- Token expiry: currently hardcoded to `36500d` (effectively non-expiring — see concerns)
- Auth flows: register, login, refresh, logout, forgot-password, reset-password, change-password

**Frontend implementation:**
- Middleware: `middleware.js` — cookie-based route protection using `access_token` cookie
- Auth context: `app/context/AuthContext.js` — React context managing auth state
- Role protection HOC: `app/components/auth/withRoleProtection.js`
- Token stored in browser cookie: `access_token` with `max-age=3153600000; SameSite=Lax`
- Protected routes (middleware matcher): `/profile`, `/settings`, `/people`, `/dashboard`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/change-password`

**User Roles:**
- `Individual` (default)
- `Admin`
- `SuperAdmin` (auto-seeded on startup via `AuthService.onModuleInit`)

---

## UI Component Library

**shadcn/ui** — `shadcn ^3.8.4` (CLI only, components are copied into the repo)
- Style: `new-york`
- Base color: `neutral`
- CSS variables: enabled
- Icon library: `lucide-react ^0.525.0`
- Config: `components.json`
- Component alias: `@/components/ui`

**Additional registries:**
- `@react-bits` — `https://reactbits.dev/r/{name}.json` (configured in `components.json`)

**Custom UI components (app-specific, in `app/components/ui/`):**
- `GlassCard.jsx`
- `Button.jsx`
- `Modal.jsx`

---

## Styling

- Tailwind CSS `^4` (v4, PostCSS-based)
  - PostCSS integration: `@tailwindcss/postcss ^4`
  - Animation utilities: `tw-animate-css ^1.4.0`
  - Global styles: `app/globals.css`
- `tailwind-merge ^3.5.0` — utility class conflict resolution
- `class-variance-authority ^0.7.1` — variant-based component styling
- `clsx ^2.1.1` — conditional class names
- Theme: `next-themes ^0.4.6` (dark mode default, system-aware)
- Font: Inter (Google Fonts via `next/font/google`)

---

## Key Frontend Dependencies

| Package | Version | Purpose |
|---|---|---|
| `next` | 15.4.8 | Frontend framework |
| `react` / `react-dom` | 19.1.0 | UI runtime |
| `drizzle-orm` | ^0.45.1 | DB type definitions (frontend) |
| `pg` | ^8.19.0 | PostgreSQL client (frontend) |
| `lucide-react` | ^0.525.0 | Icon set |
| `sonner` | ^2.0.7 | Toast notifications |
| `next-themes` | ^0.4.6 | Dark/light theme switching |
| `date-fns` | ^4.1.0 | Date formatting utilities |
| `html-to-image` | ^1.11.13 | DOM-to-image capture |
| `html2canvas` | ^1.4.1 | Canvas-based screenshot |
| `@lottielab/lottie-player` | ^1.1.3 | Lottie animations |
| `ogl` | ^1.0.11 | WebGL rendering library |
| `radix-ui` | ^1.4.3 | Headless UI primitives |

---

## Key Backend Dependencies

| Package | Version | Purpose |
|---|---|---|
| `@nestjs/common` | ^10.0.0 | NestJS core |
| `@nestjs/jwt` | ^10.2.0 | JWT token handling |
| `@nestjs/passport` | ^11.0.5 | Auth strategy integration |
| `@nestjs/swagger` | ^7.4.2 | OpenAPI docs at `/docs` |
| `@nestjs/config` | ^3.1.1 | Config service + `.env` loading |
| `@nestjs/serve-static` | ^4.0.2 | Serve `/uploads` directory |
| `drizzle-orm` | ^0.29.3 | ORM for PostgreSQL |
| `pg` | ^8.11.3 | PostgreSQL driver |
| `bcrypt` | ^6.0.0 | Password hashing |
| `passport-jwt` | ^4.0.1 | JWT Passport strategy |
| `helmet` | ^7.1.0 | HTTP security headers |
| `cookie-parser` | ^1.4.7 | Cookie parsing middleware |
| `class-validator` | ^0.14.0 | DTO validation decorators |
| `class-transformer` | ^0.5.1 | DTO transformation |
| `joi` | ^17.11.0 | Config/env validation schema |
| `rxjs` | ^7.8.1 | NestJS reactive dependency |
| `@vercel/blob` | ^2.3.1 | File uploads to Vercel Blob |
| `@vercel/node` | ^5.6.9 | Vercel serverless adapter |

---

## API Layer

**Communication pattern:**
- Frontend calls backend via `fetchApi()` helper in `lib/api.js`
- Base URL: `NEXT_PUBLIC_API_URL` env var, fallback to `http://localhost:8000` (dev) or `https://frl-backend.vercel.app` (prod)
- Auth: `Authorization: Bearer <token>` header extracted from `access_token` cookie
- Response format: backend wraps all responses as `{ statusCode, message, data }` via `TransformInterceptor`; `fetchApi` transparently unwraps `.data`
- 401 handling: client-side redirect to `/login?message=session_expired`

**API Documentation:**
- Swagger UI available at `http://localhost:8000/docs` in development
- Built with `@nestjs/swagger ^7.4.2`

---

## File Storage

- **Vercel Blob** (`@vercel/blob ^2.3.1`) — primary file storage for uploads
  - Upload endpoint: `POST /v1/upload` (`backend/src/upload/upload.controller.ts`)
  - 2MB file size limit enforced server-side
  - Auth: `BLOB_READ_WRITE_TOKEN` env var (required)
- Image remote patterns allowed in Next.js (`next.config.mjs`):
  - `images.unsplash.com`
  - `api.dicebear.com` (avatar generation)
  - `public.blob.vercel-storage.com` (Vercel Blob CDN)

---

## Dev Tooling

**Frontend:**
- ESLint `^9` — config: `eslint.config.mjs` (extends `next/core-web-vitals`)
- No Prettier config detected at root level
- Build: `next build`
- Dev: `next dev --turbopack`

**Backend:**
- TypeScript `^5.1.3`
- ESLint `^8.42.0` + `@typescript-eslint/eslint-plugin ^6.0.0` + `@typescript-eslint/parser ^6.0.0`
- Prettier `^3.0.0` — `eslint-plugin-prettier ^5.0.0`, `eslint-config-prettier ^9.0.0`
  - Format command: `prettier --write "src/**/*.ts" "test/**/*.ts"`
- Build: `nest build` → outputs to `backend/dist/`
- Testing: Jest `^29.5.0` + `ts-jest ^29.1.0` + Supertest `^6.3.3`
  - Unit test pattern: `*.spec.ts` in `backend/src/`
  - E2E config: `backend/test/jest-e2e.json`

---

## Environment Variables

**Backend (required — validated by Joi in `backend/src/config/validation.schema.ts`):**

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `NODE_ENV` | No | `development` | Runtime environment |
| `PORT` | No | `8000` | Backend listen port |
| `DATABASE_URL` | **Yes** | — | PostgreSQL connection string |
| `JWT_SECRET` | **Yes** | — | JWT signing secret |
| `JWT_EXPIRES_IN` | No | `7d` | JWT expiry duration |
| `FRONTEND_URL` | No | `http://localhost:3000` | CORS allowed origin |
| `BLOB_READ_WRITE_TOKEN` | **Yes** | — | Vercel Blob upload token |

**Frontend (used in `lib/api.js`):**

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | Auto-detected by env | Backend API base URL |

---

## Deployment

**Frontend:** Vercel (inferred from `public.blob.vercel-storage.com` image domain and production URL `https://frl-two.vercel.app` in CORS config)

**Backend:** Vercel Serverless Functions
- Config: `backend/vercel.json`
- Entry: `backend/src/main.ts` (exports a serverless `handler` function)
- Runtime adapter: `@vercel/node ^5.6.9`
- Production URL: `https://frl-backend.vercel.app`
- Production domains: `https://www.myfrl.in`, `https://myfrl.in`

**Local development:**
- Frontend: `http://localhost:3000` (`next dev --turbopack`)
- Backend: `http://localhost:8000` (`nest start --watch`)
- Swagger docs: `http://localhost:8000/docs`

---

*Stack analysis: 2026-03-12*
