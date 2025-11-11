/**
 * Configuration API Service
 * Handles fetching application configuration from backend
 */

import type { ConfigData } from '~/types/config';
import { getErrorMessage } from '~/types/errors';

export const configService = {
  /**
   * Fetch application configuration for a specific locale
   */
  async getConfig(locale: string = 'en') {
    try {
      const config = useRuntimeConfig();
      const apiBaseUrl = config.public.apiBaseUrl;

      const response = await $fetch<ConfigData>(`${apiBaseUrl}/config/${locale}`, {
        method: 'GET',
      });

      return {
        success: true,
        message: 'Config loaded successfully',
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, 'Failed to load configuration'),
        data: null,
      };
    }
  },
};
