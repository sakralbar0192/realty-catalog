import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTheme } from '~/composables/useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('returns theme state', () => {
    const { theme, isDarkTheme, initializeTheme } = useTheme()

    // Initially theme is null
    expect(theme.value).toBe(null)
    expect(isDarkTheme.value).toBe(false)

    // After initialization
    initializeTheme()
    expect(theme.value).toBe('light')
    expect(isDarkTheme.value).toBe(false)
  })

  it('toggles theme correctly', () => {
    const { toggleTheme, isDarkTheme } = useTheme()

    // First toggle initializes to light
    toggleTheme()
    expect(isDarkTheme.value).toBe(false)

    // Second toggle goes to dark
    toggleTheme()
    expect(isDarkTheme.value).toBe(true)
  })

  it('sets theme correctly', () => {
    const { setTheme, theme } = useTheme()

    setTheme('dark')
    expect(theme.value).toBe('dark')

    setTheme('light')
    expect(theme.value).toBe('light')
  })
})
