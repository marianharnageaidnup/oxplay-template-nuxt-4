/**
 * Authentication Plugin
 * Initializes user session on app startup
 * Runs only on the client side
 */

export default defineNuxtPlugin(async (nuxtApp) => {
  const { initializeSession } = useAuth();
  await initializeSession();
});
