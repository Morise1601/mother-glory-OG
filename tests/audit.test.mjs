import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTs } from './module-loader.mjs';

test('audit writes durable legacy schema records and redacts nested credentials', async () => {
  let inserted;
  const audit = loadTs('lib/data/audit.ts', {
    '@/lib/supabase/admin': { getAdminClient: () => ({ from: table => {
      assert.equal(table, 'audit_logs');
      return { insert: row => { inserted = row; return { select: () => ({ single: async () => ({ data: { ...row, id: 7, created_at: '2026-11-14T00:00:00Z' }, error: null }) }) }; } };
    } }) },
  });
  const log = await audit.logAuditAction({ actorId: 'system-public', actorName: 'Visitor', action: 'enquiry.submitted', module: 'admissions', entityType: 'enquiries', summary: 'Received', metadata: { nested: { password: 'DO-NOT-STORE', label: 'keep' }, token: 'SECRET' } });
  assert.ok(inserted, 'audit must insert into the database');
  assert.equal(inserted.actor_user_id, null);
  assert.deepEqual(inserted.metadata, { nested: { password: '[REDACTED]', label: 'keep' }, token: '[REDACTED]' });
  assert.equal(log.id, '7');
});

test('audit never reports success when database insert fails', async () => {
  const audit = loadTs('lib/data/audit.ts', {
    '@/lib/supabase/admin': { getAdminClient: () => ({ from: () => ({ insert: () => ({ select: () => ({ single: async () => ({ data: null, error: { message: 'down' } }) }) }) }) }) },
  });
  await assert.rejects(audit.logAuditAction({ actorId: 'system-public', actorName: 'Visitor', action: 'test', module: 'test', entityType: 'test', summary: 'Test' }), /audit/i);
});
