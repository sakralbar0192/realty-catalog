export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'src',
  modules: ['@pinia/nuxt'],
  css: ['~/assets/styles/main.scss'],
  pinia: {
    storesDirs: ['./src/stores/**'],
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

  // Handle MSW service worker route
  nitro: {
    routeRules: {
      '/mockServiceWorker.js': { redirect: '/public/mockServiceWorker.js' },
    },
  },
})
