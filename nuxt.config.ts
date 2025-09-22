export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/styles/main.scss'],
  app: {
    head: {
      link: [
        // Font preloads
        { rel: 'preload', href: '/fonts/paratype-regular.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/paratype-medium.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/paratype-bold.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
      ],
    },
  },
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

  // Handle static assets and service workers
  nitro: {
    routeRules: {
      '/mockServiceWorker.js': { redirect: '/public/mockServiceWorker.js' },
    },
  },
})
