/**
 * Register API Route
 * Handles user registration
 */

import type { RegistrationPayload } from '~/types/auth';
import { logger } from '../../../server/utils/logger';
import { API_ROUTES } from '../../../server/utils/constants';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody<RegistrationPayload>(event);

  try {
    const response = await $fetch<any>(`${config.public.apiBaseUrl}/${API_ROUTES.auth.register}`, {
      method: 'POST',
      body,
    });

    return {
      success: true,
      message: response?.message || 'Registration successful',
      data: response?.data,
    };
  } catch (error: any) {
    logger.apiError('Registration error', error, { endpoint: '/api/auth/register' });

    throw createError({
      statusCode: error.statusCode || 400,
      message: error.data?.message || error.message || 'Registration failed',
      data: error.data?.errors,
    });
  }
});
