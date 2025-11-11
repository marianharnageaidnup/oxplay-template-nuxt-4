/**
 * Config Initialization Plugin
 * Fetches application configuration on app startup
 */

import { logger } from '~/utils/logger';
import { configService } from '~/services/config.service';

export default defineNuxtPlugin({
  name: 'config',
  dependsOn: ['i18n:plugin'],
  async setup(nuxtApp) {
    const configStore = useConfigStore();

    // Get current locale from i18n
    // @ts-ignore - i18n plugin is loaded via dependsOn
    const locale = nuxtApp.$i18n?.locale?.value || 'en';
    
    // Skip if already initialized
    if (configStore.isInitialized) {
      logger.debug('Config already initialized, skipping');
      return;
    }

    try {
      logger.debug('Initializing application config', { locale });

      const result = await configService.getConfig(locale);      

      if (result.success && result.data) {
        // Store config in state
        configStore.setConfig(result.data);

        logger.info('Config initialized successfully', {
          siteName: result.data.meta?.name,
          maintenance: result.data.meta?.maintenance,
          pagesCount: result.data.pages?.length || 0,
        });
      } else {
        logger.error('Failed to load config', { error: result.message });

        // Show error to user if on client
        if (import.meta.client) {
          throw createError({
            statusCode: 500,
            message: 'Failed to load application configuration',
          });
        }
      }
    } catch (error: any) {
      logger.error('Config initialization error', error);

      // Re-throw error to show error page
      throw createError({
        statusCode: error.statusCode || 500,
        message: 'Failed to initialize application',
      });
    }
  },
});

