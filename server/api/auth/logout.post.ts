/**
 * Logout API Route
 * Clears user session and notifies external API
 */

import { logger } from '../../../server/utils/logger';
import { API_ROUTES } from '../../../server/utils/constants';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  try {
    // Get current session to extract token_id for external API call
    const session = await getUserSession(event);

    // Call external logout API if we have a token_id
    if (session?.user?.token_id) {
      try {
        await $fetch(`${config.public.apiBaseUrl}/${API_ROUTES.auth.logout}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.user.token_id}`,
          },
        });
      } catch (error) {
        // Ignore external API errors, we still want to clear local session
        logger.apiError('External logout API error', error, { endpoint: '/api/auth/logout' });
      }
    }

    // Clear the session
    await clearUserSession(event);

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error: any) {
    logger.apiError('Logout error', error, { endpoint: '/api/auth/logout' });

    // Even if there's an error, clear the session
    await clearUserSession(event);

    return {
      success: true,
      message: 'Logged out',
    };
  }
});
