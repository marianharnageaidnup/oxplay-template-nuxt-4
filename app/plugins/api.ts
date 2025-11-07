/**
 * API Interceptor Plugin
 * Adds custom headers to all $fetch requests globally
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

      if (typeof document !== 'undefined') {
        const { getTokenId } = useAuthCookie();
        const tokenId = getTokenId();

        if (tokenId && !headers['Authorization']) {
          headers['Authorization'] = `Bearer ${tokenId}`;
        }
      }

      return Reflect.apply(target, thisArg, [url, options]);
    },
  });

  console.log('API Interceptor: Global $fetch interceptor initialised');
});
