import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';
import { AppLayoutComponent } from './shared/ui/layout/app-layout.component';
import { AuthService } from './features/auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppLayoutComponent],
  template: `
    @if (showLayout()) {
      <app-layout>
        <router-outlet></router-outlet>
      </app-layout>
    } @else {
      <router-outlet></router-outlet>
    }
  `
})
export class AppComponent {
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);

  // Reactive router URL tracking
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  readonly showLayout = computed(() => {
    // 1. If unauthenticated, NEVER show sidebar layout
    if (!this.authService.isAuthenticated()) {
      return false;
    }

    // 2. If on a public route, do not show sidebar layout
    const url = this.currentUrl();
    const isPublic =
      url === '/' ||
      url === '' ||
      url.startsWith('/landing') ||
      url.startsWith('/login') ||
      url.startsWith('/register');

    return !isPublic;
  });
}

