import assert from 'node:assert/strict';

// Run against a local production server. Only GETs and deliberately invalid POSTs;
// never create accounts, send emails, submit enquiries or alter live content.
const origin = process.env.SMOKE_TEST_ORIGIN || 'http://localhost:3100';
const cases = [
  ['/', 200], ['/about', 200], ['/programs', 200], ['/achievements', 200], ['/contact', 200],
  ['/privacy-policy', 200], ['/terms-and-conditions', 200], ['/admin', 200],
  ['/robots.txt', 200], ['/sitemap.xml', 200],
  ['/admin/dashboard', 307], ['/admin/staff', 307],
  ['/api/admin/session', 401], ['/api/admin/staff', 401], ['/api/admin/banners', 401],
  ['/api/admin/media', 401], ['/api/admin/settings', 401], ['/api/admin/reviews', 401],
  ['/api/admin/achievements', 401], ['/api/admin/founders', 401], ['/api/admin/programs', 401],
  ['/api/admin/audit', 401], ['/api/admin/dashboard', 401], ['/api/enquiries', 401],
  ['/api/enquiries', 400, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }],
  ['/api/enquiry', 400, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }],
  ['/api/admin/staff', 401, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }],
  ['/api/admin/media', 401, { method: 'POST', body: 'not a file' }],
  ['/api/admin/roles', 401, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }],
];
let passed = 0;
for (let offset = 0; offset < cases.length; offset += 4) {
  await Promise.all(cases.slice(offset, offset + 4).map(async ([pathname, expected, init]) => {
    const response = await fetch(new URL(pathname, origin), { ...init, redirect: 'manual', signal: AbortSignal.timeout(30_000) });
    assert.equal(response.status, expected, `${init?.method || 'GET'} ${pathname}`);
    if (expected === 307) assert.equal(new URL(response.headers.get('location'), origin).pathname, '/admin');
    if (expected === 401) {
      const payload = await response.json();
      assert.equal(typeof payload.error, 'string');
      assert.equal(Object.hasOwn(payload, 'enquiries') || Object.hasOwn(payload, 'staff'), false);
    }
    if (expected === 200 && pathname === '/') {
      const markup = await response.text();
      assert.equal(markup.includes('application/ld+json'), true);
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    }
    passed++;
    console.log(`${init?.method || 'GET'} ${pathname}: ${response.status}`);
  }));
}
console.log(`Production smoke checks: ${passed}/${cases.length} passed`);
