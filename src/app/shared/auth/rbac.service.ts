import { Injectable } from '@angular/core';
import { ROLE_PERMISSIONS, type Role, type Permission } from './permissions';

@Injectable({
  providedIn: 'root'
})
export class RbacService {
  hasPermission(role: Role | undefined | null, permission: Permission): boolean {
    if (!role) return false;
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  }

  canAccessRoute(role: Role | undefined | null, requiredRoles?: Role[]): boolean {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (!role) return false;
    return requiredRoles.includes(role);
  }
}
