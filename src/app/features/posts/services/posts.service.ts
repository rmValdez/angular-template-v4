import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectQuery, injectMutation, QueryClient } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { PostItem } from '../models/post.types';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  getPostsQuery() {
    return injectQuery(() => ({
      queryKey: ['posts', 'list'],
      queryFn: () => firstValueFrom(this.http.get<PostItem[]>(ENDPOINTS.posts.list))
    }));
  }

  createPostMutation() {
    return injectMutation(() => ({
      mutationFn: (payload: { title: string; content: string; author?: string; tags?: string[] }) =>
        firstValueFrom(this.http.post<PostItem>(ENDPOINTS.posts.create, payload)),
      onSuccess: (newPost: PostItem) => {
        this.queryClient.setQueryData<PostItem[]>(['posts', 'list'], (old: PostItem[] | undefined) => {
          if (!old) return [newPost];
          return [newPost, ...old];
        });
      }
    }));
  }

  deletePostMutation() {
    return injectMutation(() => ({
      mutationFn: (id: string) =>
        firstValueFrom(this.http.delete(ENDPOINTS.posts.delete(id))),
      onSuccess: (_, deletedId: string) => {
        this.queryClient.setQueryData<PostItem[]>(['posts', 'list'], (old: PostItem[] | undefined) => {
          if (!old) return [];
          return old.filter(p => p.id !== deletedId);
        });
      }
    }));
  }
}
