/**
 * Authentication API Service
 * Handles all authentication-related API calls
 * Stores tokens securely in HTTP-only cookies
 */

import type { LoginPayload, RegistrationPayload, AuthResponse } from '~/types/auth';
import { useAuthCookie } from '~/composables/useCookie';
import { ROUTES } from '~/constants/routes';

const getApiBaseUrl = () => {
  const config = useRuntimeConfig();
  return config.public.apiBaseUrl;
};

const getApiClient = () => $fetch;

export const authService = {
  /**
   * Login user with email and password
   * Stores token_id and session_id in secure cookies
   */
  async login(credentials: LoginPayload): Promise<AuthResponse> {
    try {
      const $api = getApiClient();

      const response = (await $api(`${getApiBaseUrl()}/${ROUTES.auth.login}`, {
        method: 'POST',
        body: credentials,
      })) as any;

      if (response?.user?.token_id && response?.user?.session_id) {
        const { setAuthTokens } = useAuthCookie();
        setAuthTokens(response.user.token_id, response.user.session_id);
      } else {
        console.error('Missing token_id or session_id in response:', {
          has_token_id: !!response?.user?.token_id,
          has_session_id: !!response?.user?.session_id,
        });
      }

      return {
        success: true,
        message: 'Login successful',
        data: response.user,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.data?.message || error.message || 'Login failed',
        errors: error.data?.errors,
      };
    }
  },

  /**
   * Register a new user
   */
  async register(data: RegistrationPayload): Promise<AuthResponse> {
    try {
      const $api = getApiClient();

      const { captcha, ...registrationPayload } = data;

      const response = (await $api(`${getApiBaseUrl()}/${ROUTES.auth.register}`, {
        method: 'POST',
        body: registrationPayload,
      })) as any;

      return {
        success: true,
        message: response?.message || 'Registration successful',
        data: response?.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.data?.message || error.message || 'Registration failed',
        errors: error.data?.errors,
      };
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<AuthResponse> {
    try {
      const $api = getApiClient();
      const { getTokenId, removeAuthTokens } = useAuthCookie();
      const tokenId = getTokenId();

      await $api(`${getApiBaseUrl()}/${ROUTES.auth.logout}`, {
        method: 'POST',
        headers: tokenId ? { Authorization: `Bearer ${tokenId}` } : {},
      });

      removeAuthTokens();

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error: any) {
      const { removeAuthTokens } = useAuthCookie();
      removeAuthTokens();

      return {
        success: true,
        message: 'Logged out',
      };
    }
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      const $api = getApiClient();

      const response = (await $api(`${getApiBaseUrl()}${ROUTES.auth.refresh}`, {
        method: 'POST',
      })) as any;

      if (response?.user?.token_id && response?.user?.session_id) {
        const { setAuthTokens } = useAuthCookie();
        setAuthTokens(response.user.token_id, response.user.session_id);
      }

      return {
        success: true,
        message: 'Token refreshed',
        data: response?.user,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.data?.message || error.message || 'Token refresh failed',
      };
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const $api = getApiClient();
      const { getTokenId } = useAuthCookie();
      const tokenId = getTokenId();

      if (!tokenId) {
        return {
          success: false,
          message: 'Not authenticated',
        };
      }

      const response = (await $api(`${getApiBaseUrl()}${ROUTES.auth.user}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenId}`,
        },
      })) as any;

      return {
        success: true,
        message: 'User fetched',
        data: response,
      };
    } catch (error: any) {
      const { removeAuthTokens } = useAuthCookie();
      removeAuthTokens();

      return {
        success: false,
        message: error.data?.message || error.message || 'Failed to fetch user',
      };
    }
  },
};
