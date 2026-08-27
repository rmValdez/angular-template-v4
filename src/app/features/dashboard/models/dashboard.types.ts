export interface DashboardStats {
  totalUsers: number;
  usersGrowth: number;
  activeSessions: number;
  sessionsGrowth: number;
  totalRevenue: number;
  revenueGrowth: number;
  apiHealth: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
