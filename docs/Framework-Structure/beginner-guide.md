# Beginner Guide to Angular 19 Standalone Architecture

Welcome to the **Angular 19 Master Template**! This guide is designed for engineers learning modern Angular Standalone Components, Angular Signals, and TanStack Angular Query.

---

## 1. Standalone Components

No `NgModule` required. Every component declares its own imports:

```ts
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-greeting',
  standalone: true,
  imports: [CommonModule],
  template: `<h1>Hello, {{ name() }}!</h1>`
})
export class GreetingComponent {
  readonly name = input<string>('Developer');
}
```

---

## 2. Modern Control Flow Syntax

Angular 19 introduces `@if` and `@for` template blocks:

```html
@if (authService.isAuthenticated()) {
  <div class="dashboard-shell">
    @for (item of items(); track item.id) {
      <p>{{ item.name }}</p>
    }
  </div>
} @else {
  <app-login-form />
}
```

---

## 3. Server State with TanStack Angular Query

```ts
import { injectQuery } from '@tanstack/angular-query-experimental';

export class DashboardService {
  getStats() {
    return injectQuery(() => ({
      queryKey: ['stats'],
      queryFn: () => fetch('/api/dashboard/stats').then(res => res.json())
    }));
  }
}
```
