import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useMainStore } from '~/stores'

export const useTheme = () => {
  const mainStore = useMainStore()
  const { theme } = storeToRefs(mainStore)

  const isDarkTheme = computed(() => theme.value === 'dark')

  const setTheme = (newTheme: 'light' | 'dark') => {
    mainStore.setTheme(newTheme)
  }

  const toggleTheme = () => {
    if (theme.value === null) {
      initializeTheme()
    } else {
      const newTheme = theme.value === 'light' ? 'dark' : 'light'
      setTheme(newTheme)
    }
  }

  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  const followSystemTheme = () => {
    const systemTheme = getSystemTheme()
    setTheme(systemTheme)
  }

  const initializeTheme = () => {
    if (theme.value === null && typeof window !== 'undefined') {
      followSystemTheme()
    }
  }

  return {
    theme: readonly(theme),
    isDarkTheme: readonly(isDarkTheme),

    setTheme,
    toggleTheme,
    initializeTheme,
  }
}
