import { describe, it, expect, vi } from 'vitest'
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

describe('SettingsToggle Snapshots', () => {
  it('should match snapshot when panel is closed', () => {
    const mockSettingsPanel = {
      open: vi.fn(),
      close: vi.fn(),
      isOpen: false,
    }

    const wrapper = mount(SettingsToggle, {
      global: {
        provide: {
          settingsPanel: computed(() => mockSettingsPanel),
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot when panel is open', () => {
    const mockSettingsPanel = {
      open: vi.fn(),
      close: vi.fn(),
      isOpen: true,
    }

    const wrapper = mount(SettingsToggle, {
      global: {
        provide: {
          settingsPanel: computed(() => mockSettingsPanel),
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
