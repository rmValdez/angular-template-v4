import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { ThemeToggleComponent } from '../../../../shared/ui/theme-toggle/theme-toggle.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CardComponent, ButtonComponent, InputComponent, ThemeToggleComponent],
  template: `
    <div class="min-h-screen flex flex-col justify-center items-center p-4 bg-background relative overflow-hidden">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

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
            Create Account
          </h1>
          <p class="text-xs text-muted-foreground">
            Get started with your enterprise Angular workspace
          </p>
        </div>

        <app-card className="border-border/80 shadow-xl bg-card/80 backdrop-blur-md p-6">
          <form class="space-y-4" (ngSubmit)="onRegister()">
            <app-input
              label="Full Name"
              placeholder="Jane Doe"
              [(ngModel)]="name"
              name="name"
              [disabled]="isSubmitting()"
            />

            <app-input
              label="Email Address"
              type="email"
              placeholder="jane@example.com"
              [(ngModel)]="email"
              name="email"
              [disabled]="isSubmitting()"
            />

            <app-input
              label="Password"
              type="password"
              placeholder="••••••••"
              [(ngModel)]="password"
              name="password"
              [disabled]="isSubmitting()"
            />

            @if (errorMessage()) {
              <div class="p-2.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium">
                {{ errorMessage() }}
              </div>
            }

            <app-button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2 font-semibold shadow-lg shadow-primary/20"
              [loading]="isSubmitting()"
            >
              Sign Up
            </app-button>
          </form>

          <div class="flex justify-center border-t border-border/50 pt-4 mt-4 text-xs text-muted-foreground">
            Already have an account?
            <a routerLink="/login" class="ml-1.5 font-semibold text-primary hover:underline">
              Sign in
            </a>
          </div>
        </app-card>
      </div>
    </div>
  `
})
export class RegisterViewComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  name = '';
  email = '';
  password = '';
  readonly isSubmitting = signal<boolean>(false);
  readonly errorMessage = signal<string>('');

  async onRegister(): Promise<void> {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage.set('All fields are required.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.register({
        name: this.name,
        email: this.email,
        password: this.password
      });
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.errorMessage.set(err?.error?.message || err?.message || 'Registration failed.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
