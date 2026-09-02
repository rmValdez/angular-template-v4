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

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: UserRoleSchema,
  avatar: z.string().optional(),
  permissions: z.array(z.string()).default([])
});

export type User = z.infer<typeof UserSchema>;

export const LoginResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
  refreshToken: z.string().optional()
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export interface AuthApiResponse<T> {
  status?: string;
  statusCode?: number;
  message?: string;
  data?: T;
}
