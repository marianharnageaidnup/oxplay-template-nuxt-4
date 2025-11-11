/**
 * Config Store
 * Stores application configuration data from the backend
 * Initialized on app startup via config plugin
 */

import type { ConfigData } from '~/types/config';

export const useConfigStore = defineStore('config', {
  state: () => ({
    init: false,
    data: null as ConfigData | null,
  }),

  getters: {
    isInitialized: (state) => state.init,
    config: (state) => state.data,

    // Status and maintenance
    status: (state) => state.data?.status ?? false,
    isMaintenanceMode: (state) => state.data?.meta?.maintenance ?? false,

    // Meta information
    meta: (state) => state.data?.meta,
    siteName: (state) => state.data?.meta?.name || '',
    trademark: (state) => state.data?.meta?.trademark || '',
    license: (state) => state.data?.meta?.license,

    // Page meta data
    pagesMeta: (state) => state.data?.meta?.pages || {},

    // Get meta for a specific page
    getPageMeta: (state) => (pageName: string) => {
      return state.data?.meta?.pages?.[pageName];
    },

    // Meta tags
    metaTags: (state) => state.data?.tags || [],

    // Pages content
    pages: (state) => state.data?.pages || [],

    // Get page by URL
    getPageByUrl: (state) => (url: string) => {
      return state.data?.pages?.find(page => page.url === url);
    },

    // Get pages by section
    getPagesBySection: (state) => (section: string) => {
      return state.data?.pages?.filter(page => page.section === section) || [];
    },

    // Menu and poker
    menu: (state) => state.data?.menu || [],
    poker: (state) => state.data?.poker || 0,

    // Social media
    social: (state) => state.data?.social,
    socialLinks: (state) => ({
      facebook: state.data?.social?.facebook,
      twitter: state.data?.social?.twitter,
      instagram: state.data?.social?.instagram,
      youtube: state.data?.social?.youtube,
      tiktok: state.data?.social?.tiktok,
    }),
    whatsapp: (state) => state.data?.social?.whatsapp || [],
    telegram: (state) => state.data?.social?.telegram || [],
    line: (state) => state.data?.social?.line || [],
    googleTagManager: (state) => state.data?.social?.google_tag_manager || [],
    facebookPixel: (state) => state.data?.social?.facebook_pixel || [],
    googleAnalytics: (state) => state.data?.social?.google_analytics,
    livechatType: (state) => state.data?.social?.livechat_type,

    // Promo and welcome messages
    promoLineEn: (state) => state.data?.social?.promo_line_en,
    promoLineId: (state) => state.data?.social?.promo_line_id,
    welcomeMessageEn: (state) => state.data?.social?.welcome_message_en,
    welcomeMessageId: (state) => state.data?.social?.welcome_message_id,

    // Payment methods
    methods: (state) => state.data?.methods || [],
    activeBanks: (state) => state.data?.activeBanks,
    paymentType: (state) => state.data?.payment_type,

    // Get payment methods by category
    getPaymentMethodsByCategory: (state) => (category: string) => {
      return state.data?.activeBanks?.[category] || [];
    },

    // Notifications
    notifications: (state) => state.data?.notifications,
    notificationBeforeLogin: (state) => state.data?.notifications?.notification_before_login,
  },

  actions: {
    /**
     * Initialize config with data from backend
     */
    setConfig(data: ConfigData) {
      this.data = data;
      this.init = true;
    },

    /**
     * Reset config state
     */
    reset() {
      this.init = false;
      this.data = null;
    },
  },
});
