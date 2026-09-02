import { injectMutation } from '@tanstack/angular-query-experimental';
import { z } from 'zod';
import { ApiError } from '../errors/api-error';
import { routeError, type ErrorAction } from '../errors/error-router';

export interface SafeMutationOptions<TData, TVariables, TSchema extends z.ZodTypeAny = z.ZodTypeAny> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  schema?: TSchema;
  errorAction?: ErrorAction;
  onSuccess?: (data: TData, variables: TVariables, context: unknown) => unknown;
  onError?: (error: ApiError, variables: TVariables, context: unknown) => unknown;
  onSettled?: (data: TData | undefined, error: ApiError | null, variables: TVariables, context: unknown) => unknown;
}

/**
 * Type-Safe TanStack Angular Mutation with runtime Zod schema validation
 * and centralized error routing.
 */
export function injectSafeMutation<TData, TVariables = void, TSchema extends z.ZodTypeAny = z.ZodTypeAny>(
  optionsFn: () => SafeMutationOptions<TData, TVariables, TSchema>
) {
  return injectMutation(() => {
    const opts = optionsFn();
    const { mutationFn, schema, errorAction = 'toast', ...rest } = opts;

    return {
      mutationFn: async (variables: TVariables) => {
        try {
          const rawData = await mutationFn(variables);
          if (schema) {
            const parsed = schema.safeParse(rawData);
            if (!parsed.success) {
              console.error('[Zod Mutation Schema Validation Failure]', parsed.error.format());
              throw new ApiError({
                message: 'Mutation response failed runtime schema validation.',
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
