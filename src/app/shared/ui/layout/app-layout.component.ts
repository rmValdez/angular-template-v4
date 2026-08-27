import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggleComponent],
  template: `
    <div class="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <!-- Desktop Sidebar -->
      <aside class="hidden md:flex flex-col w-64 border-r border-border bg-card/60 backdrop-blur-xl shrink-0 p-4 justify-between">
        <div class="space-y-6">
          <!-- Logo -->
          <div class="flex items-center gap-3 px-2 py-1">
            <div class="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-primary-foreground shadow-md">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <div>
              <h1 class="font-extrabold text-sm tracking-tight leading-none">ANGULAR MASTER</h1>
              <span class="text-[10px] font-semibold text-primary tracking-widest uppercase">Template v4</span>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="space-y-1">
            <a
              routerLink="/dashboard"
              routerLinkActive="bg-primary/10 text-primary font-semibold shadow-sm"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Dashboard
            </a>

            <a
              routerLink="/users"
              routerLinkActive="bg-primary/10 text-primary font-semibold shadow-sm"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Users
            </a>

            <a
              routerLink="/posts"
              routerLinkActive="bg-primary/10 text-primary font-semibold shadow-sm"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Posts
            </a>
          </nav>
        </div>

        <!-- Footer -->
        <div class="pt-4 border-t border-border space-y-3">
          <div class="flex items-center justify-between px-2">
            <span class="text-xs text-muted-foreground font-medium">Theme</span>
            <app-theme-toggle />
          </div>

          @if (authService.user(); as user) {
            <div class="flex items-center justify-between p-2 rounded-lg bg-accent/40">
              <div class="flex items-center gap-2.5 overflow-hidden">
                <div class="h-8 w-8 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                  {{ user.name.charAt(0) }}
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-semibold truncate">{{ user.name }}</p>
                  <p class="text-[10px] text-muted-foreground truncate uppercase font-mono">{{ user.role }}</p>
                </div>
              </div>
              <button
                type="button"
                title="Sign out"
                class="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                (click)="onLogout()"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          }
        </div>
      </aside>

      <!-- Main Container -->
      <main class="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div class="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          <ng-content></ng-content>
        </div>
      </main>
    </div>
  `
})
export class AppLayoutComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
