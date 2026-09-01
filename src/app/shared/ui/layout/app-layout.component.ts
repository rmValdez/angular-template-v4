import { Component, inject, signal } from '@angular/core';
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
      
      <!-- =================================================================== -->
      <!-- MOBILE TOP HEADER (md:hidden) -->
      <!-- =================================================================== -->
      <header class="md:hidden flex items-center justify-between px-4 h-16 border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-40">
        <!-- Logo -->
        <div class="flex items-center gap-2.5">
          <div class="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-primary-foreground shadow-sm">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <div>
            <span class="font-black text-xs tracking-tight block">ANGULAR MASTER</span>
            <span class="text-[9px] font-bold text-primary tracking-widest uppercase">Template v4</span>
          </div>
        </div>

        <!-- Right Controls: Theme + Hamburger -->
        <div class="flex items-center gap-2">
          <app-theme-toggle />
          <button
            type="button"
            (click)="toggleMobileMenu()"
            class="p-2 rounded-lg bg-accent text-foreground hover:bg-accent/80 transition-colors border border-border"
            title="Toggle Navigation Menu"
          >
            @if (isMobileMenuOpen()) {
              <!-- Close Icon -->
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            } @else {
              <!-- Hamburger Icon -->
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            }
          </button>
        </div>
      </header>

      <!-- =================================================================== -->
      <!-- MOBILE SLIDE-OUT DRAWER OVERLAY (md:hidden) -->
      <!-- =================================================================== -->
      @if (isMobileMenuOpen()) {
        <!-- Backdrop -->
        <div
          (click)="closeMobileMenu()"
          class="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
        ></div>

        <!-- Drawer Content -->
        <div class="md:hidden fixed inset-y-0 left-0 w-72 bg-card border-r border-border z-50 p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
          <div class="space-y-6">
            <!-- Brand -->
            <div class="flex items-center justify-between border-b pb-4">
              <div class="flex items-center gap-2.5">
                <div class="h-8 w-8 rounded-xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-primary-foreground shadow-md">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                </div>
                <div>
                  <span class="font-black text-xs tracking-tight block">ANGULAR MASTER</span>
                  <span class="text-[9px] font-bold text-primary tracking-widest uppercase">Template v4</span>
                </div>
              </div>
              <button
                (click)="closeMobileMenu()"
                class="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >✕</button>
            </div>

            <!-- Navigation Links -->
            <nav class="space-y-1.5">
              @for (item of activeNavItems(); track item.path) {
                <a
                  [routerLink]="item.path"
                  (click)="closeMobileMenu()"
                  routerLinkActive="bg-primary/10 text-primary font-semibold shadow-sm"
                  class="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                >
                  <span class="text-lg leading-none">{{ item.icon }}</span>
                  <span>{{ item.label }}</span>
                </a>
              }
            </nav>
          </div>

          <!-- Drawer Footer (User Info & Logout) -->
          <div class="pt-4 border-t border-border space-y-3">
            @if (authService.user(); as user) {
              <div class="flex items-center justify-between p-2.5 rounded-xl bg-accent/40">
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
                  class="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
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
        </div>
      }

      <!-- =================================================================== -->
      <!-- DESKTOP SIDEBAR (hidden on mobile, visible on md+) -->
      <!-- =================================================================== -->
      <aside class="hidden md:flex flex-col w-64 border-r border-border bg-card/60 backdrop-blur-xl shrink-0 p-4 justify-between sticky top-0 h-screen">
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

          <!-- Navigation (Modular & Configurable) -->
          <nav class="space-y-1">
            @for (item of activeNavItems(); track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="bg-primary/10 text-primary font-semibold shadow-sm"
                class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
              >
                <span class="text-base leading-none">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </a>
            }
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
      <main class="flex-1 flex flex-col min-w-0 max-w-full overflow-y-auto overflow-x-hidden w-full">
        <div class="p-3 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 min-w-0">
          <ng-content></ng-content>
        </div>
      </main>
    </div>
  `
})
export class AppLayoutComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Mobile menu reactive signal
  readonly isMobileMenuOpen = signal<boolean>(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(open => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  /**
   * ==========================================================================
   * MODULAR SIDEBAR NAVIGATION LINKS
   * (Comment out or toggle `enabled: false` on any line to disable instantly)
   * ==========================================================================
   */
  readonly navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', enabled: true },
    { path: '/users',     label: 'Users',     icon: '👥', enabled: true },
    { path: '/posts',     label: 'Posts',     icon: '📝', enabled: true },
    { path: '/sandbox',   label: 'Sandbox',   icon: '🏖️', enabled: true }, // <-- All living Docs & Labs are here!
  ];

  readonly activeNavItems = () => this.navItems.filter(item => item.enabled);

  onLogout(): void {
    this.closeMobileMenu();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
