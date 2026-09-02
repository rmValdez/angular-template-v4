import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { ThemeToggleComponent } from '../../../../shared/ui/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [CommonModule, RouterLink, LoginFormComponent, CardComponent, ThemeToggleComponent],
  template: `
    <div class="min-h-screen flex flex-col justify-center items-center p-4 bg-background relative overflow-hidden">
      <!-- Glow ambient background -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="absolute top-6 right-6">
        <app-theme-toggle />
      </div>

      <div class="w-full max-w-md space-y-6 z-10">
        <div class="text-center space-y-2">
          <div class="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary to-emerald-400 items-center justify-center text-primary-foreground shadow-lg mb-2">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <h1 class="text-2xl font-black tracking-tight text-foreground">
            Angular Master Template
          </h1>
          <p class="text-xs text-muted-foreground">
            Enterprise Angular 19+ Signals &amp; Standalone Starter
          </p>
        </div>

        <app-card className="border-border/80 shadow-xl bg-card/80 backdrop-blur-md p-6">
          <div class="mb-4">
            <h2 class="text-lg font-bold text-foreground">Sign In</h2>
            <p class="text-xs text-muted-foreground mt-0.5">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <app-login-form />

          <div class="flex justify-center border-t border-border/50 pt-4 mt-4 text-xs text-muted-foreground">
            Don't have an account?
            <a routerLink="/register" class="ml-1.5 font-semibold text-primary hover:underline">
              Create account
            </a>
          </div>
        </app-card>

        <div class="text-center text-[11px] text-muted-foreground/80 space-y-1">
          <p>Demo accounts: <span class="font-mono font-bold text-foreground">admin&#64;example.com</span> | <span class="font-mono font-bold text-foreground">user&#64;example.com</span></p>
          <p>Password: <span class="font-mono font-semibold">Password123!</span></p>
        </div>
      </div>
    </div>
  `
})
export class LoginViewComponent {}
