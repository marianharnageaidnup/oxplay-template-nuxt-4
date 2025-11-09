/**
 * Production-Safe Logger
 * Provides environment-aware logging with sensitive data filtering
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Sanitizes data by removing sensitive fields
   */
  private sanitize(data: unknown): unknown {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sensitiveKeys = [
      'password',
      'token',
      'access_token',
      'refresh_token',
      'session_id',
      'token_id',
      'secret',
      'api_key',
      'apiKey',
      'authorization',
      'cookie',
      'csrf',
    ];

    const sanitized = { ...data } as Record<string, unknown>;

    for (const key of Object.keys(sanitized)) {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = this.sanitize(sanitized[key]);
      }
    }

    return sanitized;
  }

  /**
   * Formats log message with context
   */
  private format(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const sanitizedContext = context ? this.sanitize(context) : undefined;

    if (sanitizedContext && Object.keys(sanitizedContext).length > 0) {
      return `[${timestamp}] [${level.toUpperCase()}] ${message} ${JSON.stringify(sanitizedContext)}`;
    }

    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  /**
   * Debug logging - only in development
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(this.format('debug', message, context));
    }
  }

  /**
   * Info logging - always logged but sanitized
   */
  info(message: string, context?: LogContext): void {
    console.info(this.format('info', message, context));
  }

  /**
   * Warning logging - always logged but sanitized
   */
  warn(message: string, context?: LogContext): void {
    console.warn(this.format('warn', message, context));
  }

  /**
   * Error logging - always logged but sanitized
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = { ...context };

    if (error instanceof Error) {
      errorContext.errorMessage = error.message;
      errorContext.errorName = error.name;

      // Only include stack trace in development
      if (this.isDevelopment) {
        errorContext.stack = error.stack;
      }
    } else if (error) {
      errorContext.error = this.sanitize(error);
    }

    console.error(this.format('error', message, errorContext));
  }

  /**
   * API error logging - specialized for API errors
   */
  apiError(message: string, error: unknown, context?: LogContext): void {
    const apiContext: LogContext = { ...context };

    if (typeof error === 'object' && error !== null) {
      const err = error as Record<string, unknown>;

      apiContext.statusCode = err.statusCode;
      apiContext.statusMessage = err.statusMessage;

      // Don't log full error data in production (may contain sensitive info)
      if (this.isDevelopment) {
        apiContext.errorData = this.sanitize(err);
      }
    }

    this.error(message, error instanceof Error ? error : undefined, apiContext);
  }
}

// Export singleton instance
export const logger = new Logger();
