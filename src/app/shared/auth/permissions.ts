export type Role = 'admin' | 'manager' | 'member' | 'guest';

export type Permission =
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:delete'
  | 'posts:read'
  | 'posts:create'
  | 'posts:delete'
  | 'dashboard:view'
  | 'settings:manage';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'users:read',
    'users:create',
    'users:update',
    'users:delete',
    'posts:read',
    'posts:create',
    'posts:delete',
    'dashboard:view',
    'settings:manage'
  ],
  manager: [
    'users:read',
    'posts:read',
    'posts:create',
    'posts:delete',
    'dashboard:view'
  ],
  member: [
    'posts:read',
    'posts:create',
    'dashboard:view'
  ],
  guest: [
    'posts:read'
  ]
};
