/**
 * Server-side Constants
 * External API routes and other server constants
 */

export const API_ROUTES = {
  auth: {
    login: 'auth/login',
    register: 'auth/register',
    logout: 'auth/logout',
    user: 'auth/user',
    refresh: 'auth/refresh',
  },
} as const;

export const COOKIE_KEYS = {
  TOKEN_ID: 'token_id',
  SESSION_ID: 'session_id',
  ACCESS_TOKEN: 'access_token',
} as const;
