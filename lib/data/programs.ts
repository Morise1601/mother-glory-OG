import 'server-only';
import type { Program } from '@/types/content.types';
import { INITIAL_PROGRAMS } from '@/lib/data/content-defaults';
import { repository } from '@/lib/data/content-repository';
import { ContentError } from '@/lib/data/content-errors';
const store = repository<Program>('programs', INITIAL_PROGRAMS, programs => {
  const slugs = programs.map(program => program.slug.toLowerCase());
  if (new Set(slugs).size !== slugs.length) throw new ContentError('A program with this slug already exists.', 409);
});
export const getAllProgramsAdmin = store.admin;
export const updateProgram = store.update;
export async function getPrograms(): Promise<Program[]> { return (await store.all()).filter(p => p.status === 'published'); }
export async function getProgramBySlug(slug: string): Promise<Program | undefined> { return (await getPrograms()).find(p => p.slug.toLowerCase() === slug.toLowerCase()); }
export async function getProgramById(id: string): Promise<Program | undefined> { return (await store.admin()).find(p => p.id === id); }
