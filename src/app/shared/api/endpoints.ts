export const API_BASE_URL = 'http://localhost:3002/api/v1';

export const ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    me: `${API_BASE_URL}/users/me`,
    refresh: `${API_BASE_URL}/auth/refresh-token`,
    logout: `${API_BASE_URL}/auth/logout`
  },
  users: {
    list: `${API_BASE_URL}/users`,
    detail: (id: string | number) => `${API_BASE_URL}/users/${id}`,
    updateRole: (id: string | number) => `${API_BASE_URL}/users/${id}/role`
  },
  posts: {
    list: `${API_BASE_URL}/posts`,
    create: `${API_BASE_URL}/posts`,
    delete: (id: string | number) => `${API_BASE_URL}/posts/${id}`
  },
  dashboard: {
    stats: `${API_BASE_URL}/dashboard/stats`,
    activity: `${API_BASE_URL}/dashboard/activity`
  },
  angular: {
    list: `${API_BASE_URL}/angular`,
    detail: (slug: string) => `${API_BASE_URL}/angular/${slug}`,
    like: (id: string) => `${API_BASE_URL}/angular/${id}/like`,
    create: `${API_BASE_URL}/angular`
  }
} as const;
