import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../shared/api/token.service';

export const authGuard: CanActivateFn = (_route, _state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.hasToken() || !!tokenService.getAccessToken()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

export const guestGuard: CanActivateFn = (_route, _state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.hasToken() || !!tokenService.getAccessToken()) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
