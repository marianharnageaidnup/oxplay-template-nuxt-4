/**
 * Login API Route
 * Handles user authentication and sets secure session
 */

import type { LoginPayload, AuthResponse } from '~/types/auth';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody<LoginPayload>(event);

  try {
    // Call external authentication API
    const response = await $fetch<AuthResponse>(`${config.public.apiBaseUrl}/auth/login`, {
      method: 'POST',
      body,
    });

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
  } catch (error: any) {
    console.error('Login error:', error);

    throw createError({
      statusCode: error.statusCode || 401,
      message: error.data?.message || error.message || 'Login failed',
      data: error.data?.errors,
    });
  }
});
