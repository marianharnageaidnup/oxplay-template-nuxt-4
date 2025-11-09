/**
 * Get Current User API Route
 * Fetches the current user from external API and updates session
 */

import type { User } from '~/types/auth';
import { logger } from '../../../server/utils/logger';
import { API_ROUTES } from '../../../server/utils/constants';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  try {
    // Get current session
    const session = await getUserSession(event);

    if (!session?.access_token) {
      throw createError({
        statusCode: 401,
        message: 'Not authenticated',
      });
    }

    // Call external user API
    const user = await $fetch<User>(`${config.public.apiBaseUrl}/${API_ROUTES.auth.user}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Failed to fetch user',
      });
    }

    // Update session with latest user data
    await setUserSession(event, {
      ...session,
      user,
    });

    return {
      success: true,
      user,
    };
  } catch (error: any) {
    logger.apiError('Get user error', error, { endpoint: '/api/auth/user' });

    // Clear session on failure
    await clearUserSession(event);

    throw createError({
      statusCode: error.statusCode || 401,
      message: error.data?.message || error.message || 'Failed to fetch user',
    });
  }
});
