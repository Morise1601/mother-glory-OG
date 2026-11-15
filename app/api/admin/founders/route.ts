import { requirePermission } from '@/lib/auth/server';
import { founderSchema } from '@/lib/validation/schemas';
import { getAllFoundersAdmin, saveAllFounders } from '@/lib/data/founders';
import { contentErrorResponse, contentJson, contentMutationResult } from '@/lib/data/content-api';
import type { Founder } from '@/types/content.types';
export async function GET() {
  try { await requirePermission('settings.manage'); return contentJson({ founders: await getAllFoundersAdmin() }); }
  catch (error) { return contentErrorResponse(error); }
}
export async function POST(request: Request) {
  try {
    const actor = await requirePermission('settings.manage');
    const body = (await request.json()) ?? {};
    const founders = await saveAllFounders(founderSchema.array().max(20).parse(body.founders) as Founder[]);
    return contentMutationResult({ founders }, actor, 'founders', 'founders.updated');
  } catch (error) { return contentErrorResponse(error); }
}
