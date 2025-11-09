/**
 * Refresh Token API Route
 * Refreshes the access token and updates session
 */

import type { AuthResponse } from '~/types/auth';
import { logger } from '../../../server/utils/logger';
import { API_ROUTES } from '../../../server/utils/constants';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  try {
    // Get current session
    const session = await getUserSession(event);

    if (!session?.user?.token_id) {
      throw createError({
        statusCode: 401,
        message: 'No active session',
      });
    }

    const response = await $fetch<AuthResponse>(
      `${config.public.apiBaseUrl}/${API_ROUTES.auth.refresh}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.user.token_id}`,
        },
      }
    );

    if (!response?.access_token || !response?.user) {
      throw createError({
        statusCode: 401,
        message: 'Token refresh failed',
      });
    }

    const expiresAt = Date.now() + response.expires_in * 1000;

    // Update user session with new tokens
    await setUserSession(event, {
      user: response.user,
      access_token: response.access_token,
      token_type: response.token_type,
      expires_in: response.expires_in,
      expiresAt,
    });

    return {
      success: true,
      message: 'Token refreshed successfully',
      user: response.user,
    };
  } catch (error: any) {
    logger.apiError('Token refresh error', error, { endpoint: '/api/auth/refresh' });

    // Clear session on refresh failure
    await clearUserSession(event);

    throw createError({
      statusCode: error.statusCode || 401,
      message: error.data?.message || error.message || 'Token refresh failed',
    });
  }
});
