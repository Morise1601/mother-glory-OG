import 'server-only';
import type { Founder } from '@/types/content.types';
import { INITIAL_FOUNDERS } from '@/lib/data/content-defaults';
import { repository } from '@/lib/data/content-repository';
const store = repository<Founder>('founders', INITIAL_FOUNDERS);
export const getAllFoundersAdmin = store.admin;
export const updateFounder = store.update;
export const saveAllFounders = store.save;
export async function getFounders(): Promise<Founder[]> { return (await store.all()).filter(f => f.status === 'published'); }
