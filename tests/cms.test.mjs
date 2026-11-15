import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTs } from './module-loader.mjs';

function persistence() {
  const rows = new Map();
  const copy = value => structuredClone(value);
  return {
    rows,
    readContent: async (key, fallback) => copy(rows.has(key) ? rows.get(key) : fallback),
    writeContent: async (key, value) => { rows.set(key, copy(value)); },
    updateContent: async (key, fallback, mutate) => {
      const value = await mutate(copy(rows.has(key) ? rows.get(key) : fallback));
      rows.set(key, copy(value));
      return copy(value);
    },
  };
}

test('banner saves are visible in an independently loaded public module and survive reloads', async () => {
  const store = persistence();
  const mocks = { '@/lib/data/content-store': store };
  const admin = loadTs('lib/data/banners.ts', mocks);
  assert.equal((await admin.getAllBannersAdmin()).length, 0);
  const created = await admin.createBanner({ title: 'Admissions banner', desktopImageUrl: '/images/hero_banner_mg.webp' });
  assert.equal((await loadTs('lib/data/banners.ts', mocks).getActiveBanners())[0].id, created.id);
  await admin.deleteBanner(created.id);
  assert.deepEqual(await loadTs('lib/data/banners.ts', mocks).getActiveBanners(), []);
});

test('banners respect visibility and scheduling and reject stale bulk edits and duplicate IDs', async () => {
  const store = persistence();
  const banners = loadTs('lib/data/banners.ts', { '@/lib/data/content-store': store });
  const first = await banners.createBanner({ title: 'First banner', desktopImageUrl: '/images/hero_banner_mg.webp' });
  const second = await banners.createBanner({ title: 'Scheduled banner', desktopImageUrl: '/images/hero_banner_mg.webp' });
  await banners.updateBanner(second.id, { status: 'hidden', version: second.version });
  assert.equal((await banners.getActiveBanners()).length, 1);
  const snapshot = await banners.getAllBannersAdmin();
  await banners.updateBanner(first.id, { title: 'New version', version: first.version });
  await assert.rejects(banners.saveAllBanners(snapshot), /Conflict/);
  await assert.rejects(banners.saveAllBanners([snapshot[0], snapshot[0]]), /Duplicate/);
  const current = await banners.getAllBannersAdmin();
  await banners.updateBanner(first.id, { version: current.find(b => b.id === first.id).version, startsAt: '2099-01-01T00:00:00Z' });
  assert.deepEqual(await banners.getActiveBanners(), []);
});

test('published achievements share durable edits while drafts remain private', async () => {
  const store = persistence();
  const mocks = { '@/lib/data/content-store': store };
  const admin = loadTs('lib/data/achievements.ts', mocks);
  assert.deepEqual(await admin.getAchievements(), []);
  const achievement = await admin.createAchievement({ slug: 'student-result', title: 'Student Result', year: 2026, category: 'Academic', campus: 'Both', summary: 'A verified result from our student cohort.', imageUrl: '/images/achievements/1.webp', altText: 'Student result poster', featured: false, verificationStatus: 'verified', consentStatus: 'obtained', status: 'draft', sortOrder: 1 });
  assert.deepEqual(await loadTs('lib/data/achievements.ts', mocks).getAchievements(), []);
  await admin.updateAchievement(achievement.id, { status: 'published', version: achievement.version });
  assert.equal((await loadTs('lib/data/achievements.ts', mocks).getAchievements())[0].slug, 'student-result');
});

test('banner API creates a validated draft and never lets edit permission publish it', async () => {
  const store = persistence();
  const granted = new Set(['promotions.create', 'promotions.edit', 'promotions.view']);
  const actor = { id: '00000000-0000-0000-0000-000000000001', name: 'Administrator', role: 'admin' };
  const routes = loadTs('app/api/admin/banners/route.ts', {
    '@/lib/data/content-store': store,
    '@/lib/auth/server': { requirePermission: async permission => { if (!granted.has(permission)) throw Object.assign(new Error('Forbidden'), { status: 403 }); return actor; } },
    '@/lib/data/content-api': {
      contentErrorResponse: error => Response.json({ error: error.message }, { status: error.status || 400 }),
      contentJson: value => Response.json(value),
      contentMutationResult: value => Response.json(value),
    },
  });
  const request = body => new Request('https://example.org/api/admin/banners', { method: 'POST', body: JSON.stringify(body) });
  const create = await routes.POST(request({ action: 'create', banner: {} }));
  assert.equal(create.status, 200);
  const { banner } = await create.json();
  assert.equal(banner.status, 'hidden');
  assert.equal((await routes.POST(request({ action: 'save_all', banners: [{ ...banner, status: 'visible' }] }))).status, 403);
  assert.equal((await routes.GET()).status, 200);
  assert.equal(store.rows.get('banners')[0].status, 'hidden');
});

test('program slugs remain unique so every saved public program is reachable', async () => {
  const store = persistence();
  const programs = loadTs('lib/data/programs.ts', { '@/lib/data/content-store': store });
  const originals = await programs.getAllProgramsAdmin();
  const first = await programs.updateProgram(originals[0].id, { slug: 'unique-program', status: 'published', version: originals[0].version });
  await assert.rejects(programs.updateProgram(originals[1].id, { slug: 'unique-program', status: 'published', version: originals[1].version }), /slug.*already|already.*slug/i);
  assert.equal((await programs.getProgramBySlug(first.slug)).id, first.id);
});

test('malformed or null CMS requests return validation errors instead of server errors', async () => {
  const routes = loadTs('app/api/admin/banners/route.ts', {
    '@/lib/auth/server': { requirePermission: async () => ({ id: 'admin' }) },
    '@/lib/data/content-api': {
      contentErrorResponse: error => Response.json({ error: error.message }, { status: error.status || (error instanceof SyntaxError ? 400 : 500) }),
      contentMutationResult: () => { throw new Error('invalid requests must not mutate'); },
    },
  });
  const response = await routes.POST(new Request('https://school.example/api/admin/banners', { method: 'POST', body: 'null' }));
  assert.equal(response.status, 400);
});
