/**
 * Cookie Management Composable
 * Securely manages authentication tokens and session using cookies
 */

export const useAuthCookie = () => {
  const TOKEN_ID_KEY = 'token_id';
  const SESSION_ID_KEY = 'session_id';

  /**
   * Set a cookie with secure settings
   */
  const setCookie = (name: string, value: string, days: number = 7) => {
    if (import.meta.client) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      const expires = `expires=${date.toUTCString()}`;
      const sameSite = 'SameSite=Strict';
      const secure = location.protocol === 'https:' ? 'Secure' : '';

      document.cookie = `${name}=${value}; ${expires}; ${sameSite}; ${secure}; Path=/`;
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
   * Set authentication tokens (token_id and session_id)
   */
  const setAuthTokens = (tokenId: string, sessionId: string) => {
    setCookie(TOKEN_ID_KEY, tokenId);
    setCookie(SESSION_ID_KEY, sessionId);
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
    getTokenId,
    getSessionId,
    removeAuthTokens,
    hasAuthTokens,
    setToken,
    getToken,
    removeToken,
  };
};
