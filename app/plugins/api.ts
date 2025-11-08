/**
 * API Interceptor Plugin
 * Adds custom headers to all $fetch requests globally
 * Uses nuxt-auth-utils session for authentication token
 */

export default defineNuxtPlugin((locale) => {
  const config = useRuntimeConfig();
  const originalFetch = globalThis.$fetch;

  globalThis.$fetch = new Proxy(originalFetch, {
    apply(target, thisArg, args) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
      const domainId = String(config.public.domainId || '1');
      const [url, options = {}] = args;

      const headers = (options.headers = options.headers || {}) as any;

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

      return Reflect.apply(target, thisArg, [url, options]);
    },
  });

  console.log('API Interceptor: Global $fetch interceptor initialised');
});
