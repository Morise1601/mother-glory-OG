# Mother Glory web application

Next.js 16 / React 19 website and administrative portal backed by Supabase's existing database and role-permission system.

The CMS manages banners, achievements, founders, programs, institution settings, media, staff and admissions enquiries. Saved content is durable; public pages show published data. Administration uses verified sessions and server-side permission checks.

```powershell
npm.cmd install
# Configure .env.local using .env.example, then follow the deployment guide.
npm.cmd run dev
```

Verification:

```powershell
npm.cmd test
npx.cmd next typegen
npx.cmd tsc --noEmit
npm.cmd run lint
npm.cmd run build
npm.cmd audit
```

Tests exercise production modules, PostgreSQL security migrations, genuine WebP conversion and VP9/Opus WebM conversion. Set `FFMPEG_PATH` to a maintained stable FFmpeg9.0.2+ executable to run the real video integration test; that test explicitly skips without one. Video uploads reject outdated binaries. Dependencies and native binaries must match the deployment OS.

- [Deployment and first-owner setup](docs/deployment.md)
- [Application audit and verification](docs/application-audit.md)
- [Content inventory](docs/content-inventory.md)

Apply the **20261114 additive migrations** described in the deployment guide. The historical `20261028_mother_glory_schema.sql` is incompatible with the existing project and must not be used for deployment.
