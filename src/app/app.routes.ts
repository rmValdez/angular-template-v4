import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
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
      import('./features/users/views/users/users-view.component').then(
        m => m.UsersViewComponent
      )
  },
  {
    path: 'posts',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/posts/views/posts/posts-view.component').then(
        m => m.PostsViewComponent
      )
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
