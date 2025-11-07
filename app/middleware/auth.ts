/**
 * Authentication Middleware
 * Protects routes and ensures user is authenticated
 * Session is already initialized by auth.client.ts plugin
 */

export default defineNuxtRouteMiddleware((to) => {
  const protectedRoutes = ['/protected'];
  if (protectedRoutes.includes(to.path)) {
    const requiresAuth = to.meta.requiresAuth !== false;
    if (requiresAuth) {
      const { isAuthenticated } = useAuth();
      if (!isAuthenticated.value) {
        return navigateTo('/login');
      }
    }
  }
});
