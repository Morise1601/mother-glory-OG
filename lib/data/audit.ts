import 'server-only';
import type { AuditLogItem } from '@/types/content.types';
import type { Json, Tables } from '@/types/database.types';
import { getAdminClient } from '@/lib/supabase/admin';

function redact(value: unknown): Json {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, /password|secret|key|token|auth/i.test(key) ? '[REDACTED]' : redact(item)]));
  return value === undefined ? null : value as Json;
}

function mapLog(row: Tables<'audit_logs'>): AuditLogItem {
  return { id: String(row.id), actorId: row.actor_user_id || 'system', actorName: row.actor_name || 'System', action: row.action, module: row.module, entityType: row.entity_type || '', entityId: row.entity_id || undefined, severity: row.severity, summary: row.summary, metadata: row.metadata as Record<string, unknown>, createdAt: row.created_at };
}

export async function getAuditLogs(actorRole: 'admin' | 'editor' | 'staff'): Promise<AuditLogItem[]> {
  if (actorRole !== 'admin') throw new Error('Forbidden: Only administrators can view audit logs');
  const { data, error } = await getAdminClient().from('audit_logs').select('*').order('created_at', { ascending: false }).limit(250);
  if (error) throw new Error('Unable to load the audit trail');
  return (data || []).map(mapLog);
}

export async function logAuditAction(params: {
  actorId: string; actorName: string; action: string; module: string; entityType: string; entityId?: string;
  severity?: 'info' | 'warning' | 'critical'; summary: string; metadata?: Record<string, unknown>;
}): Promise<AuditLogItem> {
  const { data, error } = await getAdminClient().from('audit_logs').insert({
    actor_user_id: /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(params.actorId) ? params.actorId : null,
    actor_name: params.actorName, action: params.action, module: params.module,
    entity_type: params.entityType, entity_id: params.entityId || null,
    severity: params.severity || 'info', summary: params.summary, metadata: redact(params.metadata || {}),
  }).select('*').single();
  if (error || !data) throw new Error('The audit event could not be recorded');
  return mapLog(data);
}
