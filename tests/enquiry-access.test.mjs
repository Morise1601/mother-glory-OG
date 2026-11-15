import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTs } from './module-loader.mjs';

const actor = (permissions, role = 'editor') => ({ id: 'staff-user', profileId: 'staff-user', name: 'Staff User', email: 'staff@example.com', role, permissions, isSuperAdmin: false });

test('staff with combined content and assigned admissions grants retain enquiries navigation', () => {
  const { canAccessAdminPage } = loadTs('lib/auth/access.ts');
  assert.equal(canAccessAdminPage(actor(['gallery.view', 'enquiries.view_assigned']), '/admin/enquiries'), true);
});

test('a role without admissions grants cannot enter the enquiries page', () => {
  const { canAccessAdminPage } = loadTs('lib/auth/access.ts');
  assert.equal(canAccessAdminPage(actor(['dashboard.view'], 'staff'), '/admin/enquiries'), false);
});

function enquiryFixture(permissions, { rpcAllowed = true, superAdmin = false } = {}) {
  const tables = {
    staff_profiles: { id: 'staff-user', full_name: 'Staff User', email: 'staff@example.com', status: 'active' },
    staff_roles: [{ role_id: 'combined-role' }],
    roles: [{ id: 'combined-role', slug: 'combined-role', is_active: true }],
    role_permissions: permissions.map((key, index) => ({ permission_id: `permission-${index}` })),
    permissions: permissions.map((permission_key, index) => ({ id: `permission-${index}`, permission_key })),
  };
  const from = table => {
    const query = { select: () => query, eq: () => query, in: () => query, maybeSingle: async () => ({ data: tables[table], error: null }), then: resolve => resolve({ data: tables[table], error: null }) };
    return query;
  };
  const client = {
    auth: { getUser: async () => ({ data: { user: { id: 'staff-user' } }, error: null }) },
    rpc: async (name, args) => ({ data: name === 'is_super_admin' ? superAdmin : rpcAllowed && (superAdmin || permissions.includes(args.p_permission_key)), error: null }),
  };
  return loadTs('lib/auth/enquiries.ts', {
    '@/lib/supabase/server': { createClient: async () => client },
    '@/lib/supabase/admin': { getAdminClient: () => ({ from }) },
  });
}

test('combined content and counselling roles keep assigned read and mutation scopes', async () => {
  const access = enquiryFixture(['gallery.view', 'enquiries.view_assigned', 'enquiries.update_assigned']);
  const reader = await access.requireEnquiryAccess('read');
  const updater = await access.requireEnquiryAccess('update');
  assert.equal(reader.role, 'editor');
  assert.deepEqual(access.enquiryScope(reader), { id: 'staff-user', role: 'staff' });
  assert.deepEqual(access.enquiryScope(updater, 'update'), { id: 'staff-user', role: 'staff' });
});

test('view-all permission cannot expand update-assigned permission to all records', async () => {
  const access = enquiryFixture(['enquiries.view_all', 'enquiries.update_assigned']);
  assert.deepEqual(access.enquiryScope(await access.requireEnquiryAccess('read')), { id: 'staff-user', role: 'admin' });
  assert.deepEqual(access.enquiryScope(await access.requireEnquiryAccess('update'), 'update'), { id: 'staff-user', role: 'staff' });
  await assert.rejects(access.requireEnquiryAccess('assign'), { status: 403 });
});

test('enquiry scopes deny an administrative display role without actual admissions grants', async () => {
  const access = enquiryFixture(['gallery.view']);
  for (const mode of ['read', 'update', 'assign']) await assert.rejects(access.requireEnquiryAccess(mode), { status: 403 });
  assert.throws(() => access.enquiryScope(actor([], 'admin')), { status: 403 });
});

test('admissions access rechecks the authenticated permission RPC rather than trusting cached grants', async () => {
  const access = enquiryFixture(['enquiries.view_assigned'], { rpcAllowed: false });
  await assert.rejects(access.requireEnquiryAccess('read'), { status: 403 });
});

test('super administrators retain each admissions scope while assign grants do not imply read access', async () => {
  const access = enquiryFixture([], { superAdmin: true });
  for (const mode of ['read', 'update', 'assign']) assert.deepEqual(access.enquiryScope(await access.requireEnquiryAccess(mode), mode), { id: 'staff-user', role: 'admin' });
  const assignOnly = enquiryFixture(['enquiries.assign']);
  const assigner = await assignOnly.requireEnquiryAccess('assign');
  assert.deepEqual(assignOnly.enquiryScope(assigner, 'assign'), { id: 'staff-user', role: 'admin' });
  assert.equal(assignOnly.canViewEnquiries(assigner), false);
  await assert.rejects(assignOnly.requireEnquiryAccess('read'), { status: 403 });
});
