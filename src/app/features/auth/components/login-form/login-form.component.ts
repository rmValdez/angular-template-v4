import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InputComponent],
  template: `
    <form class="space-y-4" (ngSubmit)="onSubmit()">
      <app-input
        label="Email Address"
        type="email"
        placeholder="admin@example.com"
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

      <div class="flex items-center gap-2 pt-1">
        <button
          type="button"
          class="flex-1 text-[11px] font-medium py-1.5 px-2.5 rounded-lg border border-border/80 bg-accent/30 hover:bg-accent hover:text-foreground text-muted-foreground transition-colors"
          (click)="fillDemo('admin@example.com', 'Password123!')"
        >
          Fill Admin Demo
        </button>
        <button
          type="button"
          class="flex-1 text-[11px] font-medium py-1.5 px-2.5 rounded-lg border border-border/80 bg-accent/30 hover:bg-accent hover:text-foreground text-muted-foreground transition-colors"
          (click)="fillDemo('user@example.com', 'Password123!')"
        >
          Fill Member Demo
        </button>
      </div>

      <app-button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full mt-2 font-semibold shadow-lg shadow-primary/20"
        [loading]="isSubmitting()"
      >
        Sign In
      </app-button>
    </form>
  `
})
export class LoginFormComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  readonly isSubmitting = signal<boolean>(false);
  readonly errorMessage = signal<string>('');

  fillDemo(email: string, pass: string): void {
    this.email = email;
    this.password = pass;
    this.errorMessage.set('');
  }

  async onSubmit(): Promise<void> {
    if (!this.email || !this.password) {
      this.errorMessage.set('Please enter both email and password.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.login({
        email: this.email,
        password: this.password
      });
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.errorMessage.set(err?.error?.message || err?.message || 'Authentication failed. Please check credentials.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
