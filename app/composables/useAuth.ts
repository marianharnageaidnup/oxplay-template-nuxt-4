/**
 * Authentication Composable
 * Provides authentication functionality and session management
 * Uses nuxt-auth-utils for session management
 */

import { computed, ref } from 'vue';
import type { LoginPayload, RegistrationPayload } from '~/types/auth';
import { authService } from '~/services/auth.service';
import { getErrorMessage } from '~/types/errors';
import { logger } from '~/utils/logger';

export const useAuth = () => {
  const { loggedIn, user, clear, fetch } = useUserSession();
  const isLoading = ref(false);

  const isAuthenticated = computed(() => loggedIn.value);
  const isInitialized = computed(() => true); // Session is always initialized with nuxt-auth-utils

  const login = async (credentials: LoginPayload) => {
    isLoading.value = true;
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
    } catch (error) {
      logger.error('Login error', error);

      return {
        success: false,
        message: getErrorMessage(error, 'An error occurred during login'),
      };
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (data: RegistrationPayload) => {
    isLoading.value = true;
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
    } catch (error) {
      logger.error('Registration error', error);

      return {
        success: false,
        message: getErrorMessage(error, 'An error occurred during registration'),
      };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    isLoading.value = true;
    try {
      await authService.logout();
      // Clear the local session
      await clear();

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      logger.error('Logout error', error);
      await clear();

      return {
        success: true,
        message: 'Logged out',
      };
    } finally {
      isLoading.value = false;
    }
  };

  const refreshToken = async () => {
    isLoading.value = true;
    try {
      const response = await authService.refreshToken();

      if (response.success) {
        // Refresh the local session state
        await fetch();

        return {
          success: true,
          message: 'Token refreshed successfully',
        };
      }

      return {
        success: false,
        message: response.message,
      };
    } catch (error) {
      logger.error('Token refresh error', error);

      return {
        success: false,
        message: getErrorMessage(error, 'Failed to refresh token'),
      };
    } finally {
      isLoading.value = false;
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
    refreshToken,
  };
};
