import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FilterToggle from '../../components/FilterToggle.vue'
import Icon from '../../components/Icon.vue'

// Mock the useAppI18n composable
vi.mock('../../composables/useI18n', () => ({
  useAppI18n: () => ({
    translate: (key: string) => {
      const translations: Record<string, string> = {
        'sidebar.filters': 'Filters',
      }
      return translations[key] || key
    },
  }),
}))

// Mock Icon component
vi.mock('../../components/Icon.vue', () => ({
  default: {
    name: 'Icon',
    props: ['name', 'size'],
    template: '<span :class="`icon-${name}`" v-bind="$attrs"></span>',
  },
}))

describe('FilterToggle', () => {
  it('should render toggle button', () => {
    const wrapper = mount(FilterToggle, {
      global: {
        provide: {
          filterDrawerRef: { value: null },
        },
      },
    })

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.attributes('data-test')).toBe('filter-toggle')
  })

  it('should have proper ARIA attributes', () => {
    const wrapper = mount(FilterToggle, {
      global: {
        provide: {
          filterDrawerRef: { value: null },
        },
      },
    })

    const button = wrapper.find('button')
    expect(button.attributes('aria-label')).toBeDefined()
    expect(button.attributes('aria-expanded')).toBe('false')
  })

  it('should render filter icon', () => {
    const wrapper = mount(FilterToggle, {
      global: {
        provide: {
          filterDrawerRef: { value: null },
        },
      },
    })

    const icon = wrapper.findComponent(Icon)
    expect(icon.exists()).toBe(true)
    expect(icon.props('name')).toBe('filter')
  })

  it('should call open method when clicked and drawer is closed', async() => {
    const mockDrawer = {
      isOpen: false,
      open: vi.fn(),
      close: vi.fn(),
    }

    const wrapper = mount(FilterToggle, {
      global: {
        provide: {
          filterDrawerRef: { value: mockDrawer },
        },
      },
    })

    const button = wrapper.find('button')
    await button.trigger('click')

    expect(mockDrawer.open).toHaveBeenCalled()
    expect(mockDrawer.close).not.toHaveBeenCalled()
  })

  it('should call close method when clicked and drawer is open', async() => {
    const mockDrawer = {
      isOpen: true,
      open: vi.fn(),
      close: vi.fn(),
    }

    const wrapper = mount(FilterToggle, {
      global: {
        provide: {
          filterDrawerRef: { value: mockDrawer },
        },
      },
    })

    const button = wrapper.find('button')
    await button.trigger('click')

    expect(mockDrawer.close).toHaveBeenCalled()
    expect(mockDrawer.open).not.toHaveBeenCalled()
  })
})
