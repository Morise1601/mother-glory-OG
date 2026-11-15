import { z } from 'zod';

// Historical demonstration only. `npm test` runs *.test.mjs against production
// modules and PostgreSQL fixtures; this copied-logic demonstration is not coverage.

console.log('--- Mother Glory Validation & Core Logic Test Suite ---');

function normalizePhoneNumber(input) {
  const cleaned = input.trim().replace(/[\s\-\(\)]/g, '');
  if (/^\+91[6-9]\d{9}$/.test(cleaned)) return cleaned;
  if (/^91[6-9]\d{9}$/.test(cleaned)) return `+${cleaned}`;
  if (/^0[6-9]\d{9}$/.test(cleaned)) return `+91${cleaned.slice(1)}`;
  if (/^[6-9]\d{9}$/.test(cleaned)) return `+91${cleaned}`;
  if (/^\+[1-9]\d{6,14}$/.test(cleaned)) return cleaned;
  return cleaned;
}

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().refine((val) => {
    const normalized = normalizePhoneNumber(val);
    return /^\+[1-9]\d{6,14}$/.test(normalized) || /^[6-9]\d{9}$/.test(val.replace(/[\s\-]/g, ''));
  }),
  program: z.string().min(1),
  campus: z.enum(['Puducherry', 'Karaikal']),
  privacyConsent: z.boolean().refine((val) => val === true),
});

let passed = 0;
let failed = 0;

function assert(condition, desc) {
  if (condition) {
    console.log(`✓ PASS: ${desc}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${desc}`);
    failed++;
  }
}

// 1. Phone normalization tests
assert(normalizePhoneNumber('9842823195') === '+919842823195', 'Indian 10-digit normalized with +91');
assert(normalizePhoneNumber('+91 98428 23195') === '+919842823195', 'Whitespace stripped from +91 number');
assert(normalizePhoneNumber('09842823195') === '+919842823195', 'Leading zero replaced with +91');
assert(normalizePhoneNumber('+14155552671') === '+14155552671', 'International phone preserved');

// 2. Enquiry Zod validation tests
const validRes = enquirySchema.safeParse({
  name: 'Student Name',
  phone: '+91 98428 23195',
  program: 'NEET UG Comprehensive Program',
  campus: 'Puducherry',
  privacyConsent: true,
});
assert(validRes.success === true, 'Valid enquiry payload accepted');

const missingConsentRes = enquirySchema.safeParse({
  name: 'Student Name',
  phone: '+91 98428 23195',
  program: 'NEET UG Comprehensive Program',
  campus: 'Puducherry',
  privacyConsent: false,
});
assert(missingConsentRes.success === false, 'Enquiry without consent rejected');

const invalidCampusRes = enquirySchema.safeParse({
  name: 'Student Name',
  phone: '+91 98428 23195',
  program: 'NEET UG Comprehensive Program',
  campus: 'Chennai',
  privacyConsent: true,
});
assert(invalidCampusRes.success === false, 'Invalid campus rejected');

// 3. Last Admin Protection Logic Simulation
const staff = [
  { id: '1', role: 'admin', status: 'active' },
  { id: '2', role: 'editor', status: 'active' },
];

function canDeactivate(id) {
  const target = staff.find(s => s.id === id);
  if (target.role === 'admin' && target.status === 'active') {
    const activeAdmins = staff.filter(s => s.role === 'admin' && s.status === 'active');
    if (activeAdmins.length <= 1) return false;
  }
  return true;
}

assert(canDeactivate('1') === false, 'Blocks deactivating the final active administrator');
assert(canDeactivate('2') === true, 'Allows deactivating editor');

console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
if (failed > 0) process.exit(1);

