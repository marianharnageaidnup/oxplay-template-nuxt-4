/**
 * Login API Route
 * Handles user authentication and sets secure session
 */

import type { LoginPayload, AuthResponse } from '~/types/auth';
import { logger } from '../../../server/utils/logger';
import { API_ROUTES } from '../../../server/utils/constants';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody<LoginPayload>(event);

  try {
    const response = await $fetch<AuthResponse>(
      `${config.public.apiBaseUrl}/${API_ROUTES.auth.login}`,
      {
        method: 'POST',
        body,
      }
    );

    if (!response?.access_token || !response?.user) {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials',
      });
    }

    // Calculate expiration timestamp
    const expiresAt = Date.now() + response.expires_in * 1000;

    // Set user session using nuxt-auth-utils
    await setUserSession(event, {
      user: response.user,
      access_token: response.access_token,
      token_type: response.token_type,
      expires_in: response.expires_in,
      expiresAt,
    });

    return {
      success: true,
      message: 'Login successful',
      user: response.user,
    };
  } catch (error) {
    logger.apiError('Login failed', error, {
      endpoint: '/api/auth/login',
    });

    throw createError({
      statusCode: (error as any).statusCode || 401,
      message: (error as any).data?.message || (error as any).message || 'Login failed',
      data: (error as any).data?.errors,
    });
  }
});
