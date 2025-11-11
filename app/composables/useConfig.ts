/**
 * Config Composable
 * Provides easy access to application configuration
 */

export const useConfig = () => {
  const configStore = useConfigStore();

  return {
    // State
    isInitialized: computed(() => configStore.isInitialized),
    config: computed(() => configStore.config),

    // Status
    status: computed(() => configStore.status),
    isMaintenanceMode: computed(() => configStore.isMaintenanceMode),

    // Site info
    siteName: computed(() => configStore.siteName),
    trademark: computed(() => configStore.trademark),
    license: computed(() => configStore.license),

    // Meta
    meta: computed(() => configStore.meta),
    metaTags: computed(() => configStore.metaTags),
    pagesMeta: computed(() => configStore.pagesMeta),

    // Pages
    pages: computed(() => configStore.pages),
    menu: computed(() => configStore.menu),
    poker: computed(() => configStore.poker),

    // Social media
    social: computed(() => configStore.social),
    socialLinks: computed(() => configStore.socialLinks),
    whatsapp: computed(() => configStore.whatsapp),
    telegram: computed(() => configStore.telegram),
    line: computed(() => configStore.line),
    googleTagManager: computed(() => configStore.googleTagManager),
    facebookPixel: computed(() => configStore.facebookPixel),
    googleAnalytics: computed(() => configStore.googleAnalytics),
    livechatType: computed(() => configStore.livechatType),

    // Promo and welcome messages
    promoLineEn: computed(() => configStore.promoLineEn),
    promoLineId: computed(() => configStore.promoLineId),
    welcomeMessageEn: computed(() => configStore.welcomeMessageEn),
    welcomeMessageId: computed(() => configStore.welcomeMessageId),

    // Payment methods
    methods: computed(() => configStore.methods),
    activeBanks: computed(() => configStore.activeBanks),
    paymentType: computed(() => configStore.paymentType),

    // Notifications
    notifications: computed(() => configStore.notifications),
    notificationBeforeLogin: computed(() => configStore.notificationBeforeLogin),

    // Helper methods
    getPageMeta: (pageName: string) => configStore.getPageMeta(pageName),
    getPageByUrl: (url: string) => configStore.getPageByUrl(url),
    getPagesBySection: (section: string) => configStore.getPagesBySection(section),
    getPaymentMethodsByCategory: (category: string) => configStore.getPaymentMethodsByCategory(category),
  };
};
