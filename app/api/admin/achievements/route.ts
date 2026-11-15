import { requirePermission } from '@/lib/auth/server';
import { achievementSchema } from '@/lib/validation/schemas';
import { getAllAchievementsAdmin, createAchievement, updateAchievement, deleteAchievement } from '@/lib/data/achievements';
import { contentErrorResponse, contentJson, contentMutationResult } from '@/lib/data/content-api';
import { ContentError } from '@/lib/data/content-errors';

export async function GET() {
  try { await requirePermission('gallery.view'); return contentJson({ achievements: await getAllAchievementsAdmin() }); }
  catch (error) { return contentErrorResponse(error); }
}
export async function POST(request: Request) {
  try {
    const body = (await request.json()) ?? {};
    const actor = await requirePermission(body.id ? 'gallery.edit' : 'gallery.create');
    const data = achievementSchema.parse(body.achievement);
    if (data.status === 'published') await requirePermission('gallery.publish');
    const achievement = body.id ? await updateAchievement(body.id, data) : await createAchievement(data);
    return contentMutationResult({ achievement }, actor, 'achievements', body.id ? 'achievement.updated' : 'achievement.created', achievement.id);
  } catch (error) { return contentErrorResponse(error); }
}
export async function DELETE(request: Request) {
  try {
    const actor = await requirePermission('gallery.delete');
    const { id, version } = (await request.json()) ?? {};
    if (typeof id !== 'string' || !Number.isInteger(version)) throw new ContentError('Achievement ID and version are required.');
    if (!await deleteAchievement(id, version)) throw new ContentError('Achievement not found.', 404);
    return contentMutationResult({ success: true }, actor, 'achievements', 'achievement.deleted', id);
  } catch (error) { return contentErrorResponse(error); }
}
