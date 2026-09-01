import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectQuery, injectMutation, QueryClient } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { ENDPOINTS } from '../../../shared/api/endpoints';

export interface AngularTopicItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  codeSnippet?: string;
  difficulty: string;
  isCompleted: boolean;
  likesCount: number;
  createdAt: string;
}

interface ApiResponse<T> {
  status: string;
  statusCode: number;
  data: T;
  message?: string;
}

interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class AngularTopicService {
  private readonly http = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  /**
   * TanStack Query for fetching topics
   */
  getTopicsQuery() {
    return injectQuery(() => ({
      queryKey: ['angular', 'topics'],
      queryFn: async () => {
        const res = await firstValueFrom(
          this.http.get<ApiResponse<PaginatedData<AngularTopicItem>>>(ENDPOINTS.angular.list)
        );
        return res.data;
      },
    }));
  }

  /**
   * TanStack Mutation for liking a topic
   */
  getLikeMutation() {
    return injectMutation(() => ({
      mutationFn: async (id: string) => {
        const res = await firstValueFrom(
          this.http.post<ApiResponse<AngularTopicItem>>(ENDPOINTS.angular.like(id), {})
        );
        return res.data;
      },
      onSuccess: () => {
        this.queryClient.invalidateQueries({ queryKey: ['angular', 'topics'] });
      },
    }));
  }
}
