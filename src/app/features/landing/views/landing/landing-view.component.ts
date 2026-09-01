import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { ThemeToggleComponent } from '../../../../shared/ui/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-landing-view',
  standalone: true,
  imports: [CommonModule, RouterLink, ThemeToggleComponent],
  template: `
    <div class="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      
      <!-- Top Navigation Bar -->
      <header class="border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <!-- Brand Logo -->
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <div>
              <span class="font-extrabold text-base tracking-tight leading-none block">RM ENTERPRISE</span>
              <span class="text-[10px] font-bold text-primary tracking-widest uppercase">Multi-Template Platform</span>
            </div>
          </div>

          <!-- Nav Actions -->
          <div class="flex items-center gap-4">
            <app-theme-toggle />
            
            @if (authService.isAuthenticated()) {
              <a
                routerLink="/dashboard"
                class="px-4 py-2 text-xs font-bold bg-primary text-primary-foreground rounded-xl shadow-md hover:opacity-90 transition-all flex items-center gap-2"
              >
                Go to Dashboard →
              </a>
            } @else {
              <a
                routerLink="/login"
                class="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
              >
                Sign In
              </a>
              <a
                routerLink="/register"
                class="px-4 py-2 text-xs font-bold bg-primary text-primary-foreground rounded-xl shadow-md hover:opacity-90 transition-all"
              >
                Get Started
              </a>
            }
          </div>
        </div>
      </header>

      <!-- Main Hero Section -->
      <main class="flex-1">
        <section class="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36 px-6">
          <!-- Background Glow Elements -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
          <div class="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

          <div class="max-w-5xl mx-auto text-center space-y-8">
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <span class="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              Angular 19 Standalone Signals • FAOS Architecture
            </div>

            <!-- Title -->
            <h1 class="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
              Enterprise Frontend Starter <br class="hidden sm:block" />
              <span class="bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                With Multi-Tenant Core
              </span>
            </h1>

            <!-- Subtitle -->
            <p class="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Production-grade architecture powered by Angular 19 Signals, TanStack Query, PostgreSQL Prisma ORM, and Realtime WebSockets.
            </p>

            <!-- Call to Actions -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                routerLink="/login"
                class="w-full sm:w-auto px-8 py-3.5 text-sm font-bold bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/25 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Sign In to Workspace
              </a>
              <a
                routerLink="/register"
                class="w-full sm:w-auto px-8 py-3.5 text-sm font-bold bg-card border border-border hover:bg-accent text-foreground rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Create Free Account
              </a>
            </div>

            <!-- Metrics Highlight -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16 max-w-4xl mx-auto">
              <div class="p-4 rounded-xl bg-card/60 backdrop-blur-sm border text-center space-y-1">
                <div class="text-2xl font-black text-foreground">Angular 19</div>
                <div class="text-xs text-muted-foreground font-medium">Standalone Signals</div>
              </div>
              <div class="p-4 rounded-xl bg-card/60 backdrop-blur-sm border text-center space-y-1">
                <div class="text-2xl font-black text-emerald-500">PostgreSQL</div>
                <div class="text-xs text-muted-foreground font-medium">Multi-Tenant Prisma</div>
              </div>
              <div class="p-4 rounded-xl bg-card/60 backdrop-blur-sm border text-center space-y-1">
                <div class="text-2xl font-black text-cyan-500">TanStack v5</div>
                <div class="text-xs text-muted-foreground font-medium">Optimistic Caching</div>
              </div>
              <div class="p-4 rounded-xl bg-card/60 backdrop-blur-sm border text-center space-y-1">
                <div class="text-2xl font-black text-primary">Socket.IO</div>
                <div class="text-xs text-muted-foreground font-medium">Realtime Telemetry</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Feature Grid -->
        <section class="py-20 bg-accent/20 border-t border-border/50 px-6">
          <div class="max-w-6xl mx-auto space-y-12">
            <div class="text-center space-y-2 max-w-2xl mx-auto">
              <span class="text-xs font-bold text-primary uppercase tracking-widest">Built For Scale</span>
              <h2 class="text-3xl font-black text-foreground">Comprehensive Architecture Features</h2>
              <p class="text-sm text-muted-foreground">Deterministic structure, isolated feature layers, and bulletproof security.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Feature 1 -->
              <div class="p-6 rounded-2xl bg-card border hover:border-primary/50 transition-all space-y-3 shadow-sm">
                <div class="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">⚡</div>
                <h3 class="text-lg font-bold text-foreground">Native Signals Reactivity</h3>
                <p class="text-xs text-muted-foreground leading-relaxed">
                  Zero RxJS boilerplate in UI views. <code>signal()</code>, <code>computed()</code>, and <code>effect()</code> handle high-frequency re-renders automatically.
                </p>
              </div>

              <!-- Feature 2 -->
              <div class="p-6 rounded-2xl bg-card border hover:border-primary/50 transition-all space-y-3 shadow-sm">
                <div class="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-lg">🏢</div>
                <h3 class="text-lg font-bold text-foreground">Enterprise Multi-Tenancy</h3>
                <p class="text-xs text-muted-foreground leading-relaxed">
                  Automatic <code>x-tenant-id</code> header propagation isolates data cleanly across Angular, Next.js, and Vue starters.
                </p>
              </div>

              <!-- Feature 3 -->
              <div class="p-6 rounded-2xl bg-card border hover:border-primary/50 transition-all space-y-3 shadow-sm">
                <div class="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold text-lg">🔒</div>
                <h3 class="text-lg font-bold text-foreground">Session-Based JWT Auth</h3>
                <p class="text-xs text-muted-foreground leading-relaxed">
                  Tokens are strictly contained within browser <code>sessionStorage</code> with automatic refresh token rotation and RBAC route guards.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="border-t border-border/40 py-8 px-6 text-center text-xs text-muted-foreground">
        <p>© 2026 RM Enterprise Multi-Template Ecosystem. All rights reserved.</p>
      </footer>
    </div>
  `
})
export class LandingPageViewComponent {
  readonly authService = inject(AuthService);
}
