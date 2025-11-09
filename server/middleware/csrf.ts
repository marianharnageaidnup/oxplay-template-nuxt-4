/**
 * CSRF Protection Middleware
 * Validates requests using Origin/Referer headers for all state-changing operations
 */

export default defineEventHandler((event) => {
  const method = event.method;
  const path = event.path;

  // Skip CSRF check for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return;
  }

  // Skip for nuxt-auth-utils internal routes
  if (path.startsWith('/_auth/')) {
    return;
  }

  const config = useRuntimeConfig();
  const origin = getHeader(event, 'origin');
  const referer = getHeader(event, 'referer');
  const host = getHeader(event, 'host');

  // Get allowed origins from config
  const allowedOrigins = [
    config.public.domainURL,
    `http://localhost:${process.env.NUXT_PORT || 3000}`,
    'http://localhost:3000',
  ].filter(Boolean);

  let isValid = false;

  // Check if origin matches
  if (origin) {
    isValid = allowedOrigins.some((allowed) => origin.startsWith(allowed));
  }

  // Fallback to referer check
  if (!isValid && referer) {
    isValid = allowedOrigins.some((allowed) => referer.startsWith(allowed));
  }

  // Check if host matches (for same-origin requests)
  if (!isValid && host && config.public.domainURL?.includes(host)) {
    isValid = true;
  }

  if (!isValid) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'CSRF validation failed',
    });
  }
});
