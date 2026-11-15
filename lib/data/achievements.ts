import 'server-only';
import { randomUUID } from 'node:crypto';
import type { Achievement } from '@/types/content.types';
import { INITIAL_ACHIEVEMENTS } from '@/lib/data/content-defaults';
import { readContent, updateContent } from '@/lib/data/content-store';
import { assertVersion, ContentError } from '@/lib/data/content-errors';

export interface AchievementFilterOptions {
  year?: number | 'all';
  category?: 'all' | 'Events' | 'Awards' | 'Initiatives' | 'Academic';
  campus?: 'all' | 'Puducherry' | 'Karaikal' | 'Both';
  search?: string;
}

export async function getAllAchievementsAdmin(): Promise<Achievement[]> {
  return (await readContent<Achievement[]>('achievements', [])).sort((a, b) => b.year - a.year || a.sortOrder - b.sortOrder);
}

export async function getAchievements(filters?: AchievementFilterOptions): Promise<Achievement[]> {
  let list = (await getAllAchievementsAdmin()).filter(a => a.status === 'published');
  if (filters?.year && filters.year !== 'all') list = list.filter(a => a.year === Number(filters.year));
  if (filters?.category && filters.category !== 'all') list = list.filter(a => a.category.toLowerCase() === filters.category!.toLowerCase());
  if (filters?.campus && filters.campus !== 'all') list = list.filter(a => a.campus === filters.campus || a.campus === 'Both');
  const search = filters?.search?.trim().toLowerCase();
  if (search) list = list.filter(a => [a.title, a.summary, a.caption].some(text => text?.toLowerCase().includes(search)));
  return list;
}

export async function getFeaturedAchievements(): Promise<Achievement[]> {
  return (await getAchievements()).filter(a => a.featured);
}
export async function getAchievementBySlug(slug: string): Promise<Achievement | undefined> {
  return (await getAchievements()).find(a => a.slug.toLowerCase() === slug.toLowerCase());
}
export async function getAchievementById(id: string): Promise<Achievement | undefined> {
  return (await getAllAchievementsAdmin()).find(a => a.id === id);
}

export async function createAchievement(data: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Achievement> {
  let created!: Achievement;
  await updateContent<Achievement[]>('achievements', [], current => {
    if (current.some(a => a.slug === data.slug)) throw new ContentError('An achievement with this slug already exists.');
    created = { ...data, id: randomUUID(), version: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    return [created, ...current];
  });
  return created;
}

export async function updateAchievement(id: string, updates: Partial<Achievement>): Promise<Achievement> {
  let updated!: Achievement;
  await updateContent<Achievement[]>('achievements', [], current => {
    const existing = current.find(a => a.id === id);
    if (!existing) throw new ContentError('Achievement not found', 404);
    assertVersion(existing, updates.version);
    if (updates.slug && current.some(a => a.id !== id && a.slug === updates.slug)) throw new ContentError('An achievement with this slug already exists.');
    updated = { ...existing, ...updates, id, createdAt: existing.createdAt, version: existing.version + 1, updatedAt: new Date().toISOString() };
    return current.map(a => a.id === id ? updated : a);
  });
  return updated;
}

export async function deleteAchievement(id: string, version?: number): Promise<boolean> {
  let removed = false;
  await updateContent<Achievement[]>('achievements', [], current => {
    const existing = current.find(a => a.id === id);
    if (!existing) return current;
    if (version !== undefined) assertVersion(existing, version);
    removed = true;
    return current.filter(a => a.id !== id);
  });
  return removed;
}
