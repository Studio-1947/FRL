# Codebase Concerns

**Analysis Date:** 2026-03-12

---

## CRITICAL

---

### Hardcoded SuperAdmin Credentials in Source Code

- **Issue:** `backend/src/auth/auth.service.ts` (lines 20–38) seeds a SuperAdmin user on every module initialization with the email `superadmin@gmail.com` and plain-text password `'superadmin'`. Both values are hardcoded in source code, committed to the repository, and automatically applied on every cold start.
- **Files:** `backend/src/auth/auth.service.ts`
- **Impact:** Any attacker who reads the repository (or the leaked `.env.example`) immediately knows the super-admin credentials. In production the account exists unless someone manually rotated the password after first boot.
- **Fix approach:** Move seeding credentials to environment variables (`SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`). Hash the password from env before seeding. Never commit default credentials, even in examples.

---

### JWT Tokens Expire in 100 Years

- **Issue:** Both the access token and refresh token are signed with `expiresIn: '36500d'` (~100 years). This means a stolen token is valid for the lifetime of the application without any forced rotation.
- **Files:** `backend/src/auth/auth.service.ts` (line 115–116)
- **Impact:** Token theft (XSS, server log leaks, network interception) results in permanent account compromise. There is no effective session timeout. The `JWT_EXPIRES_IN` config value (`7d` by default) is used only when signing via the module default — the `generateTokens` method bypasses it entirely.
- **Fix approach:** Set `access_token` to 15–60 minutes and `refresh_token` to 7–30 days. Implement proper token rotation on refresh.

---

### JWT Stored as a Plain JavaScript-Accessible Cookie

- **Issue:** The frontend stores the access token in a non-HttpOnly, non-Secure cookie: `document.cookie = 'access_token=${token}; path=/; max-age=3153600000; SameSite=Lax'`. Any JavaScript running on the page (e.g., from XSS) can read `document.cookie` and steal the token.
- **Files:** `app/context/AuthContext.js` (line 50), `lib/api.js` (lines 15–18)
- **Impact:** A single XSS vulnerability anywhere on the frontend leads to full account takeover. The `SameSite=Lax` flag partially mitigates CSRF but does nothing against XSS token theft. The cookie expiry of 100 years (`max-age=3153600000`) makes stolen tokens permanent.
- **Fix approach:** Set the cookie from the backend with `HttpOnly; Secure; SameSite=Strict`. The backend `logout` endpoint already has a comment acknowledging this but it was never implemented.

---

### Role Escalation via Open User Creation Endpoint

- **Issue:** `POST /v1/users` (`backend/src/users/users.controller.ts`, line 79–84) is completely unauthenticated and accepts arbitrary `email` and `name`. It creates users with an empty password string (`password || ''`), bypassing the registration DTO validation. Additionally, the `RegisterDto` accepts an arbitrary `role` field (line 37 of `register.dto.ts`), meaning a registering user can self-assign `Admin` or `SuperAdmin` roles by simply including `"role": "SuperAdmin"` in the request body.
- **Files:** `backend/src/users/users.controller.ts` (line 79), `backend/src/auth/dto/register.dto.ts` (line 37), `backend/src/auth/auth.service.ts` (line 55)
- **Impact:** Anyone can create accounts with elevated roles or create passwordless accounts. This is a privilege escalation vulnerability.
- **Fix approach:** Remove or guard `POST /v1/users`. Strip the `role` field from `RegisterDto` or restrict it to non-privileged values. Role assignment must only go through the guarded `PATCH /v1/users/:id/role` endpoint.

---

### Password Reset Token Stored in Plaintext in Database

- **Issue:** The password reset token generated in `forgotPassword` is stored directly in the `users.reset_token` column without hashing. If the database is compromised, all active reset tokens are immediately exploitable to take over accounts.
- **Files:** `backend/src/auth/auth.service.ts` (lines 153–156), `backend/src/users/users.service.ts` (line 147), `backend/src/database/schema.ts` (line 28)
- **Impact:** Database read access → full account takeover for any user who has an active reset token.
- **Fix approach:** Hash the reset token with `bcrypt` or `crypto.createHash('sha256')` before storing. Compare the hash at reset time.

---

### Password Reset Link Logged to Console in Production

- **Issue:** The forgot-password flow logs the full reset URL (including the token) to `console.log` in `auth.service.ts` (lines 160–162). There is no email delivery. Console output in production (Vercel serverless) is captured in logs visible to anyone with Vercel dashboard access and potentially third-party log aggregators.
- **Files:** `backend/src/auth/auth.service.ts` (lines 158–163)
- **Impact:** Reset tokens are leaked to log systems. The password reset feature is non-functional for real users who never see the link.
- **Fix approach:** Integrate a transactional email provider (Resend, SendGrid, AWS SES). Remove the `console.log` statements. This is also a missing table-stakes feature.

---

### Notification `markAsRead` Does Not Check Ownership

- **Issue:** `notificationsService.markAsRead(id, userId)` passes `userId` but the Drizzle query only filters by `id` — the `userId` argument is accepted but not used in the WHERE clause. The comment in the code even notes this: `// Ideally check userId too`.
- **Files:** `backend/src/notifications/notifications.service.ts` (line 32–37)
- **Impact:** An authenticated user can mark any other user's notification as read by guessing the notification ID (sequential integer primary key). This is an Insecure Direct Object Reference (IDOR) vulnerability.
- **Fix approach:** Add `.where(and(eq(schema.notifications.id, id), eq(schema.notifications.userId, userId)))` to the update query.

---

## HIGH

---

### No Rate Limiting on Auth Endpoints

- **Issue:** There is no rate limiting on `POST /v1/auth/login`, `POST /v1/auth/register`, `POST /v1/auth/forgot-password`, or `POST /v1/auth/reset-password`. The backend has no `@nestjs/throttler` or equivalent middleware configured in `app.module.ts`.
- **Files:** `backend/src/app.module.ts`, `backend/src/auth/auth.controller.ts`
- **Impact:** Brute-force attacks against login are trivially possible. Forgot-password can be used to enumerate valid email addresses (though the response message is neutral, the response time differs when a user exists). Credential stuffing attacks have no friction.
- **Fix approach:** Install `@nestjs/throttler`, configure a `ThrottlerModule` globally, and apply stricter limits on auth endpoints.

---

### File Upload Has No MIME Type Validation

- **Issue:** The upload controller (`backend/src/upload/upload.controller.ts`) checks `file.size > 2MB` but does not validate `file.mimetype`. The extension is extracted from `file.originalname` which is client-supplied and untrustworthy. A user can upload a file named `malware.php.jpg` or a disguised SVG with embedded script, and it is accepted and stored publicly on Vercel Blob.
- **Files:** `backend/src/upload/upload.controller.ts` (line 40–68), `backend/src/posts/posts.controller.ts` (line 53–88), `backend/src/notes/notes.controller.ts` (line 72–93)
- **Impact:** Stored malicious files. If Vercel Blob URLs are ever embedded in iframes or served with permissive headers, this becomes XSS or content injection.
- **Fix approach:** Whitelist allowed MIME types (`image/jpeg`, `image/png`, `image/webp`, `audio/webm` etc.) and validate `file.mimetype`. Use `file-type` package to verify magic bytes.

---

### `PATCH /v1/users/profile` Accepts Any Field via `body: any`

- **Issue:** The profile update endpoint in `backend/src/users/users.controller.ts` (line 62–65) strips only `password`, `id`, `createdAt`, `updatedAt` from the body and passes the rest directly to `updateProfile`. There is no DTO or whitelist. A user can send `{"role": "Admin"}`, `{"refreshToken": null}`, `{"resetToken": "known_value"}`, or any other column in the `users` table.
- **Files:** `backend/src/users/users.controller.ts` (line 62–65), `backend/src/users/users.service.ts` (line 98–109)
- **Impact:** Users can self-escalate to Admin role, invalidate other sessions, or manipulate auth state. The comment in the code says "Disallow updating password or ID" but omits the more dangerous `role` field.
- **Fix approach:** Replace `body: any` with a strongly-typed `UpdateProfileDto` that explicitly whitelists only user-facing profile fields (name, phone, bio, expertise, etc.). Never pass raw body objects to the ORM.

---

### Admin Panel Has No Backend Authorization on `GET /v1/{resource}` With `limit=100`

- **Issue:** The admin page (`app/admin/page.js`, line 81) fetches resources with `limit=100`. The underlying `GET /v1/events`, `GET /v1/blogs`, etc. are fully public (no `@UseGuards` on GET endpoints in `EventsController`, `BlogsController`, etc.). Admin role enforcement only applies to write operations. Any unauthenticated user can enumerate all content by calling these endpoints with large `limit` values.
- **Files:** `backend/src/blogs/blogs.controller.ts` (line 36–39), `backend/src/events/events.controller.ts` (line 36–39), `app/admin/page.js`
- **Impact:** Content enumeration without authentication. Lower severity for read-only data, but unintended for content that may not be meant for the public yet.
- **Fix approach:** This is probably intentional for the public-facing content, but the `limit` parameter should be capped server-side (e.g., max 50) to prevent bulk scraping.

---

### Frontend Role-Based Access Control Is Client-Side Only

- **Issue:** `withRoleProtection` (`app/components/auth/withRoleProtection.js`) enforces admin access purely on the client. It reads `user.role` from AuthContext, which is fetched from the API — but there is a window before the profile loads where the component renders a spinner. More critically: the role value in the JWT payload is set at login time and is not refreshed if a role changes on the backend.
- **Files:** `app/components/auth/withRoleProtection.js`, `app/context/AuthContext.js`
- **Impact:** A user whose role is downgraded from Admin to Individual still holds a valid JWT with `role: "Admin"` for up to 100 years (per the token expiry issue above), meaning backend endpoints remain accessible to them. Client-side role guards provide no security on their own.
- **Fix approach:** This is acceptable as a UX layer only if backend endpoints are properly guarded (which they are for write operations). The critical fix is the JWT expiry issue above.

---

### Comments Endpoint Allows Unauthenticated Reads With Unbounded Results

- **Issue:** `GET /v1/posts/:postId/comments` has no authentication guard and no pagination. `commentsService.findByPost` fetches all comments for a post in a single query and builds the full tree in memory.
- **Files:** `backend/src/comments/comments.controller.ts` (line 25–28), `backend/src/comments/comments.service.ts` (line 35–70)
- **Impact:** A post with thousands of comments causes a full database read and in-memory tree build on every page load. No protection against denial-of-service via deep comment threads.
- **Fix approach:** Add pagination to `findByPost`. Cap initial fetch depth for nested replies.

---

### No Unique Constraint on `likes` and `follows` Tables

- **Issue:** The `likes` table has no `UNIQUE(user_id, post_id)` constraint, and the `follows` table has no `UNIQUE(follower_id, following_id)` constraint at the database level. The application checks for duplicates in code but race conditions (concurrent requests) can insert duplicate rows.
- **Files:** `backend/src/database/migrations/0001_sloppy_annihilus.sql`, `backend/src/database/schema.ts`
- **Impact:** A user can double-like a post by sending rapid concurrent requests, inflating like counts. Duplicate follow rows can cause incorrect follower counts.
- **Fix approach:** Add database-level unique composite indexes: `UNIQUE(user_id, post_id)` on `likes` and `UNIQUE(follower_id, following_id)` on `follows`.

---

### `sql` Import Is at the Bottom of `follows.service.ts`

- **Issue:** `backend/src/follows/follows.service.ts` imports `sql` from `drizzle-orm` at line 99, after the closing brace of the class. The comment says "Helper for raw sql if needed, but wait, I didn't import sql". This is a bug left in production code.
- **Files:** `backend/src/follows/follows.service.ts` (line 99)
- **Impact:** If the TypeScript compiler resolves this without error due to hoisting, this is a latent readability and maintenance bug. Hoisting does not apply to ES module imports — this may cause runtime issues depending on the bundler.
- **Fix approach:** Move the `sql` import to the top of the file with other imports.

---

## MEDIUM

---

### No Email Verification on Registration

- **Issue:** Users can register with any email address without verifying they own it. There is no email confirmation flow anywhere in the codebase.
- **Files:** `backend/src/auth/auth.service.ts`, `backend/src/auth/dto/register.dto.ts`
- **Impact:** Fake accounts, email squatting, degraded trust in user data. Users can also register with someone else's email address.
- **Fix approach:** Send a verification email on registration. Block login until email is confirmed, or show a verification banner.

---

### No Cascade Deletes on Foreign Keys

- **Issue:** All foreign key constraints across all migrations use `ON DELETE no action ON UPDATE no action`. Deleting a user leaves orphaned rows in `posts`, `comments`, `likes`, `follows`, `notes`, `notifications`, `event_registrations`, `blogs`, `events`, `films`, `notices`, `publications`.
- **Files:** `backend/src/database/migrations/0000_modern_nocturne.sql`, `0001_sloppy_annihilus.sql`, `0002_thankful_blizzard.sql`, `0003_slow_sabretooth.sql`
- **Impact:** No user deletion feature exists yet, but if one is added it will fail or corrupt data. Orphaned rows waste storage and can cause application errors.
- **Fix approach:** Define `ON DELETE CASCADE` for dependent tables (posts, comments, likes, notes, follows, notifications) and `ON DELETE SET NULL` for attribution fields (createdBy on content tables).

---

### Feed Query Has N+1-Like Subquery Per Row

- **Issue:** `postsService.findFeed` embeds a correlated subquery `(SELECT count(*) FROM likes WHERE likes.post_id = posts.id)` and an `EXISTS` subquery inside the main SELECT. These run once per row returned.
- **Files:** `backend/src/posts/posts.service.ts` (lines 48–53)
- **Impact:** For a page of 10 posts, the database executes 20 additional subqueries. At scale this degrades significantly. No caching exists.
- **Fix approach:** Use a `LEFT JOIN` with `GROUP BY` to aggregate likes counts in a single pass, or add a denormalized `likes_count` column updated on insert/delete.

---

### `updatedAt` Is Not Auto-Updated by the Database

- **Issue:** The `updated_at` column uses `defaultNow()` in the schema but has no `ON UPDATE` trigger or DB-level default. Every update operation in every service manually sets `updatedAt: new Date()`. If a developer forgets this (as seen in several service files), the timestamp is silently stale.
- **Files:** `backend/src/database/schema.ts`, all `*.service.ts` files
- **Impact:** Inconsistent `updatedAt` values if a service method omits the field. No database-level guarantee.
- **Fix approach:** Add a PostgreSQL trigger `BEFORE UPDATE SET updated_at = NOW()` or use Drizzle's `$onUpdate` option.

---

### Swagger Docs Exposed in Production With No Authentication

- **Issue:** `SwaggerModule.setup('docs', app, document, ...)` in `backend/src/main.ts` (line 87) exposes interactive API documentation with `persistAuthorization: true` at the `/docs` route. There is no guard on this route. The Vercel routes config (`backend/vercel.json`) sends all traffic to `main.ts`, so `/docs` is reachable in production.
- **Files:** `backend/src/main.ts` (line 87–97), `backend/vercel.json`
- **Impact:** Attackers can explore all endpoints, parameter names, and expected payloads through the UI, lowering the cost of targeted attacks.
- **Fix approach:** Disable Swagger in production: wrap setup in `if (process.env.NODE_ENV !== 'production')`. Alternatively, protect the route with HTTP basic auth or IP allowlist.

---

### `POST /v1/users` Creates Users Without a Password (Silent Bug)

- **Issue:** The unauthenticated `POST /v1/users` endpoint calls `usersService.create({ email, name })`. The `create` method falls back to `password: data.password || ''` — inserting a user with an empty string as their hashed password. These accounts cannot log in via `bcrypt.compare` (empty string will not match any bcrypt hash unless seeded separately).
- **Files:** `backend/src/users/users.controller.ts` (line 79–84), `backend/src/users/users.service.ts` (line 177)
- **Impact:** Silent creation of broken accounts. Could be used to reserve email addresses. Confusing UX if someone tries to register with the same email later.
- **Fix approach:** Remove or guard the `POST /v1/users` endpoint; it duplicates `POST /v1/auth/register` without the security controls.

---

### Comments `remove` Throws a Generic `Error` Instead of `ForbiddenException`

- **Issue:** `commentsService.remove` (line 104) throws `new Error('Not authorized to delete this comment')` instead of `new ForbiddenException(...)`. The global exception filter treats non-`HttpException` errors as 500 Internal Server Error.
- **Files:** `backend/src/comments/comments.service.ts` (line 104)
- **Impact:** A user attempting to delete another user's comment receives a 500 response instead of a 403, leaking that an authorization check failed. Also makes client-side error handling unreliable.
- **Fix approach:** Replace `throw new Error(...)` with `throw new ForbiddenException(...)`.

---

### `drizzle-orm` Version Mismatch Between Frontend and Backend

- **Issue:** The frontend `package.json` specifies `drizzle-orm: ^0.45.1`, while the backend `package.json` specifies `drizzle-orm: ^0.29.3`. These are major-version-incompatible releases with different APIs. `drizzle-kit` is also mismatched: `^0.31.9` (frontend) vs `^0.20.13` (backend).
- **Files:** `package.json`, `backend/package.json`
- **Impact:** Schema definitions or migration commands may behave differently depending on which version is resolved. Using `drizzle-kit` from the frontend against the backend schema is undefined behavior. Could cause silent migration errors.
- **Fix approach:** Align versions across both packages or move all DB tooling to a single location. The frontend should not need `drizzle-orm` if it does not query the database directly.

---

### No Input Length Caps on Text Fields in the Database

- **Issue:** All `text` type columns (bio, professionalProfile, interventions, problem, systemChange, systemImpact, content, etc.) have no maximum length set in the schema. The `ValidationPipe` does not apply `@MaxLength` decorators to these fields in the update profile endpoint (which accepts `body: any`).
- **Files:** `backend/src/database/schema.ts`, `backend/src/users/users.controller.ts`
- **Impact:** A user can submit megabytes of data to a profile field, bloating the database and potentially causing slow queries or excessive memory usage in the ORM.
- **Fix approach:** Add `@MaxLength` validators to all DTOs. Consider database-level `varchar` constraints for bounded fields.

---

### Vercel Blob Upload: No Virus/Malware Scanning

- **Issue:** Files uploaded via `POST /v1/upload` and `POST /v1/posts` are stored directly to Vercel Blob and the URL is persisted to the database without any scanning. This applies to images, PDFs, and audio files.
- **Files:** `backend/src/upload/upload.controller.ts`, `backend/src/posts/posts.controller.ts`, `backend/src/notes/notes.controller.ts`
- **Impact:** Malicious files are stored and served from a public CDN. PDF publications in particular can contain active content (JavaScript in PDFs).
- **Fix approach:** For MVP, enforce strict MIME type whitelisting (partial mitigation). Long-term: integrate a scanning service (ClamAV, VirusTotal API) before confirming the upload URL.

---

## LOW

---

### No Structured Logging (Only `console.log`)

- **Issue:** The entire backend uses `console.log` / `console.error` for all logging. No structured logging library (Winston, Pino) is used. There is no request correlation ID, no log levels, and no machine-parseable format.
- **Files:** `backend/src/main.ts`, `backend/src/auth/auth.service.ts`, `backend/src/notes/notes.controller.ts`, `backend/src/posts/posts.controller.ts`
- **Impact:** Impossible to filter, search, or alert on specific events in production. `console.log('Fetching notes for user:', req.user)` in `notes.controller.ts` logs the full user JWT payload on every notes request — noisy and a potential data leak in log aggregators.
- **Fix approach:** Replace all `console.log` with a NestJS `Logger` instance. Add a request-scoped logging interceptor. Remove the notes user debug log.

---

### No Error Monitoring / Alerting

- **Issue:** No error tracking service (Sentry, Datadog, Rollbar) is integrated. The only signal for production errors is Vercel's function log stream.
- **Files:** `backend/src/main.ts`, `backend/src/common/filters/http-exception.filter.ts`
- **Impact:** Errors in production are discovered reactively (user reports) rather than proactively. No alerting, no stack trace aggregation, no performance monitoring.
- **Fix approach:** Add `@sentry/nestjs` or equivalent. Capture unhandled exceptions in the global filter and the Vercel handler's catch block.

---

### `html2canvas` and `html-to-image` in Production Bundle

- **Issue:** The frontend `package.json` includes `html2canvas: ^1.4.1` and `html-to-image: ^1.11.13`. Both are large libraries used only for the life-balance wheel image generation feature. They are not dynamically imported in `ImageGenerator.jsx`.
- **Files:** `package.json`, `app/life-balance/wheel/ImageGenerator.jsx`, `app/life-balance/wheel/generateBalanceWheelImage.js`
- **Impact:** These libraries add significant bundle weight to the initial JS payload for all pages, increasing load times for users who never use the life-balance feature.
- **Fix approach:** Lazy-load them with `dynamic(() => import(...), { ssr: false })` or convert the import to `import(...)` inside the function that uses them.

---

### Frontend `pg` Dependency Is Unnecessary

- **Issue:** `pg: ^8.19.0` and `@types/pg: ^8.16.0` are listed in the frontend `package.json`. The frontend Next.js app does not connect directly to PostgreSQL.
- **Files:** `package.json`
- **Impact:** Unnecessary dependency that adds to `node_modules` size and could be confused with an actual direct-DB connection pattern during onboarding.
- **Fix approach:** Remove `pg` and `@types/pg` from the frontend dependencies.

---

### Settings Page Role Selector Allows Changing `role` to Admin/SuperAdmin (UI Only)

- **Issue:** `app/settings/page.js` (line 302–313) renders a dropdown for `role` with options `Individual`, `Organization`, `Volunteer`, `Donor`. This is the user-facing display role (not the system permission role), but the field name `role` is the same column that gates admin access. The settings form submits this as `role` in the patch body, and the backend's open profile update endpoint (`PATCH /v1/users/profile`) accepts it.
- **Files:** `app/settings/page.js` (line 302–313), `backend/src/users/users.controller.ts` (line 62–65)
- **Impact:** This is directly related to the "PATCH /v1/users/profile accepts any field" critical issue above — a user editing settings can change their system role. This also means the `role` column is being overloaded for two purposes (user type identity vs system permission level) causing design confusion.
- **Fix approach:** Separate `userType` (Individual/Organization/etc.) from the system `role` (Individual/Admin/SuperAdmin) into distinct database columns, or at minimum whitelist the `role` field in the profile update DTO to only allow the non-privileged values.

---

### No `updatedAt` Trigger for `notifications` Table

- **Issue:** The `notifications` table in `schema.ts` (line 172–182) has no `updatedAt` column at all, and the `markAsRead` operation has no timestamp tracking for when a notification was read.
- **Files:** `backend/src/database/schema.ts` (line 172–182)
- **Impact:** No audit trail for notification state changes. Minor operational concern.
- **Fix approach:** Add `readAt: timestamp('read_at')` column, set on `markAsRead`.

---

### Test Coverage Is Effectively Zero

- **Issue:** The two spec files that exist (`auth.service.spec.ts`, `users.service.spec.ts`) each contain exactly one test: `it('should be defined', ...)`. No business logic, security flows, or edge cases are tested. No frontend tests exist at all.
- **Files:** `backend/src/auth/auth.service.spec.ts`, `backend/src/users/users.service.spec.ts`, `backend/src/users/users.controller.spec.ts`
- **Impact:** No automated regression detection. The critical security issues documented above would not be caught by tests before reaching production.
- **Fix approach:** Write unit tests for `AuthService` (login, register, forgotPassword, resetPassword, changePassword) and integration tests for the guarded endpoints. Prioritize security-sensitive paths.

---

### `@nestjs/mapped-types` Listed as `"*"` (Any Version)

- **Issue:** `backend/package.json` lists `"@nestjs/mapped-types": "*"` with a wildcard version. This pins to no specific version and will resolve to whatever the latest is at install time.
- **Files:** `backend/package.json` (line 29)
- **Impact:** Non-deterministic builds. A breaking change in `@nestjs/mapped-types` could silently break DTOs.
- **Fix approach:** Pin to a specific version: `"@nestjs/mapped-types": "^2.0.0"` (or current stable).

---

### Middleware Does Not Protect `admin/` and `super-admin/` Routes

- **Issue:** `middleware.js` protects `/profile/:path*`, `/settings/:path*`, `/people/:path*`, `/dashboard/:path*`. It does not list `/admin` or `/super-admin` in the matcher. These pages rely entirely on the client-side `withRoleProtection` HOC for access control.
- **Files:** `middleware.js` (line 32–42), `app/admin/page.js`, `app/super-admin/page.js`
- **Impact:** The Next.js middleware (which runs at the edge before the page renders) will serve the admin page JS bundle to unauthenticated users. The `withRoleProtection` HOC then redirects, but the bundle is already delivered. Lower-priority since the API is independently guarded, but the page should also redirect at the middleware level.
- **Fix approach:** Add `/admin/:path*` and `/super-admin/:path*` to the middleware matcher.

---

*Concerns audit: 2026-03-12*
