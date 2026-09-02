import { z } from 'zod';

export const UserRoleSchema = z.preprocess((val) => {
  if (typeof val === 'string') {
    const raw = val.toLowerCase().trim();
    if (raw === 'super_admin' || raw === 'admin') return 'admin';
    if (raw === 'manager') return 'manager';
    if (raw === 'developer') return 'admin';
    if (raw === 'user' || raw === 'member') return 'member';
    if (raw === 'guest' || raw === 'viewer') return 'guest';
  }
  return val;
}, z.enum(['admin', 'manager', 'member', 'guest'] as const));
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserStatusSchema = z.preprocess((val) => {
  if (typeof val === 'boolean') return val ? 'active' : 'inactive';
  if (typeof val === 'string') return val.toLowerCase();
  return 'active';
}, z.enum(['active', 'inactive', 'pending'] as const));
export type UserStatus = z.infer<typeof UserStatusSchema>;

export const UserItemSchema = z.object({
  id: z.string(),
  name: z.string().nullable().transform(val => val || 'User'),
  email: z.string().email(),
  role: UserRoleSchema,
  status: UserStatusSchema.default('active'),
  avatar: z.string().optional(),
  createdAt: z.string().optional().default(() => new Date().toISOString()),
  permissions: z.array(z.string()).default([])
});

export type UserItem = z.infer<typeof UserItemSchema>;

export const UserListSchema = z.array(UserItemSchema);
