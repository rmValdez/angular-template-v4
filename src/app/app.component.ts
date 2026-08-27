import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AppLayoutComponent } from './shared/ui/layout/app-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppLayoutComponent],
  template: `
    @if (isAuthRoute()) {
      <router-outlet></router-outlet>
    } @else {
      <app-layout>
        <router-outlet></router-outlet>
      </app-layout>
    }
  `
})
export class AppComponent {
  private readonly router = inject(Router);

  readonly isAuthRoute = computed(() => {
    const url = this.router.url;
    return url.includes('/login') || url.includes('/register');
  });
}
