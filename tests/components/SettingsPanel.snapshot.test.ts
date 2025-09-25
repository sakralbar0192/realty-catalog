import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SettingsPanel from '../../components/SettingsPanel.vue'

// Mock the useAppI18n composable
vi.mock('../../composables/useI18n', () => ({
  useAppI18n: () => ({
    translate: (key: string) => {
      const translations: Record<string, string> = {
        'settings.title': 'Settings',
        'common.close': 'Close',
        'theme.title': 'Theme',
        'common.language': 'Language',
      }
      return translations[key] || key
    },
  }),
}))

describe('SettingsPanel Snapshots', () => {
  it('should match snapshot when closed', () => {
    const wrapper = mount(SettingsPanel, {
      global: {
        stubs: {
          LanguageSwitcher: {
            name: 'LanguageSwitcher',
            template: '<div>Language Switcher</div>',
          },
          ThemeToggle: {
            name: 'ThemeToggle',
            template: '<div>Theme Toggle</div>',
          },
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot when open', async() => {
    const wrapper = mount(SettingsPanel, {
      attachTo: document.body,
      global: {
        stubs: {
          LanguageSwitcher: {
            name: 'LanguageSwitcher',
            template: '<div>Language Switcher</div>',
          },
          ThemeToggle: {
            name: 'ThemeToggle',
            template: '<div>Theme Toggle</div>',
          },
        },
      },
    })

    await wrapper.vm.open()
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toMatchSnapshot()
  })
})
