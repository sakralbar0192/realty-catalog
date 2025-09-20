import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMainStore = defineStore('main', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const theme = ref<'light' | 'dark'>('light')
  const language = ref<'en' | 'ru'>('en')

  const isLoading = computed(() => loading.value)
  const hasError = computed(() => !!error.value)
  const isDarkTheme = computed(() => theme.value === 'dark')

  const setLoading = (val: boolean) => {
    loading.value = val
  }

  const setError = (val: string | null) => {
    error.value = val
  }

  const clearError = () => {
    error.value = null
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const setTheme = (val: 'light' | 'dark') => {
    theme.value = val
  }

  const setLanguage = (val: 'en' | 'ru') => {
    language.value = val
  }

  return {
    loading,
    error,
    theme,
    language,
    isLoading,
    hasError,
    isDarkTheme,
    setLoading,
    setError,
    clearError,
    toggleTheme,
    setTheme,
    setLanguage
  }
}, {
  persist: {
    pick: ['theme', 'language']
  }
})
