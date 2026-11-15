import { requirePermission } from '@/lib/auth/server';
import { programSchema } from '@/lib/validation/schemas';
import { getAllProgramsAdmin, updateProgram } from '@/lib/data/programs';
import { contentErrorResponse, contentJson, contentMutationResult } from '@/lib/data/content-api';
import { ContentError } from '@/lib/data/content-errors';
export async function GET() {
  try { await requirePermission('settings.manage'); return contentJson({ programs: await getAllProgramsAdmin() }); }
  catch (error) { return contentErrorResponse(error); }
}
export async function POST(request: Request) {
  try {
    const actor = await requirePermission('settings.manage');
    const body = (await request.json()) ?? {};
    if (typeof body.id !== 'string') throw new ContentError('Program ID is required.');
    const program = await updateProgram(body.id, programSchema.parse(body.program));
    return contentMutationResult({ program }, actor, 'programs', 'programs.updated', program.id);
  } catch (error) { return contentErrorResponse(error); }
}
