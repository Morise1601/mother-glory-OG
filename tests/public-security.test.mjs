import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadTs } from './module-loader.mjs';

test('saved site text cannot terminate the JSON-LD script and execute HTML', async () => {
  const maliciousText = '</script><script>alert("stored-xss")</script>';
  const { default: Layout } = loadTs('app/layout.tsx', {
    './globals.css': {},
    '@/lib/data/settings': { getSiteSettings: async () => ({ canonicalOrigin: 'https://school.example', institutionName: maliciousText, seoDescription: maliciousText, contactPhones: ['+919842823195'], contactEmail: 'test@example.com' }) },
    '@/lib/data/campuses': { getCampuses: async () => [] },
    '@/components/MobileStickyBar': () => null,
    '@/components/public/SiteSettingsProvider': ({ children }) => children,
  });
  const output = renderToStaticMarkup(await Layout({ children: React.createElement('main', null, 'Safe content') }));
  const script = output.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);
  assert.equal(output.includes('<script>alert('), false);
  assert.equal(script.includes('<'), false);
  assert.equal(JSON.parse(script).name, maliciousText);
});

test('a custom settings manager can save settings without being a super administrator', async () => {
  let current = { updatedAt: '2026-11-14T00:00:00Z', siteTitle: 'Original' };
  const permissions = [];
  const { updateSiteSettings } = loadTs('lib/data/settings.ts', {
    '@/lib/auth/server': { requirePermission: async permission => { permissions.push(permission); return { role: 'staff', permissions: ['settings.manage'], isSuperAdmin: false }; } },
    '@/lib/data/content-store': { updateContent: async (_key, _fallback, mutate) => { current = mutate(current); return current; } },
  });
  const saved = await updateSiteSettings({ siteTitle: 'Updated', updatedAt: current.updatedAt }, 'staff');
  assert.equal(saved.siteTitle, 'Updated');
  assert.deepEqual(permissions, ['settings.manage']);
});

test('CMS JSON parsing errors are returned as validation errors', () => {
  class AuthError extends Error {}
  const { contentErrorResponse } = loadTs('lib/data/content-api.ts', {
    'next/cache': {},
    '@/lib/auth/server': { AuthError },
  });
  assert.equal(contentErrorResponse(new SyntaxError('Invalid JSON')).status, 400);
});
