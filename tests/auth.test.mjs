import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTs as loadTypeScript } from './module-loader.mjs';

test('anonymous callers cannot list, invite, or change staff', async () => {
  const handlers = loadTypeScript('app/api/admin/staff/route.ts', {
    '@/lib/supabase/server': { createClient: async () => ({ auth: { getUser: async () => ({ data: { user: null }, error: null }) } }) },
  });
  const get = await handlers.GET();
  assert.equal(get.status, 401);
  for (const method of ['POST', 'PATCH']) {
    const response = await handlers[method](new Request('https://school.example/api/admin/staff', {
      method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: 'staff-editor-1', action: 'update_role', role: 'admin', name: 'Test Staff', email: 'test@example.com' }),
    }));
    assert.equal(response.status, 401);
  }
});

function authFixture({ status = 'active', user = { id: 'user-1' }, permissions = ['gallery.view', 'gallery.edit'], superAdmin = false, permissionAllowed = true } = {}) {
  const tables = {
    staff_profiles: { id: 'user-1', full_name: 'Test Staff', email: 'test@example.com', status },
    staff_roles: [{ role_id: 'role-1' }],
    roles: [{ id: 'role-1', slug: 'content-team', is_active: true }],
    role_permissions: permissions.map((key, index) => ({ permission_id: `p-${index}` })),
    permissions: permissions.map((permission_key, index) => ({ id: `p-${index}`, permission_key })),
  };
  const query = (table) => {
    const builder = { select: () => builder, eq: () => builder, in: () => builder, maybeSingle: async () => ({ data: tables[table], error: null }), then: (resolve) => resolve({ data: tables[table], error: null }) };
    return builder;
  };
  const client = { auth: { getUser: async () => ({ data: { user }, error: null }) }, from: query, rpc: async (name) => ({ data: name === 'is_super_admin' ? superAdmin : permissionAllowed, error: null }) };
  return { client, admin: { from: query }, tables };
}

function loadAuth(fixture) {
  return loadTypeScript('lib/auth/server.ts', {
    '@/lib/supabase/server': { createClient: async () => fixture.client },
    '@/lib/supabase/admin': { getAdminClient: () => fixture.admin },
  });
}

test('inactive authenticated profiles cannot access administration', async () => {
  await assert.rejects(loadAuth(authFixture({ status: 'inactive' })).requireStaff(), { status: 403 });
});

test('custom roles receive their granted content permissions without admin rights', async () => {
  const actor = await loadAuth(authFixture()).requirePermission('gallery.edit');
  assert.equal(actor.id, 'user-1');
  assert.equal(actor.role, 'editor');
  assert.equal(actor.isSuperAdmin, false);
  assert.deepEqual(actor.permissions, ['gallery.view', 'gallery.edit']);
});

test('permission RPC denial cannot be bypassed by role assignments', async () => {
  await assert.rejects(loadAuth(authFixture({ permissionAllowed: false })).requirePermission('gallery.edit'), { status: 403 });
});

test('unassigned authenticated users cannot enter administration', async () => {
  const fixture = authFixture();
  fixture.tables.staff_roles = [];
  await assert.rejects(loadAuth(fixture).requireStaff(), { status: 403 });
});
