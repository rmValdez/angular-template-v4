import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [CommonModule, CardComponent, BadgeComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-black tracking-tight text-foreground">
            Workspace Overview
          </h2>
          <p class="text-xs text-muted-foreground mt-0.5">
            Enterprise operational metrics, traffic analytics, and security telemetry
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Cluster Healthy
          </span>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-card className="p-6">
          <div class="flex items-center justify-between text-muted-foreground">
            <span class="text-xs font-semibold uppercase">Total Users</span>
            <div class="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">U</div>
          </div>
          <div class="text-2xl font-extrabold mt-3">
            {{ statsQuery.data()?.totalUsers?.toLocaleString() || '---' }}
          </div>
          <div class="text-xs text-emerald-500 font-semibold mt-1">
            +{{ statsQuery.data()?.usersGrowth }}% vs last month
          </div>
        </app-card>

        <app-card className="p-6">
          <div class="flex items-center justify-between text-muted-foreground">
            <span class="text-xs font-semibold uppercase">Active Sessions</span>
            <div class="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">S</div>
          </div>
          <div class="text-2xl font-extrabold mt-3">
            {{ statsQuery.data()?.activeSessions?.toLocaleString() || '---' }}
          </div>
          <div class="text-xs text-emerald-500 font-semibold mt-1">
            +{{ statsQuery.data()?.sessionsGrowth }}% vs last month
          </div>
        </app-card>

        <app-card className="p-6">
          <div class="flex items-center justify-between text-muted-foreground">
            <span class="text-xs font-semibold uppercase">Total Revenue</span>
            <div class="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">$</div>
          </div>
          <div class="text-2xl font-extrabold mt-3">
            \${{ statsQuery.data()?.totalRevenue?.toLocaleString() || '---' }}
          </div>
          <div class="text-xs text-emerald-500 font-semibold mt-1">
            +{{ statsQuery.data()?.revenueGrowth }}% vs last month
          </div>
        </app-card>

        <app-card className="p-6">
          <div class="flex items-center justify-between text-muted-foreground">
            <span class="text-xs font-semibold uppercase">API Health SLA</span>
            <div class="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">H</div>
          </div>
          <div class="text-2xl font-extrabold mt-3">
            {{ statsQuery.data()?.apiHealth || '99.9' }}%
          </div>
          <div class="text-xs text-muted-foreground mt-1">
            Target SLA: 99.9%
          </div>
        </app-card>
      </div>

      <!-- Live Telemetry & Activity Feed -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <app-card className="col-span-full lg:col-span-2 p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-foreground">System Performance &amp; Traffic</h3>
              <p class="text-xs text-muted-foreground">Monthly transaction volume and API activity</p>
            </div>
            <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
              <span class="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              Live Telemetry
            </span>
          </div>

          <div class="h-56 w-full flex items-end gap-3 pt-6 px-2">
            @for (val of [35, 48, 42, 60, 58, 75, 82, 90, 85, 95, 110, 125]; track $index) {
              <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                <div class="w-full rounded-t-md bg-primary/20 group-hover:bg-primary transition-all duration-300 relative" [style.height.%]="(val / 125) * 85"></div>
                <span class="text-[10px] text-muted-foreground font-mono">{{ $index + 1 }}m</span>
              </div>
            }
          </div>
        </app-card>

        <app-card className="col-span-full lg:col-span-1 p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-foreground">Audit &amp; Events</h3>
            <app-badge variant="outline">Realtime</app-badge>
          </div>

          <div class="space-y-3">
            @for (act of activityQuery.data(); track act.id) {
              <div class="p-3 rounded-lg bg-accent/30 flex items-start gap-3">
                <div class="h-8 w-8 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h4 class="text-xs font-bold text-foreground truncate">{{ act.title }}</h4>
                    <span class="text-[9px] text-muted-foreground">{{ act.timestamp }}</span>
                  </div>
                  <p class="text-[11px] text-muted-foreground mt-0.5">{{ act.description }}</p>
                </div>
              </div>
            }
          </div>
        </app-card>
      </div>
    </div>
  `
})
export class DashboardViewComponent {
  private readonly dashboardService = inject(DashboardService);

  readonly statsQuery = this.dashboardService.getStatsQuery();
  readonly activityQuery = this.dashboardService.getActivityQuery();
}
