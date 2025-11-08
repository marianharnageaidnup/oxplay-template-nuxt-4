/**
 * Authentication Composable
 * Provides authentication functionality and session management
 * Uses nuxt-auth-utils for session management
 */

import { computed } from 'vue';
import type { LoginPayload, RegistrationPayload } from '~/types/auth';
import { authService } from '~/services/auth.service';

export const useAuth = () => {
  const { loggedIn, user, clear, fetch } = useUserSession();

  const isAuthenticated = computed(() => loggedIn.value);
  const isLoading = computed(() => false); // nuxt-auth-utils doesn't expose loading state
  const isInitialized = computed(() => true); // Session is always initialized with nuxt-auth-utils

  const login = async (credentials: LoginPayload) => {
    try {
      const response = await authService.login(credentials);

      if (response.success && response.data) {
        // Session is automatically managed by the server
        // Refresh the local session state
        await fetch();

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
      // Clear the local session
      await clear();

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error: any) {
      console.error('Logout error:', error);
      await clear();

      return {
        success: true,
        message: 'Logged out',
      };
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
  };
};
