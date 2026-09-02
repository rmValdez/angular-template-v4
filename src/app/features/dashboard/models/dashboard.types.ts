import { z } from 'zod';

export const DashboardStatsSchema = z.object({
  totalUsers: z.number(),
  usersGrowth: z.number(),
  activeSessions: z.number(),
  sessionsGrowth: z.number(),
  totalRevenue: z.number(),
  revenueGrowth: z.number(),
  apiHealth: z.number()
});

export type DashboardStats = z.infer<typeof DashboardStatsSchema>;

export const ActivityItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  timestamp: z.string(),
  type: z.enum(['success', 'info', 'warning', 'error'])
});

export type ActivityItem = z.infer<typeof ActivityItemSchema>;

export const ActivityListSchema = z.array(ActivityItemSchema);
