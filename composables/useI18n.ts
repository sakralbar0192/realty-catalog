import { useI18n as useNuxtI18n } from 'vue-i18n'

export const useAppI18n = () => {
  const { t, locale, locales, setLocale } = useNuxtI18n()

  // Доступные локали
  const availableLocales = computed(() => 
    locales.value.filter(l => typeof l === 'object')
  )

  // Текущая локаль
  const currentLocale = computed(() => locale.value)

  // Смена языка
  const changeLocale = async (newLocale: 'en' | 'ru') => {
    await setLocale(newLocale)
    // Сохраняем в main store
    const mainStore = useMainStore()
    mainStore.setLanguage(newLocale)
  }

  // Получение перевода с параметрами
  const translate = (key: string, params?: Record<string, unknown>) => {
    return params ? t(key, params) : t(key)
  }

  // Проверка доступности ключа
  const hasTranslation = (key: string) => {
    try {
      const translation = t(key)
      return translation !== key // Если вернулось то же самое, значит перевода нет
    } catch {
      return false
    }
  }

  return {
    // Reactive свойства
    currentLocale,
    availableLocales,
    
    // Методы
    changeLocale,
    translate: t,
    translateWithParams: translate,
    hasTranslation
  }
}
