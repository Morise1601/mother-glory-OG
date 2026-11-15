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

test('welcome popup loads initial defaults and updates atomically with version increments', async () => {
  const store = persistence();
  const mocks = { '@/lib/data/content-store': store };
  const popupModule = loadTs('lib/data/popup.ts', mocks);

  const initial = await popupModule.getWelcomePopup();
  assert.equal(initial.isEnabled, true);
  assert.equal(initial.version, 1);

  const updated = await popupModule.updateWelcomePopup({
    title: 'Special Scholarship Test 2026',
    aspectRatio: '4:5',
    version: 1,
  });

  assert.equal(updated.title, 'Special Scholarship Test 2026');
  assert.equal(updated.aspectRatio, '4:5');
  assert.equal(updated.version, 2);

  // Stale version update must fail
  await assert.rejects(
    popupModule.updateWelcomePopup({ title: 'Stale update', version: 1 }),
    /Conflict/
  );
});

test('welcome popup API enforces promotions.view and promotions.publish permissions', async () => {
  const store = persistence();
  let granted = new Set(['promotions.view']);
  const actor = { id: '00000000-0000-0000-0000-000000000001', name: 'Admin', role: 'admin' };

  const routes = loadTs('app/api/admin/popup/route.ts', {
    '@/lib/data/content-store': store,
    '@/lib/auth/server': {
      requirePermission: async (permission) => {
        if (!granted.has(permission)) throw Object.assign(new Error('Forbidden'), { status: 403 });
        return actor;
      },
    },
    '@/lib/data/content-api': {
      contentErrorResponse: (error) => Response.json({ error: error.message }, { status: error.status || 400 }),
      contentJson: (value) => Response.json(value),
      contentMutationResult: (value) => Response.json(value),
    },
  });

  // GET succeeds with promotions.view
  const getRes = await routes.GET();
  assert.equal(getRes.status, 200);

  // POST fails without promotions.publish
  const postReq = (body) => new Request('https://example.org/api/admin/popup', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const failRes = await routes.POST(postReq({
    popup: {
      isEnabled: true,
      title: 'New Poster',
      posterImageUrl: '/images/hero_banner_mg.webp',
      aspectRatio: '16:9',
      version: 1,
    },
  }));
  assert.equal(failRes.status, 403);

  // POST succeeds when granted promotions.publish
  granted.add('promotions.publish');
  const successRes = await routes.POST(postReq({
    popup: {
      isEnabled: true,
      title: 'New Poster',
      posterImageUrl: '/images/hero_banner_mg.webp',
      aspectRatio: '16:9',
      showEnquiryButton: true,
      frequency: 'once_per_session',
      version: 1,
    },
  }));
  assert.equal(successRes.status, 200);
});
