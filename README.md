<div align="center">
  <img src="https://angular.dev/assets/images/press-kit/angular_icon_gradient.gif" alt="Angular Logo" width="120" height="120" />
  <h1>Angular 19 Master Template</h1>
  <p>An enterprise-grade, opinionated Angular starter template featuring Standalone Components, Signals, TanStack Angular Query, and Tailwind CSS.</p>
</div>

---

## ✨ Features & Architecture

- **Framework**: [Angular 19](https://angular.dev/) (Standalone Components, Signals, modern control flow `@if` / `@for`)
- **Server State**: [TanStack Angular Query v5](https://tanstack.com/query/latest/docs/framework/angular/overview) (`@tanstack/angular-query-experimental`)
- **Client State**: Angular Signals (`signal()`, `computed()`, `effect()`) + `TokenService`
- **UI & Styling**: [Tailwind CSS v3.4](https://tailwindcss.com/) with HSL design tokens & dark/light theme switching
- **Authentication**: JWT Access & Refresh token management with functional HTTP interceptors (`authInterceptor`)
- **Connected Backend**: Pre-configured to communicate with the Nuxt 3 Nitro auth backend (`http://localhost:3000/api`)
- **Package Manager**: `pnpm` (`packageManager: "pnpm@9.15.9"`)

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start Angular Development Server
```bash
pnpm dev
```
Navigate to `http://localhost:4200/`.

### 3. Build Production Application
```bash
pnpm build
```
Optimized output will be generated in `dist/angular-template-v4/browser`.