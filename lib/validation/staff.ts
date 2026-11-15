import { z } from 'zod';

export const createStaffSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  roleId: z.string().uuid(),
}).strict();

export const updateStaffSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('update_roles'), id: z.string().uuid(), roleIds: z.array(z.string().uuid()).min(1).max(20) }).strict(),
  z.object({ action: z.literal('toggle_status'), id: z.string().uuid(), status: z.enum(['active', 'inactive', 'on_leave', 'suspended']) }).strict(),
  z.object({ action: z.literal('resend_invite'), id: z.string().uuid() }).strict(),
]);

export const saveRoleSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(60).regex(/^[a-z][a-z0-9-]+$/),
  description: z.string().trim().max(500).default(''),
  permissionIds: z.array(z.string().uuid()).max(200).optional(),
  isActive: z.boolean().default(true),
}).strict();
