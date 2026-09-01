import { Injectable, signal } from '@angular/core';

const ACCESS_TOKEN_KEY = 'angular_template_access_token';
const REFRESH_TOKEN_KEY = 'angular_template_refresh_token';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly _hasToken = signal<boolean>(false);
  public readonly hasToken = this._hasToken.asReadonly();

  constructor() {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
      this._hasToken.set(!!token);
    }
  }

  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setTokens(accessToken: string, refreshToken?: string): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      if (refreshToken) {
        sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
      this._hasToken.set(true);
    }
  }

  clearTokens(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
      this._hasToken.set(false);
    }
  }
}
