import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/landing/views/landing/landing-view.component').then(
        m => m.LandingPageViewComponent
      )
  },
  {
    path: 'landing',
    loadComponent: () =>
      import('./features/landing/views/landing/landing-view.component').then(
        m => m.LandingPageViewComponent
      )
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/views/login/login-view.component').then(
        m => m.LoginViewComponent
      )
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/views/register/register-view.component').then(
        m => m.RegisterViewComponent
      )
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/views/dashboard/dashboard-view.component').then(
        m => m.DashboardViewComponent
      )
  },
  {
    path: 'users',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/user/views/users/users-view.component').then(
        m => m.UsersViewComponent
      )
  },
  {
    path: 'sandbox',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/sandbox/views/sandbox/sandbox-view.component').then(
        m => m.SandboxViewComponent
      )
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
