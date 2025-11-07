/**
 * Authentication Composable
 * Provides authentication functionality and session management
 * Uses Pinia store for shared state across all instances
 */

import { computed } from 'vue';
import type { LoginPayload, RegistrationPayload } from '~/types/auth';
import { authService } from '~/services/auth.service';
import { useAuthCookie } from './useCookie';
import { useUserStore } from '~/stores/user';

export const useAuth = () => {
  const { removeToken } = useAuthCookie();
  const userStore = useUserStore();

  const user = computed(() => userStore.user);
  const isAuthenticated = computed(() => userStore.isAuthenticated);
  const isLoading = computed(() => userStore.isLoading);
  const isInitialized = computed(() => userStore.isInitialized);

  const login = async (credentials: LoginPayload) => {
    try {
      const response = await authService.login(credentials);

      if (response.success && response.data) {
        userStore.setUser(response.data);

        return {
          success: true,
          message: 'Login successful',
        };
      }

      return {
        success: false,
        message: response.message,
        errors: response.errors,
      };
    } catch (error: any) {
      console.error('Login error:', error);

      return {
        success: false,
        message: error.message || 'An error occurred during login',
      };
    }
  };

  const register = async (data: RegistrationPayload) => {
    try {
      const response = await authService.register(data);

      if (response.success) {
        return {
          success: true,
          message: 'Registration successful',
        };
      }

      return {
        success: false,
        message: response.message,
        errors: response.errors,
      };
    } catch (error: any) {
      console.error('Registration error:', error);

      return {
        success: false,
        message: error.message || 'An error occurred during registration',
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      userStore.clearUser();
      removeToken();

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error: any) {
      console.error('Logout error:', error);
      userStore.clearUser();
      removeToken();

      return {
        success: true,
        message: 'Logged out',
      };
    }
  };

  const initializeSession = async () => {
    try {
      userStore.setLoading(true);
      const { hasAuthTokens } = useAuthCookie();

      if (hasAuthTokens()) {
        const response = await authService.getCurrentUser();

        if (response.success && response.data) {
          userStore.setUser(response.data);
        } else {
          removeToken();
          userStore.clearUser();
        }
      } else {
        userStore.clearUser();
      }
    } catch (error: any) {
      console.error('Session initialization error:', error);
      userStore.clearUser();
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    login,
    register,
    logout,
    initializeSession,
  };
};
