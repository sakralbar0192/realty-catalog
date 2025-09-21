export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/image',
    '@pinia/nuxt',
    ['@nuxtjs/i18n', {
      locales: [
        { code: 'en', name: 'English', iso: 'en-US', file: 'en.json' },
        { code: 'ru', name: 'Русский', iso: 'ru-RU', file: 'ru.json' },
      ],
      defaultLocale: 'en',
      detectBrowserLanguage: {
        useCookie: true,
        cookieKey: 'i18n_redirected',
        redirectOn: 'root',
        alwaysRedirect: false,
        fallbackLocale: 'en',
      },
    }],
    // '@nuxt/fonts',
    // '@nuxtjs/html-validator' // Removed in favor of separate html-validate tool
  ],
  css: ['/assets/styles/main.scss'],
  pinia: {
    storesDirs: ['./stores/**'],
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
})
