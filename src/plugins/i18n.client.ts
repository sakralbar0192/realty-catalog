import { createI18n } from 'vue-i18n'

export default defineNuxtPlugin(({ vueApp }) => {
  // Получаем сохраненную локаль из localStorage
  const savedLocale = process.client ? localStorage.getItem('locale') : null
  const defaultLocale = savedLocale || 'en'

  const i18n = createI18n({
    legacy: false,
    locale: defaultLocale,
    messages: {
      en: {
        common: {
          language: 'Language',
        },
        theme: {
          'Switch to light theme': 'Switch to light theme',
          'Switch to dark theme': 'Switch to dark theme',
          light: 'Light',
          dark: 'Dark',
        },
      },
      ru: {
        common: {
          language: 'Язык',
        },
        theme: {
          'Switch to light theme': 'Переключить на светлую тему',
          'Switch to dark theme': 'Переключить на темную тему',
          light: 'Светлая',
          dark: 'Темная',
        },
      },
    },
  })

  vueApp.use(i18n)
})
