# Application audit — 14 November 2026

## Result

The reported CMS defects and the concrete security/validation findings were corrected in the local working tree. Production build, TypeScript, 72 regression tests and 29 production HTTP smoke checks pass. `npm audit` reports zero known npm dependency vulnerabilities. ESLint exits successfully with zero errors and 38 remaining non-blocking warnings.

Live deployment still requires the additive SQL migrations and Google Cloud authorization correction described in [deployment.md](deployment.md). No live staff, CMS records, enquiries or media were created, modified or deleted during verification.

## Findings and corrections

| Area | Evidence / cause | Implemented behavior |
| --- | --- | --- |
| Four default banners | Admin and public code used process-local arrays; no saved banner was found in live storage | Private durable CMS documents; public reads use the saved collection; explicit empty collections never restore samples |
| Founders, programs, settings, achievements | Several Save buttons only changed React state or displayed a timer | Validated authenticated APIs, real persistence, revision checks, publish controls and public cache invalidation |
| Public text/contact/metadata | Separate hardcoded public values ignored saved settings | Saved identity, announcement, contact details and SEO settings flow to public components and metadata |
| Reviews | Admin Place IDs were not saved; test ignored edited ID; failed first campus prevented switching; remote avatar rendering could fail | Persistent IDs, uncached edited-ID tests, stable campus controls, safe review mapping and avatar rendering |
| Google upstream | Both actual requests returned HTTP403 PERMISSION_DENIED / ACCESS_DENIED | Clear sanitized diagnostics; owner must correct project/API/billing/key restrictions |
| Authentication | Known demo emails bypassed password failures; admin pages lacked a real guard | Verified Auth user, active actual profile and assigned active roles; no demo fallback; session-refreshing proxy |
| Staff and permissions | Staff data/invitations were memory fixtures; mutations trusted a hardcoded admin | Real identities, UUID role assignment, custom role/grant editing, permission RPC checks and database mutation functions |
| Last administrator / identity | Memory-only checks could be bypassed by direct or concurrent writes | Database advisory lock and triggers prevent final-super-admin removal and identity reassignment; tested with direct multirow operations |
| Combined roles | Coarse inferred role could hide assigned enquiries or deny legitimate settings managers | Explicit admissions permissions with independent read/update scopes; settings.manage authorizes settings changes |
| Invitations | PKCE browser configuration rejected default implicit invitation fragments | Tokens removed before browser-client initialization, explicit session exchange, verified user, single consumption under Strict Mode; malformed fragments rejected |
| Enquiry privacy and persistence | Anonymous GET promoted everyone to admin; enquiry data and status/notes were process-local | Authenticated assigned/all-record scopes, durable records, validated status/notes/assignment, consent, persistent rate limits and idempotency |
| Audit | Fixture logs and incompatible insert fields | Actual legacy audit inserts, recursive credential redaction, restrictive client-write policies; saved mutations report audit warnings honestly |
| Stored script injection | JSON-LD replacement escaped to a literal `<` | Literal Unicode escaping prevents settings text from terminating the script; actual HTML rendering regression covers the payload |
| Program links | Duplicate slugs made a saved program unreachable | Case-insensitive uniqueness checked atomically with the update |
| Media conversion | Images wrote to local filesystem with memory metadata; video conversion absent; npm's native FFmpeg binary was outdated | Sharp WebP and maintained FFmpeg VP9/Opus WebM, minimum stable9.0.2 runtime check, bounded files/processes/time, durable Supabase objects and metadata |
| Media references | Query/hash/encoded/signed aliases bypassed exact URL comparisons; deletion could race with content saves | Canonical reference matching; referenced media blocked; library removal archives metadata and retains the object so late references cannot break |
| Error handling | Failed requests could show success or stale writes overwrite changes | Honest success/error/warning UI, stale revisions409, malformed JSON400, authenticated download attachments |
| Dependencies | Original dependency audit reported critical/high advisories | Next16.4.6, matching lint tooling, Sharp0.35.5 and Zod4.6.7; compatible transitive patches and scoped minimatch tooling override; final audit0 |

## Verification performed

- `npm.cmd test` with maintained `FFMPEG_PATH`: **72 passed, 0 failed, 0 skipped**. Tests import production TypeScript modules and replace external boundaries only. Embedded PostgreSQL executes the additive staff/admissions migrations twice and exercises authorization, restrictive RLS, role grants, immutable identities and final-admin protection.
- Actual PNG/JPEG inputs produce WebP bytes with expected dimensions.
- An actual MP4 with AAC audio is converted to WebM using checksum-verified FFmpeg9.0.2, then decoded and verified as VP9 video plus Opus audio. The local binary is installed under ignored `.runtime/ffmpeg`, with `FFMPEG_PATH` configured privately in `.env.local`.
- Content tests cover independent module reloads, explicit empty lists, scheduled/published filtering, atomic concurrent update/insert conflicts and failed database writes.
- Regression tests cover stored script injection, duplicate slugs, malformed JSON, missing/stale review revisions, invitation ordering/rollback/email failures, default invitation token handling and media reference/archive races.
- `npm.cmd run build`: **passes**, including framework TypeScript checks.
- `npx.cmd tsc --noEmit`: **passes**.
- `npm.cmd run lint`: **passes** with **0 errors / 38 warnings**.
- `npm.cmd audit`: **0 vulnerabilities**.
- `node scripts/smoke-test.mjs` against the production server: **29/29 passed**. Public pages/metadata return200; private admin pages redirect to sign-in; anonymous private APIs return401; invalid public enquiry submissions return400 without database writes.
- Read-only live discovery confirmed the existing legacy schema, empty durable CMS storage and no configured storage buckets. The application does not depend on the incompatible October replacement migration.

## Deployment boundaries

1. Apply the three **20261114** additive migrations in [deployment.md](deployment.md). They were tested locally, not applied remotely. Staff mutations deliberately fail closed if their RPC is missing.
2. Provision storage using the media migration. No live upload was attempted because buckets are absent.
3. Correct Google Places service authorization, then test both campuses through `/admin/reviews`. The observed403 cannot be resolved solely by frontend changes.
4. Save the desired single banner again. Its earlier memory-only value was not recoverable from the connected database.
5. Verify the real owner's sign-in, an invitation through the configured SMTP provider, and live uploads after deployment. Automated tests send no actual emails and use no real staff credentials.
6. Provision the maintained native FFmpeg executable on the production host and set its `FFMPEG_PATH`; the Windows local path is not portable. Old or unverifiable binaries fail closed with503 before video decoding.

Visual browser QA was unavailable: the browser access host was absent and native Chrome access was not approved. HTTP production checks and component HTML-rendering tests were completed; no visual approval is claimed.

Library removal intentionally retains stored files and archived metadata. Permanent purge needs a coordinated maintenance process; this portal does not claim permanent erasure. The regression suite is evidence for the tested flows, not an exhaustive penetration test or a guarantee about unapplied production configuration.
