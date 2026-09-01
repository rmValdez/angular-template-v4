import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../../shared/api/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);

  // Headers to attach across requests
  const headers: Record<string, string> = {
    'x-tenant-id': 'angular-v4',
  };

  // 1. Handle Refresh Token Endpoint
  if (req.url.includes('/auth/refresh')) {
    const refreshToken = tokenService.getRefreshToken();
    if (refreshToken && !req.headers.has('Authorization')) {
      headers['Authorization'] = `Bearer ${refreshToken}`;
    }
    return next(req.clone({ setHeaders: headers }));
  }

  // 2. Attach standard Bearer Access Token to all other requests
  const accessToken = tokenService.getAccessToken();
  if (accessToken && !req.headers.has('Authorization')) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return next(req.clone({ setHeaders: headers }));
};
