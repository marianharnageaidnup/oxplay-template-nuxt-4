import brand from './brand.config';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-11-05',
  runtimeConfig: {
    WS_HOST: process.env.WS_HOST,
    WS_PORT: process.env.WS_PORT,
    REDIS_PREFIX: process.env.REDIS_PREFIX,
    IDNPOKER_IOS: process.env.IDNPOKER_IOS,
    IDNPOKER_ANDROID: process.env.IDNPOKER_ANDROID,
    TOAST_DURATION: Number(process.env.TOAST_DURATION) || 10000,

    public: {
      domainId: process.env.DOMAIN_ID || '1',
      apiBaseUrl: process.env.API_BASE_URL || '',
      theme: brand.theme || 'dark',
      logoType: brand.logoType || 'svg',
      domainURL: brand.domainURL,
      cdnURL: `https://cdn-proxy.globalcontentcloud.com/${process.env.DOMAIN_ID}`,
      commonAssetsURL: 'https://cdn-proxy.globalcontentcloud.com/common',
      appENV: process.env.API_BASE_URL?.includes('stage-oplbo') ? 'STAGE' : 'PROD',
      nsoftScriptURLProd:
        'https://ignite-sdk.nl-ams-1.linodeobjects.com/production/ignite-parent.js',
      nsoftScriptURLStage: 'https://ignite-sdk.nl-ams-1.linodeobjects.com/staging/ignite-parent.js',
    },
  },

  app: {
    head: {
      title: brand.name,
      meta: [{ charset: 'utf-8' }],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: `https://cdn-proxy.globalcontentcloud.com/${process.env.DOMAIN_ID}/logo/favicon.ico`,
        },
      ],
    },
  },

  css: ['~/assets/css/global.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ['@nuxtjs/i18n', '@pinia/nuxt', 'nuxt-auth-utils'],

  i18n: {
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
      },
      {
        code: 'id',
        name: 'Bahasa Indonesia',
        file: 'id.json',
      },
    ],
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },

  devServer: {
    port: Number(process.env.NUXT_PORT) || 3000,
    host: '0.0.0.0',
  },
});
