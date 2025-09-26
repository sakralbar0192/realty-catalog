export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],
  css: ['~/assets/styles/main.scss'],
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/realty-catalog/' : '/',
    head: {
      link: [
        // Font preloads
        { rel: 'preload', href: `${process.env.NODE_ENV === 'production' ? '/realty-catalog/' : '/'}fonts/paratype-regular.woff2`, as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
        { rel: 'preload', href: `${process.env.NODE_ENV === 'production' ? '/realty-catalog/' : '/'}fonts/paratype-medium.woff2`, as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
        { rel: 'preload', href: `${process.env.NODE_ENV === 'production' ? '/realty-catalog/' : '/'}fonts/paratype-bold.woff2`, as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
      ],
    },
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  i18n: {
    locales: [
      { code: 'en', name: 'English', iso: 'en-US', file: 'en.json' },
      { code: 'ru', name: 'Русский', iso: 'ru-RU', file: 'ru.json' },
    ],
    defaultLocale: 'ru',
    strategy: 'prefix_and_default',
    detectBrowserLanguage: false,
    langDir: 'locales',
  },
  vite: {
    build: {
      rollupOptions: {
        plugins: process.env.ANALYZE === 'true' ? [
          (await import('rollup-plugin-visualizer')).visualizer({
            filename: 'dist/stats.html',
            open: true,
            gzipSize: true,
            brotliSize: true,
          }),
        ] : [],
      },
    },
  },

  // Handle static assets and service workers
  nitro: {
    preset: 'static',
    routeRules: {
      '/mockServiceWorker.js': { redirect: '/public/mockServiceWorker.js' },
    },
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.NODE_ENV === 'production' ? '/realty-catalog/' : '/',
      apiBaseURL: '/',
    },
  },
})
