import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FilterDrawer from '../../components/FilterDrawer.vue'
import type { Property } from '../../mocks/models'

// Mock the useAppI18n composable
vi.mock('../../composables/useI18n', () => ({
  useAppI18n: () => ({
    translate: (key: string) => {
      const translations: Record<string, string> = {
        'sidebar.filters': 'Filters',
        'common.close': 'Close',
      }
      return translations[key] || key
    },
  }),
}))

describe('FilterDrawer', () => {
  let wrapper: ReturnType<typeof mount>
  let mockProperties: Property[]

  beforeEach(() => {
    mockProperties = [
      {
        id: '1',
        name: '1-room flat',
        area: 35,
        floor: 2,
        totalFloors: 5,
        price: 50000,
        imageUrl: '/flat.svg',
        rooms: 1,
      },
      {
        id: '2',
        name: '2-room flat',
        area: 55,
        floor: 3,
        totalFloors: 9,
        price: 75000,
        imageUrl: '/flat.svg',
        rooms: 2,
      },
    ]

    wrapper = mount(FilterDrawer, {
      props: {
        properties: mockProperties,
        currentFilters: {
          rooms: null,
          price: null,
          area: null,
        },
      },
      global: {
        mocks: {
          $t: (key: string) => {
            const translations: Record<string, string> = {
              'sidebar.filters': 'Filters',
              'common.close': 'Close',
            }
            return translations[key] || key
          },
        },
        stubs: {
          Teleport: true, // Stub Teleport for testing
        },
      },
    })
  })

  describe('Component Structure', () => {
    it('should render drawer when open', async() => {
      const vm = wrapper.vm as unknown as { open: () => void }
      vm.open()
      await wrapper.vm.$nextTick()
      const drawer = wrapper.find('[data-test="filter-drawer"]')
      expect(drawer.exists()).toBe(true)
    })

    it('should not render drawer when closed', () => {
      const drawer = wrapper.find('[data-test="filter-drawer"]')
      expect(drawer.exists()).toBe(false)
    })

    it('should render header with title', async() => {
      const vm = wrapper.vm as unknown as { open: () => void }
      vm.open()
      await wrapper.vm.$nextTick()
      const title = wrapper.find('[id="filter-drawer-title"]')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('Filters')
    })

    it('should render close button', async() => {
      const vm = wrapper.vm as unknown as { open: () => void }
      vm.open()
      await wrapper.vm.$nextTick()
      const closeBtn = wrapper.find('[data-test="filter-drawer-close"]')
      expect(closeBtn.exists()).toBe(true)
    })
  })

  describe('Drawer State Management', () => {
    it('should expose open and close methods', () => {
      const vm = wrapper.vm as unknown as { open: () => void; close: () => void; isOpen: boolean }
      expect(typeof vm.open).toBe('function')
      expect(typeof vm.close).toBe('function')
      expect(vm.isOpen).toBe(false)
    })

    it('should open drawer when open method called', async() => {
      const vm = wrapper.vm as unknown as { open: () => void; isOpen: boolean }
      vm.open()
      await wrapper.vm.$nextTick()
      expect(vm.isOpen).toBe(true)
    })

    it('should close drawer when close method called', async() => {
      const vm = wrapper.vm as unknown as { open: () => void; close: () => void; isOpen: boolean }
      vm.open()
      await wrapper.vm.$nextTick()
      vm.close()
      await wrapper.vm.$nextTick()
      expect(vm.isOpen).toBe(false)
    })
  })

  describe('Event Handling', () => {
    it('should close drawer when overlay clicked', async() => {
      const vm = wrapper.vm as unknown as { open: () => void; isOpen: boolean }
      vm.open()
      await wrapper.vm.$nextTick()

      const overlay = wrapper.find('[data-test="filter-drawer-overlay"]')
      await overlay.trigger('click')

      expect(vm.isOpen).toBe(false)
    })

    it('should close drawer when close button clicked', async() => {
      const vm = wrapper.vm as unknown as { open: () => void; isOpen: boolean }
      vm.open()
      await wrapper.vm.$nextTick()

      const closeBtn = wrapper.find('[data-test="filter-drawer-close"]')
      await closeBtn.trigger('click')

      expect(vm.isOpen).toBe(false)
    })

    it('should close drawer on ESC key', async() => {
      const vm = wrapper.vm as unknown as { open: () => void; isOpen: boolean }
      vm.open()
      await wrapper.vm.$nextTick()

      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(event)

      expect(vm.isOpen).toBe(false)
    })
  })

  describe('Sidebar Integration', () => {
    it('should render Sidebar component', async() => {
      const vm = wrapper.vm as unknown as { open: () => void }
      vm.open()
      await wrapper.vm.$nextTick()

      const sidebar = wrapper.findComponent({ name: 'Sidebar' })
      expect(sidebar.exists()).toBe(true)
    })

    it('should pass props to Sidebar', async() => {
      const vm = wrapper.vm as unknown as { open: () => void }
      vm.open()
      await wrapper.vm.$nextTick()

      const sidebar = wrapper.findComponent({ name: 'Sidebar' })
      expect(sidebar.props('properties')).toEqual(mockProperties)
      expect(sidebar.props('currentFilters')).toEqual({
        rooms: null,
        price: null,
        area: null,
      })
    })
  })

  describe('Event Emission', () => {
    it('should emit roomFilter event from Sidebar', async() => {
      const vm = wrapper.vm as unknown as { open: () => void }
      vm.open()
      await wrapper.vm.$nextTick()

      const sidebar = wrapper.findComponent({ name: 'Sidebar' })
      await sidebar.vm.$emit('roomFilter', { rooms: 2 })

      expect(wrapper.emitted('roomFilter')).toBeTruthy()
      expect(wrapper.emitted('roomFilter')?.[0]).toEqual([{ rooms: 2 }])
    })

    it('should emit priceFilter event from Sidebar', async() => {
      const vm = wrapper.vm as unknown as { open: () => void }
      vm.open()
      await wrapper.vm.$nextTick()

      const sidebar = wrapper.findComponent({ name: 'Sidebar' })
      const priceRange = { min: 60000, max: 90000 }
      await sidebar.vm.$emit('priceFilter', { price: priceRange })

      expect(wrapper.emitted('priceFilter')).toBeTruthy()
      expect(wrapper.emitted('priceFilter')?.[0]).toEqual([{ price: priceRange }])
    })

    it('should emit areaFilter event from Sidebar', async() => {
      const vm = wrapper.vm as unknown as { open: () => void }
      vm.open()
      await wrapper.vm.$nextTick()

      const sidebar = wrapper.findComponent({ name: 'Sidebar' })
      const areaRange = { min: 40, max: 70 }
      await sidebar.vm.$emit('areaFilter', { area: areaRange })

      expect(wrapper.emitted('areaFilter')).toBeTruthy()
      expect(wrapper.emitted('areaFilter')?.[0]).toEqual([{ area: areaRange }])
    })

    it('should emit clearFilters event from Sidebar', async() => {
      const vm = wrapper.vm as unknown as { open: () => void }
      vm.open()
      await wrapper.vm.$nextTick()

      const sidebar = wrapper.findComponent({ name: 'Sidebar' })
      await sidebar.vm.$emit('clearFilters')

      expect(wrapper.emitted('clearFilters')).toBeTruthy()
      expect(wrapper.emitted('clearFilters')).toHaveLength(1)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes when open', async() => {
      const vm = wrapper.vm as unknown as { open: () => void }
      vm.open()
      await wrapper.vm.$nextTick()

      const drawer = wrapper.find('[data-test="filter-drawer"]')
      expect(drawer.attributes('role')).toBe('dialog')
      expect(drawer.attributes('aria-modal')).toBe('true')
      expect(drawer.attributes('aria-labelledby')).toBe('filter-drawer-title')
    })

    it('should have proper ARIA label on close button', async() => {
      const vm = wrapper.vm as unknown as { open: () => void }
      vm.open()
      await wrapper.vm.$nextTick()

      const closeBtn = wrapper.find('[data-test="filter-drawer-close"]')
      expect(closeBtn.attributes('aria-label')).toBe('Close')
    })
  })
})
