import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostsService } from '../../services/posts.service';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';

@Component({
  selector: 'app-posts-view',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, BadgeComponent, ButtonComponent, InputComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-black tracking-tight text-foreground">
            Articles &amp; Insights
          </h2>
          <p class="text-xs text-muted-foreground mt-0.5">
            Knowledge base, architecture documentation, and system updates
          </p>
        </div>

        <app-button variant="primary" size="md" (onClick)="showCreateModal.set(true)">
          New Article
        </app-button>
      </div>

      <!-- Posts Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (post of postsQuery.data(); track post.id) {
          <app-card className="flex flex-col justify-between p-6 hover:border-primary/40 transition-all">
            <div class="space-y-3">
              <div class="flex items-start justify-between gap-2">
                <h3 class="text-lg font-bold leading-snug">{{ post.title }}</h3>
                <button
                  type="button"
                  title="Delete post"
                  class="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                  (click)="deletePost(post.id)"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>

              <div class="text-xs text-muted-foreground flex items-center gap-3">
                <span>By {{ post.author }}</span>
                <span>•</span>
                <span>{{ post.createdAt | date:'mediumDate' }}</span>
              </div>

              <p class="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {{ post.content }}
              </p>
            </div>

            <div class="flex items-center justify-between border-t border-border/40 pt-3 mt-4">
              <div class="flex flex-wrap gap-1.5">
                @for (tag of post.tags; track tag) {
                  <app-badge variant="secondary" className="text-[10px]">#{{ tag }}</app-badge>
                }
              </div>
              <span class="text-xs font-semibold text-primary">Read →</span>
            </div>
          </app-card>
        }
      </div>

      <!-- Modal Creation Simple Overlay -->
      @if (showCreateModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" (click)="showCreateModal.set(false)">
          <div class="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4" (click)="$event.stopPropagation()">
            <h3 class="text-lg font-bold">Publish New Article</h3>

            <form class="space-y-4" (ngSubmit)="onCreatePost()">
              <app-input
                label="Article Title"
                placeholder="e.g. Modern Angular 19 Architecture Patterns"
                [(ngModel)]="newTitle"
                name="title"
              />

              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-foreground/80">Content</label>
                <textarea
                  rows="4"
                  [(ngModel)]="newContent"
                  name="content"
                  placeholder="Write your article content here..."
                  class="flex w-full rounded-lg border border-input bg-background/50 px-3.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                ></textarea>
              </div>

              <app-input
                label="Tags (comma separated)"
                placeholder="angular, signals, typescript"
                [(ngModel)]="newTags"
                name="tags"
              />

              <div class="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <app-button variant="outline" size="sm" type="button" (onClick)="showCreateModal.set(false)">Cancel</app-button>
                <app-button variant="primary" size="sm" type="submit" [loading]="createMutation.isPending()">Publish</app-button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class PostsViewComponent {
  private readonly postsService = inject(PostsService);

  readonly postsQuery = this.postsService.getPostsQuery();
  readonly createMutation = this.postsService.createPostMutation();
  readonly deleteMutation = this.postsService.deletePostMutation();

  readonly showCreateModal = signal<boolean>(false);

  newTitle = '';
  newContent = '';
  newTags = 'angular19, signals';

  onCreatePost(): void {
    if (!this.newTitle || !this.newContent) return;

    const tags = this.newTags.split(',').map(t => t.trim()).filter(Boolean);
    this.createMutation.mutate(
      {
        title: this.newTitle,
        content: this.newContent,
        author: 'Admin',
        tags
      },
      {
        onSuccess: () => {
          this.newTitle = '';
          this.newContent = '';
          this.showCreateModal.set(false);
        }
      }
    );
  }

  deletePost(id: string): void {
    this.deleteMutation.mutate(id);
  }
}
