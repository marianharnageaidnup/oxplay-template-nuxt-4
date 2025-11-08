/**
 * Cookie Management Composable
 * Securely manages authentication tokens and session using cookies
 */

import { SESSION_ID_KEY, TOKEN_ID_KEY, ACCESS_TOKEN_KEY } from '~/constants/constants';

export interface CookieOptions {
  expiresInSeconds?: number;
  days?: number;
}

export const useAuthCookie = () => {
  /**
   * Set a cookie with secure settings
   * @param name - Cookie name
   * @param value - Cookie value
   * @param options - Cookie options (expiresInSeconds takes precedence over days)
   */
  const setCookie = (name: string, value: string, options: CookieOptions = {}) => {
    if (import.meta.client) {
      const date = new Date();

      // If expiresInSeconds is provided, use it; otherwise use days (default 7)
      if (options.expiresInSeconds) {
        date.setTime(date.getTime() + options.expiresInSeconds * 1000);
      } else {
        const days = options.days ?? 7;
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      }

      const expires = date.toUTCString();
      const secure = location.protocol === 'https:' ? 'Secure; ' : '';

      document.cookie = `${name}=${value}; expires=${expires}; ${secure}SameSite=Lax; Path=/`;
    }
  };

  /**
   * Get a cookie value by name
   */
  const getCookie = (name: string): string | null => {
    if (!import.meta.client) {
      return null;
    }

    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length);
      }
    }

    return null;
  };

  /**
   * Remove a cookie by name
   */
  const removeCookie = (name: string) => {
    if (import.meta.client) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/;`;
    }
  };

  /**
   * Set authentication tokens (access_token, token_id and session_id)
   * @param accessToken - JWT access token
   * @param tokenId - Token ID from user object
   * @param sessionId - Session ID from user object
   * @param expiresIn - Token expiration time in seconds (for access_token)
   */
  const setAuthTokens = (
    accessToken: string,
    tokenId: string,
    sessionId: string,
    expiresIn?: number,
  ) => {
    // Set access_token with expiresIn if provided, otherwise use default (7 days)
    setCookie(ACCESS_TOKEN_KEY, accessToken, expiresIn ? { expiresInSeconds: expiresIn } : {});

    // Set token_id and session_id with 30 days validity
    setCookie(TOKEN_ID_KEY, tokenId, { days: 30 });
    setCookie(SESSION_ID_KEY, sessionId, { days: 30 });
  };

  /**
   * Get access_token from cookie
   */
  const getAccessToken = (): string | null => {
    return getCookie(ACCESS_TOKEN_KEY);
  };

  /**
   * Get token_id from cookie
   */
  const getTokenId = (): string | null => {
    return getCookie(TOKEN_ID_KEY);
  };

  /**
   * Get session_id from cookie
   */
  const getSessionId = (): string | null => {
    return getCookie(SESSION_ID_KEY);
  };

  /**
   * Remove all authentication cookies
   */
  const removeAuthTokens = () => {
    removeCookie(ACCESS_TOKEN_KEY);
    removeCookie(TOKEN_ID_KEY);
    removeCookie(SESSION_ID_KEY);
  };

  /**
   * Check if user has valid auth cookies
   */
  const hasAuthTokens = (): boolean => {
    return !!(getTokenId() && getSessionId());
  };

  const setToken = (token: string) => {
    setCookie(TOKEN_ID_KEY, token);
  };

  const getToken = (): string | null => {
    return getTokenId();
  };

  const removeToken = () => {
    removeAuthTokens();
  };

  return {
    setAuthTokens,
    getAccessToken,
    getTokenId,
    getSessionId,
    removeAuthTokens,
    hasAuthTokens,
    setToken,
    getToken,
    removeToken,
  };
};
