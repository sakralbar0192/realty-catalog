import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMainStore = defineStore('main', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const theme = ref<'light' | 'dark' | null>(null)
  const language = ref<'en' | 'ru'>('ru')

  const isLoading = computed(() => loading.value)
  const hasError = computed(() => !!error.value)

  const setLoading = (val: boolean) => {
    loading.value = val
  }

  const setError = (val: string | null) => {
    error.value = val
  }

  const clearError = () => {
    error.value = null
  }

  const setTheme = (val: 'light' | 'dark' | null) => {
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
    setLoading,
    setError,
    clearError,
    setTheme,
    setLanguage,
  }
}, {
  persist: {
    pick: ['theme', 'language'],
    serializer: {
      serialize: JSON.stringify,
      deserialize: (value: string) => {
        const parsed = JSON.parse(value)
        // Если тема null, не восстанавливаем её, чтобы дать возможность инициализировать системной темой
        if (parsed.theme === null) {
          return { ...parsed, theme: null }
        }
        return parsed
      },
    },
  },
})
