/**
 * API Interceptor Plugin
 * Adds custom headers to all $fetch requests globally
 * Handles automatic token refresh on 401 errors
 * Uses nuxt-auth-utils session for authentication token
 */

import { logger } from '~/utils/logger';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const nuxtApp = useNuxtApp();
  const originalFetch = globalThis.$fetch;

  // Track if we're currently refreshing to prevent multiple refresh calls
  let isRefreshing = false;
  let refreshPromise: Promise<boolean> | null = null;

  /**
   * Refresh the access token
   */
  const refreshAccessToken = async (): Promise<boolean> => {
    // If already refreshing, wait for the existing refresh to complete
    if (isRefreshing && refreshPromise) {
      return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = (async () => {
      try {
        logger.debug('Attempting to refresh access token');

        // Call the refresh endpoint
        const response = await originalFetch('/api/auth/refresh', {
          method: 'POST',
        });

        if (response?.success) {
          logger.debug('Token refreshed successfully');
          return true;
        }

        logger.warn('Token refresh failed', { response });
        return false;
      } catch (error) {
        logger.error('Token refresh error', error);
        return false;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  };

  globalThis.$fetch = new Proxy(originalFetch, {
    async apply(target, thisArg, args) {
      const locale = nuxtApp.$i18n?.locale?.value || 'en';
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
      const domainId = String(config.public.domainId || '1');
      const [url, options = {}] = args;

      const headers = (options.headers = options.headers || {}) as Record<string, string>;

      headers['IDNC-APP'] = '0';
      headers['IDNC-LANGUAGE'] = locale;
      headers['IDNC-ISMOBILE'] = isMobile ? '1' : '0';
      headers['IDNC-DOMAIN-ID'] = domainId;

      // Get access token from nuxt-auth-utils session
      if (import.meta.client) {
        try {
          const { session } = useUserSession();
          if (session.value?.access_token && !headers['Authorization']) {
            headers['Authorization'] = `Bearer ${session.value.access_token}`;
          }
        } catch (error) {
          // Session not available in this context, skip auth header
        }
      }

      try {
        // Make the original request
        return await Reflect.apply(target, thisArg, [url, options]);
      } catch (error: any) {
        // Check if it's a 401 Unauthorized error and not the refresh endpoint itself
        const is401 = error?.statusCode === 401 || error?.response?.status === 401;
        const isRefreshEndpoint = typeof url === 'string' && url.includes('/api/auth/refresh');
        const isLoginEndpoint = typeof url === 'string' && url.includes('/api/auth/login');

        // Only attempt refresh for 401 errors on protected endpoints (not login/refresh)
        if (is401 && !isRefreshEndpoint && !isLoginEndpoint && import.meta.client) {
          logger.debug('Received 401 error, attempting token refresh');

          // Try to refresh the token
          const refreshed = await refreshAccessToken();

          if (refreshed) {
            // Retry the original request with the new token
            logger.debug('Retrying original request with new token');

            // Update the authorization header with the new token
            try {
              const { session } = useUserSession();
              if (session.value?.access_token) {
                headers['Authorization'] = `Bearer ${session.value.access_token}`;
              }
            } catch (sessionError) {
              logger.error('Failed to get new token from session', sessionError);
            }

            // Retry the request
            return await Reflect.apply(target, thisArg, [url, options]);
          } else {
            // Refresh failed, redirect to login
            logger.warn('Token refresh failed, redirecting to login');

            // Clear the session
            try {
              const { clear } = useUserSession();
              await clear();
            } catch (clearError) {
              logger.error('Failed to clear session', clearError);
            }

            // Redirect to login
            if (typeof window !== 'undefined') {
              const currentPath = window.location.pathname;
              if (currentPath !== '/login' && currentPath !== '/') {
                navigateTo({
                  path: '/login',
                  query: { redirect: currentPath },
                });
              } else {
                navigateTo('/login');
              }
            }
          }
        }

        // Re-throw the error if not handled
        throw error;
      }
    },
  });
});
