# Application Reliability Implementation Plan

> **For agentic workers:** Use systematic debugging, test-driven development and verification-before-completion. Track each independent domain below.

**Goal:** Make saved CMS data appear publicly, enforce real staff access, validate enquiries, and verify Google reviews and media conversion.

**Architecture:** Preserve the existing Supabase schema and RBAC. Store private CMS documents in existing `app_settings` with compare-and-swap updates; expose only published projections. All admin endpoints verify the authenticated profile and permissions on the server. Preserve the user's extensive uncommitted work in the current checkout. Media library removal archives objects to protect concurrent content references. Native video decoding requires a maintained FFmpeg stable9.0.2+ executable.

**Tech Stack:** Next.js16.4.6, React19, Supabase SSR/Postgres/Storage, Zod4.6.7, Sharp0.35.5, maintained server FFmpeg.

**Spec:** User's current request; `AGENTS.md`; live read-only schema evidence in `docs/application-audit.md` (to be completed).

## Global Constraints

- Read installed Next.js documentation before Next-specific changes.
- Do not expose credentials, send test invitations, or mutate live user content during verification.
- Use the actual legacy tables and permission keys; the old migration is incompatible with them.
- Report Google service authorization and missing FFmpeg as deployment dependencies until verified.

## Review Focus

- Empty CMS collections stay empty; no fallback sample records reappear.
- Anonymous, inactive, and insufficiently privileged users cannot read or mutate private data.
- Concurrent staff or CMS updates cannot silently bypass last-admin/version protection.
- Failed saves/uploads/submissions never display success.
- Invalid files, unsafe URLs, bad schedules and malformed requests fail validation.

### Task 1: CMS persistence and public rendering

**Files:** `lib/data/content-store.ts`, content data modules, `app/api/admin/banners/route.ts`, new content API routes, CMS admin forms, public header/footer/metadata.

- [x] Add failing production-module tests for persistent banners, explicit empty lists, publish/schedule filters, and write conflicts.
- [x] Implement private `app_settings` document persistence using compare-and-swap, validated authenticated mutations and public cache invalidation.
- [x] Wire founders, programs, achievements and settings save flows to real APIs; remove fake success handlers and public sample data.
- [x] Verify tests and TypeScript.

### Task 2: Authentication and staff permissions

**Files:** `lib/auth/server.ts`, `proxy.ts`, staff data/API/UI, login/recovery pages, additive staff RPC migration.

- [x] Add failing tests for anonymous/inactive denial and permission checks.
- [x] Remove demo login bypasses; validate sessions and real roles/permissions, refreshing SSR cookies.
- [x] Wire real role IDs and staff lifecycle; enforce atomic last-super-admin protection in database RPC.
- [x] Verify tests; document unapplied database prerequisites.

### Task 3: Enquiries, audit trail and validation

**Files:** `lib/data/enquiries.ts`, `lib/data/audit.ts`, enquiry/audit/dashboard API routes and admin pages, enquiry forms, `lib/validation/schemas.ts`.

- [x] Add failing tests exercising actual validation, durable submission, denied reads, assigned staff scope and invalid updates.
- [x] Replace memory fixtures with private durable records and atomic document updates; use persistent rate limits/idempotency and real audit inserts.
- [x] Use one validated submission API, honest success/error UI, consent and length limits.
- [x] Verify tests and TypeScript.

### Task 4: Google reviews and media

**Files:** Google reviews server/public/admin components and API; media server conversion/storage helpers, API and admin UI; `.env.example`.

- [x] Add failing tests for saved Place IDs, API failure handling and real WebP conversion/rejection.
- [x] Persist Place IDs; provide an uncached authenticated connection test; preserve campus access after one campus fails.
- [x] Enforce upload permissions, file signatures/size limits, durable Supabase Storage and metadata, reference-safe deletion.
- [x] Implement WebM conversion through configured FFmpeg; provide explicit dependency error if absent.
- [x] Verify tests; document actual upstream 403 and executable availability.

### Task 5: Integration verification

- [x] Run real regression suite, TypeScript, lint and production build; resolve material failures.
- [x] Independently review authorization, data projection and error paths.
- [x] Smoke-test public pages and anonymous API denial; report deployment prerequisites and remaining limits accurately.
