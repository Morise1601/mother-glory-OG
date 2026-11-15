// Read-only diagnostics. Intentionally reports no row values or credentials.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } });
(async () => {
  const buckets = await db.storage.listBuckets();
  console.log(JSON.stringify({ buckets: buckets.data?.map(({ name, public: isPublic, file_size_limit, allowed_mime_types }) => ({ name, isPublic, file_size_limit, allowed_mime_types })), storageError: buckets.error?.message }));
  for (const table of ['promotions', 'active_promotions', 'app_settings', 'enquiries', 'banners', 'founders', 'programs', 'achievements', 'media_assets']) {
    const { data, error, count } = await db.from(table).select('*', { count: 'exact' }).limit(1);
    console.log(JSON.stringify({ table, count, columns: data?.[0] ? Object.keys(data[0]) : [], error: error ? { code: error.code, message: error.message } : null }));
  }
})().catch(() => { console.error('Connection failed'); process.exitCode = 1; });
