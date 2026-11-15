import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTs } from './module-loader.mjs';

function database(initial) {
  let row = initial ? structuredClone(initial) : null;
  let unavailable = false;
  const client = { from: table => {
    assert.equal(table, 'app_settings');
    return {
      select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: structuredClone(row), error: unavailable ? { code: 'DB_DOWN', message: 'private failure details' } : null }) }) }),
      insert: async record => {
        if (unavailable) return { error: { code: 'DB_DOWN' } };
        if (row) return { error: { code: '23505' } };
        row = structuredClone(record); return { error: null };
      },
      update: record => {
        const filters = {};
        const query = {
          eq: (key, value) => { filters[key] = value; return query; },
          select: async () => {
            if (unavailable) return { error: { code: 'DB_DOWN' } };
            if (!row || filters.updated_at !== row.updated_at || filters.setting_key !== row.setting_key) return { data: [], error: null };
            row = structuredClone(record); return { data: [{ setting_key: row.setting_key }], error: null };
          },
        };
        return query;
      },
    };
  } };
  return { client, current: () => row, fail: () => { unavailable = true; } };
}

test('content store preserves explicit empty documents privately across new repository instances', async () => {
  const db = database();
  const mocks = { '@/lib/supabase/admin': { getAdminClient: () => db.client } };
  await loadTs('lib/data/content-store.ts', mocks).writeContent('banners', []);
  assert.deepEqual(await loadTs('lib/data/content-store.ts', mocks).readContent('banners', ['default']), []);
  assert.equal(db.current().is_public, false);
  assert.equal(db.current().setting_key, 'public_cms.banners');
});

test('atomic document updates reject one of two concurrent writers rather than losing an edit', async () => {
  const db = database({ setting_key: 'public_cms.banners', setting_value: [], updated_at: new Date(Date.now() + 5000).toISOString(), is_public: false });
  const store = loadTs('lib/data/content-store.ts', { '@/lib/supabase/admin': { getAdminClient: () => db.client } });
  const results = await Promise.allSettled([
    store.updateContent('banners', [], current => [...current, 'first']),
    store.updateContent('banners', [], current => [...current, 'second']),
  ]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal(results.find(result => result.status === 'rejected').reason.status, 409);
  assert.equal(db.current().setting_value.length, 1);
});

test('concurrent first inserts conflict and database failures never report success or expose details', async () => {
  const db = database();
  const store = loadTs('lib/data/content-store.ts', { '@/lib/supabase/admin': { getAdminClient: () => db.client } });
  const results = await Promise.allSettled([store.writeContent('banners', ['first']), store.writeContent('banners', ['second'])]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal(results.find(result => result.status === 'rejected').reason.status, 409);
  db.fail();
  await assert.rejects(store.writeContent('banners', ['unsaved']), error => error.status === 503 && !error.message.includes('private'));
  assert.equal(db.current().setting_value.length, 1);
});
