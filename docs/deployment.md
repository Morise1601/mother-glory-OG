# Deployment and account setup

This application uses the existing Supabase `staff_profiles`, `staff_roles`, `roles`, `permissions`, `app_settings`, `media_assets` and `audit_logs` tables. It does not use the incompatible replacement schema proposed in October.

## 1. Environment

Copy `.env.example` to `.env.local` and configure:

```dotenv
NEXT_PUBLIC_SITE_URL=https://YOUR-WEBSITE
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR-PUBLIC-KEY
SUPABASE_SECRET_KEY=YOUR-SERVER-ONLY-KEY
GOOGLE_PLACES_API_KEY=YOUR-SERVER-ONLY-PLACES-KEY
GOOGLE_PLACE_ID_PUDUCHERRY=YOUR-PLACE-ID
GOOGLE_PLACE_ID_KARAIKAL=YOUR-PLACE-ID
```

The older `NEXT_PUBLIC_GOOGLE_PLACE_ID_*` names are also accepted as initial defaults. Once saved in the reviews editor, the saved Place IDs take precedence. API secrets are never entered in public client fields. Keep `.env.local` outside version control.

Set `FFMPEG_PATH` to a maintained **FFmpeg stable release 9.0.2 or newer**, with libvpx-vp9 and libopus. The application probes and caches the executable version before decoding video; the old 6.1.1 executable bundled by `ffmpeg-static` is rejected with503. `npm audit` does not inspect native FFmpeg security fixes. Consult the [official releases](https://ffmpeg.org/download.html) and [security updates](https://ffmpeg.org/security.html) when maintaining the decoder.

On Windows, `scripts/setup-ffmpeg.ps1` downloads the current release from the vendor linked by FFmpeg's official site, verifies the published SHA-256 checksum and extracts it into the ignored `.runtime/ffmpeg` folder. Put the printed executable path in `.env.local` as `FFMPEG_PATH`, and restart the server. For Linux/macOS, install a maintained host-appropriate binary through your deployment image/package source and set the same variable. Do not copy Windows `node_modules` or executables to Linux.

The hosting runtime must permit native child processes and temporary files. Video processing has a 180-second timeout, a maximum of two concurrent conversions per process, 100 MB upload/output limits, and a 1920×1080 output bound. Hosting providers may impose smaller body/time limits; choose a runtime that supports the required upload size.

## 2. Apply the additive migrations

In the connected Supabase project's SQL Editor, review and execute these files in order:

1. [`20261114_staff_security.sql`](../supabase/migrations/20261114_staff_security.sql): authenticated staff/role mutation RPCs, final-super-admin and identity protection, private CMS storage and read-only audit policies.
2. [`20261114_media_storage.sql`](../supabase/migrations/20261114_media_storage.sql): converted public media and private-original buckets.
3. [`20261114_enquiry_permissions.sql`](../supabase/migrations/20261114_enquiry_permissions.sql): admissions permissions; existing system staff receive assigned-record view/update only.

These migrations were exercised against an embedded PostgreSQL fixture matching the existing schema. They have **not been applied to the live project** during this code audit. Do not deploy the staff mutation flow without the staff migration: the API deliberately returns 503 rather than using an unsafe fallback.

**Do not run `20261028_mother_glory_schema.sql` against the existing project.** Its `staff_profiles` and other table definitions conflict with the actual legacy schema.

The reserved `app_settings` keys `public_cms.*` are private and server-managed. Restrictive policies prevent browser clients from reading drafts or enquiries directly, even if older permissive policies exist. Public pages receive published projections from the server.

## 3. First super administrator

If an active super administrator already exists, use that account. Otherwise create the designated owner's identity in Supabase Authentication first, using a strong password and a verified email. Then run this one-time bootstrap in SQL Editor, replacing the three placeholders:

```sql
BEGIN;

INSERT INTO public.roles (name, slug, is_system, is_active)
VALUES ('Super Administrator', 'super-admin', true, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.staff_profiles (id, employee_id, full_name, email, status)
SELECT id, 'OWNER-EMPLOYEE-ID', 'OWNER NAME', email, 'active'
FROM auth.users
WHERE lower(email) = lower('OWNER-EMAIL')
ON CONFLICT (id) DO UPDATE
SET full_name = EXCLUDED.full_name, email = EXCLUDED.email,
    status = 'active', updated_at = now();

INSERT INTO public.staff_roles (staff_id, role_id, is_primary)
SELECT u.id, r.id, true
FROM auth.users u
JOIN public.roles r ON r.slug = 'super-admin' AND r.is_active
WHERE lower(u.email) = lower('OWNER-EMAIL')
ON CONFLICT (staff_id, role_id) DO NOTHING;

COMMIT;
```

Verify that the owner identity was found and a role assignment exists before signing in at `/admin`. Profile `id` must equal the Supabase Auth user UUID. Never infer identity or access from matching email strings alone.

## 4. Invitations and recovery

Set Supabase Auth's Site URL to the deployed HTTPS origin and allow these redirect URLs:

- `https://YOUR-WEBSITE/admin/reset-password`
- `https://YOUR-WEBSITE/auth/callback`

Configure SMTP/email delivery. Staff creation persists the real profile and role before sending the setup email. A failed email reports the created account honestly and offers **Send setup link** for retry. No real invitation emails were sent during automated verification.

Default Supabase invite/recovery links are supported: the reset page strips the token fragment before constructing the PKCE client, exchanges complete invite/recovery tokens using `setSession`, and verifies the user with Auth before permitting password setup. PKCE recovery and the server OTP callback are also supported.

For custom email templates, a token-hash callback can use:

```html
<!-- Invite template -->
<a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=invite">Set up your account</a>
<!-- Recovery template -->
<a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=recovery">Reset your password</a>
```

## 5. Google reviews

Actual checks during this audit returned **HTTP 403 / PERMISSION_DENIED / ACCESS_DENIED** for both campus Place IDs. Adding a key alone does not resolve this service authorization failure.

In Google Cloud, verify that billing and **Places API (New)** are enabled for the key's project, that the key permits that API, and that application restrictions permit requests from the server. HTTP-referrer restrictions are intended for browser requests; use restrictions appropriate for the server's egress configuration. See [Google's API security guidance](https://developers.google.com/maps/api-security-best-practices).

After correction, open `/admin/reviews`, save the correct Place IDs, and run **Test connection** separately for both campuses. The test uses the edited ID immediately and bypasses the normal one-hour reviews cache. Do not expose the key in client code.

## 6. Content and media

- Saved CMS data persists in the existing database. Empty banner/achievement collections remain empty; sample slides are not restored.
- The previous single banner was never found in durable storage. Add it again using the repaired banner editor, save it, and set it visible. Founders and programs start as editable draft templates until explicitly published.
- Settings, contact data, announcements and metadata are read from saved settings. Concurrent stale saves return 409; reload before retrying.
- Images are decoded and converted to WebP. Supported video containers are transcoded to VP9/Opus WebM; unsupported/corrupt inputs are rejected.
- **Remove from Library archives an asset; it does not permanently erase its stored bytes.** Existing references block removal. Retaining the object also protects content saved concurrently with removal. Permanent storage cleanup requires a coordinated maintenance procedure and is not exposed by this portal.

## 7. Verify and deploy

```powershell
npm.cmd ci
$env:FFMPEG_PATH = 'YOUR-MAINTAINED-FFMPEG-EXECUTABLE'
npm.cmd test
npx.cmd next typegen
npx.cmd tsc --noEmit
npm.cmd run lint
npm.cmd run build
npm.cmd audit
npm.cmd start
```

The real video integration test explicitly skips if no maintained binary is configured; with `FFMPEG_PATH` set, it executes conversion and fails for an invalid executable. Verify real-owner sign-in, an invitation through your configured email provider, role restrictions, a visible saved banner on a fresh public request, image/video uploads to the provisioned buckets, and Google review tests. Automated tests use isolated fixtures and never alter live staff, content or media.
