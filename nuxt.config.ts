import brand from "./brand.config";

export default defineNuxtConfig({
  runtimeConfig: {
    DOMAIN_ID: process.env.DOMAIN_ID,
    API_BASE_URL: process.env.API_BASE_URL,
    WS_HOST: process.env.WS_HOST,
    WS_PORT: process.env.WS_PORT,
    REDIS_PREFIX: process.env.REDIS_PREFIX,
    IDNPOKER_IOS: process.env.IDNPOKER_IOS,
    IDNPOKER_ANDROID: process.env.IDNPOKER_ANDROID,
    TOAST_DURATION: Number(process.env.TOAST_DURATION) || 10000,

    public: {
      theme: brand.theme || "dark",
      logoType: brand.logoType || "svg",
      domainURL: brand.domainURL,
      cdnURL: `https://cdn-proxy.globalcontentcloud.com/${process.env.DOMAIN_ID}`,
      commonAssetsURL: "https://cdn-proxy.globalcontentcloud.com/common",
      appENV: process.env.API_BASE_URL?.includes("stage-oplbo")
        ? "STAGE"
        : "PROD",
      nsoftScriptURLProd:
        "https://ignite-sdk.nl-ams-1.linodeobjects.com/production/ignite-parent.js",
      nsoftScriptURLStage:
        "https://ignite-sdk.nl-ams-1.linodeobjects.com/staging/ignite-parent.js",
    },
  },

  app: {
    head: {
      title: brand.name,
      meta: [{ charset: "utf-8" }],
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: `https://cdn-proxy.globalcontentcloud.com/${process.env.DOMAIN_ID}/logo/favicon.ico`,
        },
      ],
    },
  },

  // css: ["~/assets/path to css file"],
  // plugins: [],
  // modules: [],

  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },

  devServer: {
    port: Number(process.env.NUXT_PORT) || 3000,
    host: "0.0.0.0",
  },
});
