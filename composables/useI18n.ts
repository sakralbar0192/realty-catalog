import { useI18n } from 'vue-i18n'
import { useSwitchLocalePath } from '#i18n'

export const useAppI18n = () => {
  const { t, locale } = useI18n()
  const mainStore = useMainStore()

  // Доступные локали
  const availableLocales = computed(() => [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' },
  ])

  // Смена языка
  const changeLocale = async(newLocale: 'en' | 'ru') => {
    // Сохраняем в main store (он имеет персистентность)
    mainStore.setLanguage(newLocale)
    const switchLocalePath = useSwitchLocalePath()
    const newPath = switchLocalePath(newLocale)
    await navigateTo(newPath)
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
    currentLocale: readonly(locale),
    availableLocales,

    // Методы
    changeLocale,
    translate: t,
    translateWithParams: translate,
    hasTranslation,
  }
}
