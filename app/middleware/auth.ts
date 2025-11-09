/**
 * Authentication Middleware
 * Protects routes and ensures user is authenticated
 * Works with nuxt-auth-utils session management
 */

export default defineNuxtRouteMiddleware((to) => {
  // Use nuxt-auth-utils directly for better SSR support
  const { loggedIn } = useUserSession();

  // Check if route requires authentication
  // You can set requiresAuth in page meta or check specific paths
  const requiresAuth = to.meta.requiresAuth === true;

  // List of paths that require authentication
  const protectedPaths = ['/dashboard', '/profile', '/settings', '/protected'];
  const isProtectedPath = protectedPaths.some((path) => to.path.startsWith(path));

  // If route requires auth or is a protected path
  if (requiresAuth || isProtectedPath) {
    if (!loggedIn.value) {
      // Store the intended destination to redirect after login
      const redirectPath = to.fullPath !== '/' ? to.fullPath : undefined;

      // Redirect to login with return URL
      return navigateTo({
        path: '/login',
        query: redirectPath ? { redirect: redirectPath } : undefined,
      });
    }
  }

  // Prevent authenticated users from accessing auth pages (login, register)
  const authPages = ['/login', '/register'];
  if (authPages.includes(to.path) && loggedIn.value) {
    // Redirect to home or dashboard if already logged in
    return navigateTo('/');
  }
});
