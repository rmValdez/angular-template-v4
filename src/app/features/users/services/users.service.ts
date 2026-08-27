import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectQuery, injectMutation, QueryClient } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { UserItem } from '../models/user.types';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  getUsersQuery() {
    return injectQuery(() => ({
      queryKey: ['users', 'list'],
      queryFn: () => firstValueFrom(this.http.get<UserItem[]>(ENDPOINTS.users.list))
    }));
  }

  updateRoleMutation() {
    return injectMutation(() => ({
      mutationFn: (payload: { userId: string; role: string }) =>
        firstValueFrom(this.http.patch<UserItem>(ENDPOINTS.users.updateRole(payload.userId), { role: payload.role })),
      onSuccess: (updatedUser: UserItem) => {
        this.queryClient.setQueryData<UserItem[]>(['users', 'list'], (old: UserItem[] | undefined) => {
          if (!old) return [updatedUser];
          return old.map(u => (u.id === updatedUser.id ? updatedUser : u));
        });
      }
    }));
  }
}
