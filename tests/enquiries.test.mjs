import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTs } from './module-loader.mjs';

function storeBoundary() {
  const records = new Map();
  return {
    async readContent(key, fallback) { return structuredClone(records.get(key) ?? fallback); },
    async updateContent(key, fallback, mutate) {
      const result = mutate(structuredClone(records.get(key) ?? fallback));
      records.set(key, structuredClone(result));
      return structuredClone(result);
    },
  };
}
const applicant = { name: 'Test Student', phone: '9842823195', program: 'NEET', campus: 'Puducherry', idempotencyKey: 'request-test-12345678' };

test('enquiry survives a new application module instance and retry does not duplicate it', async () => {
  const storage = storeBoundary();
  const mocks = { '@/lib/data/content-store': storage };
  const first = loadTs('lib/data/enquiries.ts', mocks);
  const created = await first.submitEnquiry(applicant);
  const second = loadTs('lib/data/enquiries.ts', mocks);
  const retried = await second.submitEnquiry(applicant);
  assert.equal(retried.isDuplicate, true);
  assert.equal(retried.enquiry.id, created.enquiry.id);
  const all = await second.getEnquiriesForStaff({ id: 'admin', role: 'admin' });
  assert.equal(all.length, 1);
  assert.equal(all[0].normalizedPhone, '+919842823195');
});

test('unassigned staff cannot read or mutate enquiries, and no sample PII appears', async () => {
  const storage = storeBoundary();
  const data = loadTs('lib/data/enquiries.ts', { '@/lib/data/content-store': storage });
  assert.deepEqual(await data.getEnquiriesForStaff({ id: 'admin', role: 'admin' }), []);
  const { enquiry } = await data.submitEnquiry(applicant);
  assert.deepEqual(await data.getEnquiriesForStaff({ id: 'staff', role: 'staff' }), []);
  await assert.rejects(data.updateEnquiryStatus(enquiry.id, 'closed', { id: 'staff', role: 'staff' }), /unauthorized|forbidden/i);
});

test('rate limit survives a new application instance', async () => {
  const storage = storeBoundary();
  const mocks = { '@/lib/data/content-store': storage };
  const first = loadTs('lib/data/enquiries.ts', mocks);
  for (let i = 0; i < 6; i++) assert.equal(await first.checkRateLimit('test-ip'), true);
  const second = loadTs('lib/data/enquiries.ts', mocks);
  assert.equal(await second.checkRateLimit('test-ip'), false);
});

test('anonymous enquiry reads fail without querying private records', async () => {
  class AuthError extends Error { status = 401; }
  let privateRecordsRead = false;
  const route = loadTs('app/api/enquiries/route.ts', {
    '@/lib/auth/server': {
      requireStaff: async () => { throw new AuthError('Sign in required'); },
      authErrorResponse: error => Response.json({ error: error.message }, { status: error.status || 500 }),
    },
    '@/lib/supabase/server': { createClient: async () => ({ auth: { getUser: async () => ({ data: { user: null } }) } }) },
    '@/lib/data/enquiries': { getEnquiriesForStaff: async () => { privateRecordsRead = true; return []; } },
    '@/lib/data/audit': {},
  });
  const res = await route.GET(new Request('http://localhost/api/enquiries'));
  assert.equal(res.status, 401);
  assert.equal(privateRecordsRead, false);
});

test('banner validation rejects protocol-relative and javascript links and backwards schedules', () => {
  const { bannerSchema } = loadTs('lib/validation/schemas.ts');
  const base = { title: 'New Banner', description: 'Description', desktopImageUrl: '/images/banner.webp', ctaLabel: 'Apply', ctaUrl: '/contact' };
  assert.equal(bannerSchema.safeParse({ ...base, ctaUrl: '//evil.example' }).success, false);
  assert.equal(bannerSchema.safeParse({ ...base, secondaryCtaUrl: 'javascript:alert(1)' }).success, false);
  assert.equal(bannerSchema.safeParse({ ...base, startsAt: '2026-11-20T00:00', endsAt: '2026-11-19T00:00' }).success, false);
});

test('enquiry validation bounds untrusted text and idempotency keys', () => {
  const { enquirySchema } = loadTs('lib/validation/schemas.ts');
  assert.equal(enquirySchema.safeParse({ ...applicant, privacyConsent: true }).success, true);
  assert.equal(enquirySchema.safeParse({ ...applicant, privacyConsent: true, program: 'x'.repeat(501) }).success, false);
  assert.equal(enquirySchema.safeParse({ ...applicant, privacyConsent: true, idempotencyKey: 'x'.repeat(501) }).success, false);
});
