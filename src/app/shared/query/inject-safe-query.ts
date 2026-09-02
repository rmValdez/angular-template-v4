import { injectQuery, type QueryKey } from '@tanstack/angular-query-experimental';
import { z } from 'zod';
import { ApiError } from '../errors/api-error';
import { routeError, type ErrorAction } from '../errors/error-router';

export interface SafeQueryOptions<TData, TSchema extends z.ZodTypeAny = z.ZodTypeAny> {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  schema?: TSchema;
  errorAction?: ErrorAction;
  enabled?: boolean | (() => boolean);
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
}

/**
 * Type-Safe TanStack Angular Query with runtime Zod schema validation
 * and centralized error routing.
 */
export function injectSafeQuery<TData, TSchema extends z.ZodTypeAny = z.ZodTypeAny>(
  optionsFn: () => SafeQueryOptions<TData, TSchema>
) {
  return injectQuery(() => {
    const opts = optionsFn();
    const { queryKey, queryFn, schema, errorAction = 'toast', ...rest } = opts;

    return {
      queryKey,
      queryFn: async () => {
        try {
          const rawData = await queryFn();
          if (schema) {
            const parsed = schema.safeParse(rawData);
            if (!parsed.success) {
              console.error('[Zod Query Schema Validation Failure]', parsed.error.format());
              throw new ApiError({
                message: 'API response failed runtime schema validation.',
                code: 'SCHEMA_VALIDATION_ERROR',
                details: parsed.error.issues
              });
            }
            return parsed.data;
          }
          return rawData;
        } catch (error) {
          routeError(error, { action: errorAction });
          throw ApiError.fromUnknown(error);
        }
      },
      ...rest
    };
  });
}
