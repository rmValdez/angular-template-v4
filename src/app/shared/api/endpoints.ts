import { environment } from '../../../environments/environment';

// Sourced from src/environments/ — dev points at nuxt-template-v2 (the
// shared local auth backend for this template and vue-template-v3);
// production requires a real API origin (see environment.ts).
export const API_BASE_URL = environment.apiBaseUrl;

export const ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    me: `${API_BASE_URL}/auth/me`,
    refresh: `${API_BASE_URL}/auth/refresh`,
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
  quiz: {
    list: `${API_BASE_URL}/quiz`,
    progress: `${API_BASE_URL}/quiz/progress`,
    reset: `${API_BASE_URL}/quiz/progress/reset`
  }
} as const;
