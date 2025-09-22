// plugins/i18n.ts
import { createI18n } from 'vue-i18n'
import en from '~/i18n/locales/en.json'
import ru from '~/i18n/locales/ru.json'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      en,
      ru,
    },
  })

  vueApp.use(i18n)
})
