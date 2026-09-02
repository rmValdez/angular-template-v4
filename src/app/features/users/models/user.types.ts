import { z } from 'zod';

export const UserRoleSchema = z.enum(['admin', 'manager', 'member', 'guest']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserStatusSchema = z.enum(['active', 'inactive', 'pending']);
export type UserStatus = z.infer<typeof UserStatusSchema>;

export const UserItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: UserRoleSchema,
  status: UserStatusSchema,
  avatar: z.string().optional(),
  createdAt: z.string()
});

export type UserItem = z.infer<typeof UserItemSchema>;

export const UserListSchema = z.array(UserItemSchema);
