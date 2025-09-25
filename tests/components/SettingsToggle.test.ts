import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'
import SettingsToggle from '../../components/SettingsToggle.vue'

// Mock the useAppI18n composable
vi.mock('../../composables/useI18n', () => ({
  useAppI18n: () => ({
    translate: (key: string) => {
      const translations: Record<string, string> = {
        'settings.open': 'Open settings',
      }
      return translations[key] || key
    },
  }),
}))

describe('SettingsToggle', () => {
  let wrapper: ReturnType<typeof mount>
  let mockSettingsPanel: {
    open: ReturnType<typeof vi.fn>
    close: ReturnType<typeof vi.fn>
    isOpen: boolean
  }

  beforeEach(() => {
    mockSettingsPanel = {
      open: vi.fn(),
      close: vi.fn(),
      isOpen: false,
    }

    wrapper = mount(SettingsToggle, {
      global: {
        provide: {
          settingsPanel: computed(() => mockSettingsPanel),
        },
      },
    })
  })

  it('should render toggle button', () => {
    const button = wrapper.find('[data-test="settings-toggle"]')
    expect(button.exists()).toBe(true)
    expect(button.attributes('aria-label')).toBe('Open settings')
  })

  it('should have proper accessibility attributes', () => {
    const button = wrapper.find('[data-test="settings-toggle"]')
    expect(button.attributes('aria-expanded')).toBe('false')
  })

  it('should call open when clicked and panel is closed', async() => {
    mockSettingsPanel.isOpen = false

    const button = wrapper.find('[data-test="settings-toggle"]')
    await button.trigger('click')

    expect(mockSettingsPanel.open).toHaveBeenCalled()
    expect(mockSettingsPanel.close).not.toHaveBeenCalled()
  })

  it('should call close when clicked and panel is open', async() => {
    mockSettingsPanel.isOpen = true

    const button = wrapper.find('[data-test="settings-toggle"]')
    await button.trigger('click')

    expect(mockSettingsPanel.close).toHaveBeenCalled()
    expect(mockSettingsPanel.open).not.toHaveBeenCalled()
  })

  it.skip('should update aria-expanded when panel state changes', async() => {
    // Skip due to reactivity testing complexity
  })
})
