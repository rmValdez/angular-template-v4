import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { injectSafeQuery, injectSafeMutation } from '../../../shared/query';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { UserItem, UserListSchema, UserItemSchema } from '../models/user.types';

interface UsersResponseEnvelope {
  data?: {
    items?: unknown[];
    users?: unknown[];
  };
  items?: unknown[];
  users?: unknown[];
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  /**
   * Zod-validated query for fetching users
   */
  getUsersQuery() {
    return injectSafeQuery(() => ({
      queryKey: ['users', 'list'],
      queryFn: async () => {
        const res = await firstValueFrom(this.http.get<UsersResponseEnvelope>(ENDPOINTS.users.list));
        return (res?.data?.items ?? res?.data?.users ?? res?.items ?? res?.users ?? res?.data ?? res ?? []) as UserItem[];
      },
      schema: UserListSchema
    }));
  }

  /**
   * Zod-validated mutation for updating a user's role
   */
  updateRoleMutation() {
    return injectSafeMutation<UserItem, { userId: string; role: string }>(() => ({
      mutationFn: (payload) =>
        firstValueFrom(this.http.patch<UserItem>(ENDPOINTS.users.updateRole(payload.userId), { role: payload.role })),
      schema: UserItemSchema,
      onSuccess: (updatedUser: UserItem) => {
        this.queryClient.setQueryData<UserItem[]>(['users', 'list'], (old: UserItem[] | undefined) => {
          if (!old) return [updatedUser];
          return old.map(u => (u.id === updatedUser.id ? updatedUser : u));
        });
      }
    }));
  }
}
