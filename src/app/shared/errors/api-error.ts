export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(params: {
    message: string;
    status?: number;
    code?: string;
    details?: unknown;
  }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status ?? 500;
    this.code = params.code ?? 'UNKNOWN_ERROR';
    this.details = params.details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static fromUnknown(error: unknown): ApiError {
    if (error instanceof ApiError) return error;

    if (error instanceof Error) {
      return new ApiError({
        message: error.message,
        code: 'CLIENT_ERROR'
      });
    }

    return new ApiError({
      message: typeof error === 'string' ? error : 'An unexpected error occurred.',
      code: 'UNKNOWN_ERROR'
    });
  }
}
