import 'server-only';
import { createHash, randomUUID } from 'node:crypto';
import type { Enquiry, EnquiryNote, EnquiryStatus, Role } from '@/types/content.types';
import { normalizePhoneNumber } from '@/lib/validation/schemas';
import { readContent, updateContent } from '@/lib/data/content-store';

type Actor = { id: string; role: Role };
const KEY = 'enquiries';

export async function checkRateLimit(clientIp: string): Promise<boolean> {
  const fingerprint = createHash('sha256').update(`${process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'local'}:${clientIp}`).digest('hex');
  let allowed = false;
  await updateContent<number[]>(`enquiry_rate_${fingerprint}`, [], timestamps => {
    const recent = timestamps.filter(t => Date.now() - t < 600_000);
    allowed = recent.length < 6;
    if (allowed) recent.push(Date.now());
    return recent;
  });
  return allowed;
}

export async function submitEnquiry(data: {
  name: string; phone: string; email?: string; program: string; campus: string; message?: string; idempotencyKey?: string;
}): Promise<{ enquiry: Enquiry; isDuplicate: boolean }> {
  const normalizedPhone = normalizePhoneNumber(data.phone);
  const idempotencyKey = data.idempotencyKey || createHash('sha256').update(`${normalizedPhone}:${data.program}:${data.campus}:${Math.floor(Date.now() / 60000)}`).digest('hex');
  let result: Enquiry | undefined;
  let isDuplicate = false;
  await updateContent<Enquiry[]>(KEY, [], records => {
    const existing = records.find(record => record.idempotencyKey === idempotencyKey);
    if (existing) {
      if (existing.normalizedPhone !== normalizedPhone || existing.program !== data.program || existing.campus !== data.campus) throw new Error('Submission key already used. Please refresh and retry.');
      result = existing;
      isDuplicate = true;
      return records;
    }
    const now = new Date().toISOString();
    result = {
      id: randomUUID(), name: data.name.trim(), phone: data.phone.trim(), normalizedPhone,
      email: data.email?.trim() || undefined, program: data.program.trim(), campus: data.campus,
      message: data.message?.trim() || undefined, consentAt: now, status: 'new', idempotencyKey,
      notes: [], createdAt: now, updatedAt: now,
    };
    return [result, ...records];
  });
  if (!result) throw new Error('Submission could not be saved');
  return { enquiry: result, isDuplicate };
}

function canAccess(enquiry: Enquiry, user: Actor): boolean {
  return user.role === 'admin' || (user.role === 'staff' && enquiry.assignedTo === user.id);
}

export async function getEnquiriesForStaff(user: Actor): Promise<Enquiry[]> {
  if (user.role === 'editor') return [];
  return (await readContent<Enquiry[]>(KEY, [])).filter(record => canAccess(record, user))
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export async function getEnquiryById(id: string, user: Actor): Promise<Enquiry | null> {
  return (await getEnquiriesForStaff(user)).find(record => record.id === id) || null;
}

async function mutateEnquiry(id: string, user: Actor, mutate: (record: Enquiry) => Enquiry): Promise<Enquiry> {
  let result: Enquiry | undefined;
  await updateContent<Enquiry[]>(KEY, [], records => records.map(record => {
    if (record.id !== id) return record;
    if (!canAccess(record, user)) throw new Error('Enquiry not found or unauthorized');
    result = { ...mutate(record), updatedAt: new Date().toISOString() };
    return result;
  }));
  if (!result) throw new Error('Enquiry not found or unauthorized');
  return result;
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus, user: Actor): Promise<Enquiry> {
  if (!['new', 'contacted', 'in_progress', 'closed'].includes(status)) throw new Error('Invalid enquiry status');
  return mutateEnquiry(id, user, record => ({ ...record, status }));
}

export async function assignEnquiry(id: string, staffUserId: string, staffName: string, user: Actor): Promise<Enquiry> {
  if (user.role !== 'admin') throw new Error('Forbidden: Only administrators can assign enquiries');
  return mutateEnquiry(id, user, record => ({ ...record, assignedTo: staffUserId, assignedStaffName: staffName }));
}

export async function addEnquiryNote(id: string, noteText: string, user: Actor & { name: string }): Promise<EnquiryNote> {
  const note = noteText.trim();
  if (!note || note.length > 2000) throw new Error('Notes must contain 1 to 2000 characters');
  const newNote: EnquiryNote = { id: randomUUID(), enquiryId: id, staffUserId: user.id, staffName: user.name, note, createdAt: new Date().toISOString() };
  await mutateEnquiry(id, user, record => ({ ...record, notes: [...(record.notes || []), newNote] }));
  return newNote;
}
