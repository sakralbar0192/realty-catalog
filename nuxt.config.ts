export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/image',
    '@pinia/nuxt',
    // '@nuxt/fonts'
  ],
  css: ['/assets/styles/main.scss'],
  pinia: {
    storesDirs: ['./stores/**']
  }
})