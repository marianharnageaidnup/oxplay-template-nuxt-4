/**
 * Error Types
 * Proper TypeScript types for error handling
 */

/**
 * Standard API Error from $fetch
 */
export interface ApiError {
  statusCode?: number;
  statusMessage?: string;
  message?: string;
  data?: {
    message?: string;
    errors?: Record<string, string[]>;
  };
}

/**
 * Type guard to check if error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('statusCode' in error || 'message' in error || 'data' in error)
  );
}

/**
 * Extracts error message from various error types
 */
export function getErrorMessage(error: unknown, defaultMessage = 'An error occurred'): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (isApiError(error)) {
    return error.data?.message || error.message || defaultMessage;
  }

  if (typeof error === 'string') {
    return error;
  }

  return defaultMessage;
}

/**
 * Extracts validation errors from API error
 */
export function getValidationErrors(error: unknown): Record<string, string[]> | undefined {
  if (isApiError(error)) {
    return error.data?.errors;
  }
  return undefined;
}
