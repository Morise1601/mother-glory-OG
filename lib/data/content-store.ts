import 'server-only';
import type { Json } from '@/types/database.types';
import { getAdminClient } from '@/lib/supabase/admin';

const PREFIX = 'public_cms.';

export class ContentStoreError extends Error {
  constructor(message: string, public readonly status = 503) { super(message); }
}

export class ContentConflictError extends ContentStoreError {
  constructor() { super('Conflict: Content changed while you were editing. Refresh and try again.', 409); }
}

async function readRow(key: string) {
  const { data, error } = await getAdminClient().from('app_settings')
    .select('setting_value,updated_at').eq('setting_key', PREFIX + key).maybeSingle();
  if (error) throw new ContentStoreError('Could not load saved website content. Please retry.');
  return data;
}

export async function readContent<T>(key: string, fallback: T): Promise<T> {
  const row = await readRow(key);
  return structuredClone(row ? row.setting_value as T : fallback);
}

/** Compare-and-swap the entire document, so concurrent administrators cannot lose edits. */
export async function updateContent<T>(key: string, fallback: T, mutate: (current: T) => T | Promise<T>): Promise<T> {
  const row = await readRow(key);
  const next = await mutate(structuredClone(row ? row.setting_value as T : fallback));
  const updatedAt = new Date(Math.max(Date.now(), row ? Date.parse(row.updated_at) + 1 : 0)).toISOString();
  const record = { setting_key: PREFIX + key, setting_value: next as Json, is_public: false, updated_at: updatedAt };
  if (!row) {
    const { error } = await getAdminClient().from('app_settings').insert(record);
    if (error?.code === '23505') throw new ContentConflictError();
    if (error) throw new ContentStoreError('Website changes could not be saved. Please retry.');
  } else {
    const { data, error } = await getAdminClient().from('app_settings').update(record)
      .eq('setting_key', PREFIX + key).eq('updated_at', row.updated_at).select('setting_key');
    if (error) throw new ContentStoreError('Website changes could not be saved. Please retry.');
    if (!data?.length) throw new ContentConflictError();
  }
  return structuredClone(next);
}

export async function writeContent<T>(key: string, value: T): Promise<void> {
  await updateContent(key, value, () => value);
}
