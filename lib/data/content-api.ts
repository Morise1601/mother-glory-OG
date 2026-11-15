import 'server-only';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { AuthError, authErrorResponse } from '@/lib/auth/server';
import { ContentError } from '@/lib/data/content-errors';
import { ContentStoreError } from '@/lib/data/content-store';
import { ZodError } from 'zod';
import type { StaffActor } from '@/lib/auth/server';
import { logAuditAction } from '@/lib/data/audit';

export function contentErrorResponse(error: unknown) {
  if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON request.' }, { status: 400 });
  if (error instanceof AuthError) return authErrorResponse(error);
  if (error instanceof ZodError) return NextResponse.json({ error: error.issues[0]?.message || 'Invalid content.' }, { status: 400 });
  if (error instanceof ContentError || error instanceof ContentStoreError) return NextResponse.json({ error: error.message }, { status: error.status });
  return NextResponse.json({ error: 'Website content could not be saved or loaded. Please retry.' }, { status: 500 });
}

export function refreshPublicContent() {
  revalidatePath('/', 'layout');
  revalidatePath('/sitemap.xml');
}

export function contentJson(value: unknown) {
  return NextResponse.json(value, { headers: { 'Cache-Control': 'private, no-store' } });
}

export async function contentMutationResult(value: Record<string, unknown>, actor: StaffActor, module: string, action: string, entityId?: string) {
  const warnings: string[] = [];
  try {
    await Promise.race([
      logAuditAction({
        actorId: actor.id,
        actorName: actor.name,
        module,
        action,
        entityType: module,
        entityId,
        summary: `Updated website ${module}: ${action}.`,
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Audit log timeout')), 2500)),
    ]);
  } catch {
    warnings.push('Changes were saved, but the audit event could not be recorded.');
  }
  try { refreshPublicContent(); }
  catch { warnings.push('Changes were saved. Reload the public page to see the latest content.'); }
  return contentJson({ ...value, ...(warnings.length ? { warning: warnings.join(' ') } : {}) });
}
