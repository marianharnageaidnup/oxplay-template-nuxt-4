/**
 * Register API Route
 * Handles user registration
 */

import type { RegistrationPayload } from '~/types/auth';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody<RegistrationPayload>(event);

  try {
    // Call external registration API
    const response = await $fetch<any>(`${config.public.apiBaseUrl}/auth/register`, {
      method: 'POST',
      body,
    });

    return {
      success: true,
      message: response?.message || 'Registration successful',
      data: response?.data,
    };
  } catch (error: any) {
    console.error('Registration error:', error);

    throw createError({
      statusCode: error.statusCode || 400,
      message: error.data?.message || error.message || 'Registration failed',
      data: error.data?.errors,
    });
  }
});
