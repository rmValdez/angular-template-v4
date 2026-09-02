import { ApiError } from './api-error';

export type ErrorAction = 'toast' | 'silent' | 'modal' | 'redirect';

/**
 * Centralized Error Router for Angular 19
 * Routes API & Zod validation errors to appropriate UI handlers
 */
export function routeError(
  error: unknown,
  options: { action?: ErrorAction; customMessage?: string } = {}
): void {
  const { action = 'toast', customMessage } = options;
  const apiError = ApiError.fromUnknown(error);
  const displayMsg = customMessage || apiError.message;

  if (action === 'silent') return;

  if (apiError.status === 401) {
    console.warn('[Auth Error] Session invalid or expired:', displayMsg);
    return;
  }

  if (action === 'toast') {
    console.error(`[API Error]: ${displayMsg}`);
  }
}
