import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { injectSafeQuery, injectSafeMutation } from '../../../shared/query';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { PostItem, PostListSchema, PostItemSchema } from '../models/post.types';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  /**
   * Zod-validated query for fetching posts
   */
  getPostsQuery() {
    return injectSafeQuery(() => ({
      queryKey: ['posts', 'list'],
      queryFn: () => firstValueFrom(this.http.get<PostItem[]>(ENDPOINTS.posts.list)),
      schema: PostListSchema
    }));
  }

  /**
   * Zod-validated mutation for creating a post
   */
  createPostMutation() {
    return injectSafeMutation<PostItem, { title: string; content: string; author?: string; tags?: string[] }>(() => ({
      mutationFn: (payload) =>
        firstValueFrom(this.http.post<PostItem>(ENDPOINTS.posts.create, payload)),
      schema: PostItemSchema,
      onSuccess: (newPost: PostItem) => {
        this.queryClient.setQueryData<PostItem[]>(['posts', 'list'], (old: PostItem[] | undefined) => {
          if (!old) return [newPost];
          return [newPost, ...old];
        });
      }
    }));
  }

  /**
   * Zod-validated mutation for deleting a post
   */
  deletePostMutation() {
    return injectSafeMutation<{ success: boolean }, string>(() => ({
      mutationFn: async (id: string) => {
        await firstValueFrom(this.http.delete(ENDPOINTS.posts.delete(id)));
        return { success: true };
      },
      onSuccess: (_, deletedId: string) => {
        this.queryClient.setQueryData<PostItem[]>(['posts', 'list'], (old: PostItem[] | undefined) => {
          if (!old) return [];
          return old.filter(p => p.id !== deletedId);
        });
      }
    }));
  }
}
