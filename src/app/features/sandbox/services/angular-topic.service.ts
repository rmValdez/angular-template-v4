import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { injectSafeQuery, injectSafeMutation } from '../../../shared/query';
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
   * Zod-validated Query for fetching topics
   */
  getTopicsQuery() {
    return injectSafeQuery<PaginatedData<AngularTopicItem>>(() => ({
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
   * Zod-validated Mutation for liking a topic
   */
  getLikeMutation() {
    return injectSafeMutation<AngularTopicItem, string>(() => ({
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
