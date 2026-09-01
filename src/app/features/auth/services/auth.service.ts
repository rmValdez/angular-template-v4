import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TokenService } from '../../../shared/api/token.service';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { User, LoginResponse } from '../models/auth.types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);

  readonly user = signal<User | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly isAuthenticated = computed(() => !!this.user() && this.tokenService.hasToken());

  constructor() {
    this.initAuth();
  }

  async initAuth(): Promise<void> {
    if (this.tokenService.getAccessToken()) {
      try {
        this.isLoading.set(true);
        const res = await firstValueFrom(
          this.http.get<any>(ENDPOINTS.auth.me)
        );
        const userProfile = res?.data || res;
        this.user.set(userProfile);
      } catch {
        this.logout();
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  async login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    this.isLoading.set(true);
    try {
      const res = await firstValueFrom(
        this.http.post<any>(ENDPOINTS.auth.login, credentials)
      );
      const response: LoginResponse = res?.data || res;

      this.tokenService.setTokens(response.accessToken, response.refreshToken);
      this.user.set(response.user);
      return response;
    } finally {
      this.isLoading.set(false);
    }
  }

  async register(credentials: { name: string; email: string; password: string }): Promise<LoginResponse> {
    this.isLoading.set(true);
    try {
      const res = await firstValueFrom(
        this.http.post<any>(ENDPOINTS.auth.register, {
          ...credentials,
          username: credentials.email.split('@')[0] || credentials.name.toLowerCase().replace(/\s+/g, '')
        })
      );
      const response: LoginResponse = res?.data || res;

      this.tokenService.setTokens(response.accessToken, response.refreshToken);
      this.user.set(response.user);
      return response;
    } finally {
      this.isLoading.set(false);
    }
  }

  logout(): void {
    this.tokenService.clearTokens();
    this.user.set(null);
  }
}
