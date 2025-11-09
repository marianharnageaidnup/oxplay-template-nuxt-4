/**
 * Authentication API Service
 * Handles all authentication-related API calls
 * Uses nuxt-auth-utils for secure session management
 */

import type { LoginPayload, RegistrationPayload, User } from '~/types/auth';
import { getErrorMessage, getValidationErrors } from '~/types/errors';

export const authService = {
  /**
   * Login user with email and password
   * Session is managed by server-side nuxt-auth-utils
   */
  async login(credentials: LoginPayload) {
    try {
      const response = await $fetch<{ success: boolean; message: string; user: User }>('/api/auth/login', {
        method: 'POST',
        body: credentials,
      });

      return {
        success: true,
        message: response.message || 'Login successful',
        data: response.user,
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, 'Login failed'),
        errors: getValidationErrors(error),
      };
    }
  },

  /**
   * Register a new user
   */
  async register(data: RegistrationPayload) {
    try {
      const response = await $fetch<{ success: boolean; message: string; data?: any }>('/api/auth/register', {
        method: 'POST',
        body: data,
      });

      return {
        success: true,
        message: response.message || 'Registration successful',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, 'Registration failed'),
        errors: getValidationErrors(error),
      };
    }
  },

  /**
   * Logout user
   * Clears server-side session
   */
  async logout() {
    try {
      const response = await $fetch<{ success: boolean; message: string }>('/api/auth/logout', {
        method: 'POST',
      });

      return {
        success: true,
        message: response.message || 'Logged out successfully',
      };
    } catch (error) {
      return {
        success: true,
        message: 'Logged out',
      };
    }
  },

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    try {
      const response = await $fetch<{ success: boolean; message: string; user: User }>('/api/auth/refresh', {
        method: 'POST',
      });

      return {
        success: true,
        message: response.message || 'Token refreshed',
        data: response.user,
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, 'Token refresh failed'),
      };
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      const response = await $fetch<{ success: boolean; user: User }>('/api/auth/user', {
        method: 'GET',
      });

      return {
        success: true,
        message: 'User fetched',
        data: response.user,
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, 'Failed to fetch user'),
      };
    }
  },
};
