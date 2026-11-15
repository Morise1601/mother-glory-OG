import 'server-only';
import { readContent, updateContent } from '@/lib/data/content-store';
import { assertVersion, ContentError } from '@/lib/data/content-errors';

type Versioned = { id: string; version: number; updatedAt: string; sortOrder: number; status: string };

export function repository<T extends Versioned>(key: string, templates: T[], validate?: (items: T[]) => void) {
  return {
    async all(): Promise<T[]> {
      return (await readContent<T[]>(key, templates)).sort((a, b) => a.sortOrder - b.sortOrder);
    },
    async admin(): Promise<T[]> {
      return (await readContent<T[]>(key, templates)).sort((a, b) => a.sortOrder - b.sortOrder);
    },
    async update(id: string, updates: Partial<T>): Promise<T> {
      let updated!: T;
      await updateContent<T[]>(key, templates, current => {
        const existing = current.find(item => item.id === id);
        if (!existing) throw new ContentError('Content not found', 404);
        assertVersion(existing, updates.version);
        updated = { ...existing, ...updates, id, version: existing.version + 1, updatedAt: new Date().toISOString() };
        const result = current.map(item => item.id === id ? updated : item);
        validate?.(result);
        return result;
      });
      return updated;
    },
    async save(items: T[]): Promise<T[]> {
      if (new Set(items.map(item => item.id)).size !== items.length) throw new ContentError('Duplicate content IDs are not allowed.');
      return updateContent<T[]>(key, templates, current => {
        if (current.length !== items.length) throw new ContentError('Conflict: Content list changed. Refresh and try again.', 409);
        for (const item of items) {
          const existing = current.find(value => value.id === item.id);
          if (!existing) throw new ContentError('Content no longer exists', 409);
          assertVersion(existing, item.version);
        }
        const result = items.map((item, index) => ({ ...item, sortOrder: index + 1, version: item.version + 1, updatedAt: new Date().toISOString() }));
        validate?.(result);
        return result;
      });
    },
  };
}
