import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTs } from './module-loader.mjs';

function fixture({ missingMigration = false, saveFailure = false, emailFailure = false, auditFailure = false } = {}) {
  const calls = [];
  const actor = { id: '11111111-1111-4111-8111-111111111111', name: 'Admin', role: 'admin', isSuperAdmin: true, permissions: [] };
  const identityId = '22222222-2222-4222-8222-222222222222';
  const admin = {
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { id: 'role-staff', slug: 'staff', is_active: true }, error: null }) }) }) }),
    auth: { admin: {
      createUser: async () => { calls.push('create'); return { data: { user: { id: identityId } }, error: null }; },
      deleteUser: async id => { calls.push(`delete:${id}`); return { error: null }; },
      inviteUserByEmail: async () => { calls.push('email'); return { error: emailFailure ? { message: 'unavailable' } : null }; },
    } },
  };
  const mocks = {
    '@/lib/auth/server': { AuthError: class extends Error { constructor(message, status) { super(message); this.status = status; } }, requirePermission: async () => actor },
    '@/lib/supabase/admin': { getAdminClient: () => admin },
    '@/lib/supabase/server': { createClient: async () => ({ rpc: async name => {
      calls.push(name);
      return { data: {}, error: missingMigration && name === 'mg_staff_security_ready' ? { code: 'PGRST202', message: 'not installed' } : saveFailure && name === 'mg_manage_staff' ? { code: '42501', message: 'denied' } : null };
    } }) },
    './audit': { logAuditAction: async () => { calls.push('audit'); if (auditFailure) throw new Error('down'); } },
  };
  return { calls, identityId, staff: loadTs('lib/data/staff.ts', mocks) };
}

test('staff creation verifies migration, persists role, and only then sends the setup email', async () => {
  const before = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = 'https://school.example';
  try {
    const item = fixture();
    const result = await item.staff.inviteStaff({ name: 'New Staff', email: 'test@example.com', roleId: 'role-staff' });
    assert.equal(result.invitationSent, true);
    assert.deepEqual(item.calls, ['mg_staff_security_ready', 'create', 'mg_manage_staff', 'email', 'audit']);
  } finally { if (before === undefined) delete process.env.NEXT_PUBLIC_SITE_URL; else process.env.NEXT_PUBLIC_SITE_URL = before; }
});

test('missing staff migration creates no auth account and sends no email', async () => {
  const before = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = 'https://school.example';
  try {
    const item = fixture({ missingMigration: true });
    await assert.rejects(item.staff.inviteStaff({ name: 'New Staff', email: 'test@example.com', roleId: 'role-staff' }), { status: 503 });
    assert.deepEqual(item.calls, ['mg_staff_security_ready']);
  } finally { if (before === undefined) delete process.env.NEXT_PUBLIC_SITE_URL; else process.env.NEXT_PUBLIC_SITE_URL = before; }
});

test('failed staff save rolls back only the newly created identity without emailing it', async () => {
  const before = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = 'https://school.example';
  try {
    const item = fixture({ saveFailure: true });
    await assert.rejects(item.staff.inviteStaff({ name: 'New Staff', email: 'test@example.com', roleId: 'role-staff' }), { status: 403 });
    assert.deepEqual(item.calls, ['mg_staff_security_ready', 'create', 'mg_manage_staff', `delete:${item.identityId}`]);
  } finally { if (before === undefined) delete process.env.NEXT_PUBLIC_SITE_URL; else process.env.NEXT_PUBLIC_SITE_URL = before; }
});

test('audit failure does not falsely report a saved staff account as failed', async () => {
  const before = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = 'https://school.example';
  try {
    const item = fixture({ auditFailure: true });
    const result = await item.staff.inviteStaff({ name: 'New Staff', email: 'test@example.com', roleId: 'role-staff' });
    assert.equal(result.invitationSent, true);
    assert.match(result.warning, /audit|activity/i);
  } finally { if (before === undefined) delete process.env.NEXT_PUBLIC_SITE_URL; else process.env.NEXT_PUBLIC_SITE_URL = before; }
});

test('email failure reports a saved account with an explicit retry message', async () => {
  const before = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = 'https://school.example';
  try {
    const item = fixture({ emailFailure: true });
    const result = await item.staff.inviteStaff({ name: 'New Staff', email: 'test@example.com', roleId: 'role-staff' });
    assert.equal(result.invitationSent, false);
    assert.match(result.message, /created.*could not be sent/i);
    assert.equal(item.calls.some(call => call.startsWith('delete:')), false);
  } finally { if (before === undefined) delete process.env.NEXT_PUBLIC_SITE_URL; else process.env.NEXT_PUBLIC_SITE_URL = before; }
});

test('resending an invitation never emails a drifted profile address belonging to a different identity', async () => {
  let emailed = false;
  const staff = loadTs('lib/data/staff.ts', {
    '@/lib/auth/server': { AuthError: class extends Error { constructor(message, status) { super(message); this.status = status; } }, requirePermission: async () => ({ isSuperAdmin: true }) },
    '@/lib/supabase/admin': { getAdminClient: () => ({
      from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { email: 'stale@example.com', status: 'active' }, error: null }) }) }) }),
      auth: { admin: { getUserById: async () => ({ data: { user: { id: 'known-user', email: 'actual@example.com' } }, error: null }), inviteUserByEmail: async () => { emailed = true; return { error: null }; } } },
    }) },
  });
  const before = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = 'https://school.example';
  try {
    await assert.rejects(staff.resendStaffInvitation('known-user'), { status: 409 });
    assert.equal(emailed, false);
  } finally { if (before === undefined) delete process.env.NEXT_PUBLIC_SITE_URL; else process.env.NEXT_PUBLIC_SITE_URL = before; }
});
