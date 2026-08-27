import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { DashboardStats, ActivityItem } from '../models/dashboard.types';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);

  getStatsQuery() {
    return injectQuery(() => ({
      queryKey: ['dashboard', 'stats'],
      queryFn: () => firstValueFrom(this.http.get<DashboardStats>(ENDPOINTS.dashboard.stats))
    }));
  }

  getActivityQuery() {
    return injectQuery(() => ({
      queryKey: ['dashboard', 'activity'],
      queryFn: () => firstValueFrom(this.http.get<ActivityItem[]>(ENDPOINTS.dashboard.activity))
    }));
  }
}
