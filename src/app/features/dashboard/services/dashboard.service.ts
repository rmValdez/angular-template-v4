import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { injectSafeQuery } from '../../../shared/query';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import {
  DashboardStats,
  DashboardStatsSchema,
  ActivityItem,
  ActivityListSchema
} from '../models/dashboard.types';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);

  getStatsQuery() {
    return injectSafeQuery<DashboardStats>(() => ({
      queryKey: ['dashboard', 'stats'],
      queryFn: () => firstValueFrom(this.http.get<DashboardStats>(ENDPOINTS.dashboard.stats)),
      schema: DashboardStatsSchema
    }));
  }

  getActivityQuery() {
    return injectSafeQuery<ActivityItem[]>(() => ({
      queryKey: ['dashboard', 'activity'],
      queryFn: () => firstValueFrom(this.http.get<ActivityItem[]>(ENDPOINTS.dashboard.activity)),
      schema: ActivityListSchema
    }));
  }
}
