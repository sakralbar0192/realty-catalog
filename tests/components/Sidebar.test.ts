import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Sidebar from '../../components/Sidebar.vue'
import type { Property } from '../../mocks/models'

// Mock the useAppI18n composable
vi.mock('../../composables/useI18n', () => ({
  useAppI18n: () => ({
    translate: (key: string) => {
      const translations: Record<string, string> = {
        'sidebar.clearFilters': 'Clear Filters',
        'filters.price': 'Price',
        'filters.area': 'Area',
      }
      return translations[key] || key
    },
  }),
}))

describe('Sidebar', () => {
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
      {
        id: '3',
        name: '3-room flat',
        area: 75,
        floor: 4,
        totalFloors: 12,
        price: 100000,
        imageUrl: '/flat.svg',
        rooms: 3,
      },
    ]

    wrapper = mount(Sidebar, {
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
              'sidebar.clearFilters': 'Clear Filters',
              'filters.price': 'Price',
              'filters.area': 'Area',
            }
            return translations[key] || key
          },
        },
      },
    })
  })

  describe('Component Structure', () => {
    it('should render clear filters link', () => {
      const link = wrapper.find('[data-test="clear-filters-btn"]')
      expect(link.exists()).toBe(true)
      expect(link.text()).toContain('Clear Filters')
    })

    it('should render filter components', () => {
      const roomFilter = wrapper.findComponent({ name: 'RoomFilter' })
      expect(roomFilter.exists()).toBe(true)

      const priceFilter = wrapper.findComponent({ name: 'PriceFilter' })
      expect(priceFilter.exists()).toBe(true)

      const areaFilter = wrapper.findComponent({ name: 'AreaFilter' })
      expect(areaFilter.exists()).toBe(true)
    })
  })

  describe('Clear Filters Link', () => {
    it('should emit clearFilters event when clicked', async() => {
      const link = wrapper.find('[data-test="clear-filters-btn"]')
      await link.trigger('click')

      expect(wrapper.emitted('clearFilters')).toBeTruthy()
      expect(wrapper.emitted('clearFilters')).toHaveLength(1)
    })

    it('should emit clearFilters event when Enter pressed', async() => {
      const link = wrapper.find('[data-test="clear-filters-btn"]')
      await link.trigger('keydown.enter')

      expect(wrapper.emitted('clearFilters')).toBeTruthy()
      expect(wrapper.emitted('clearFilters')).toHaveLength(1)
    })

    it('should emit clearFilters event when Space pressed', async() => {
      const link = wrapper.find('[data-test="clear-filters-btn"]')
      await link.trigger('keydown.space')

      expect(wrapper.emitted('clearFilters')).toBeTruthy()
      expect(wrapper.emitted('clearFilters')).toHaveLength(1)
    })

    it('should have proper styling class', () => {
      const link = wrapper.find('[data-test="clear-filters-btn"]')
      expect(link.classes().length).toBeGreaterThan(0)
    })

    it('should render close icon', () => {
      const icon = wrapper.findComponent({ name: 'Icon' })
      expect(icon.exists()).toBe(true)
      expect(icon.props('name')).toBe('close')
      expect(icon.props('size')).toBe(16)
    })

    it('should have proper accessibility attributes', () => {
      const link = wrapper.find('[data-test="clear-filters-btn"]')
      expect(link.attributes('tabindex')).toBe('0')
    })
  })

  describe('Filter Components Integration', () => {

    it('should pass properties to child components', () => {
      const roomFilter = wrapper.findComponent({ name: 'RoomFilter' })
      expect(roomFilter.props('properties')).toEqual(mockProperties)

      const priceFilter = wrapper.findComponent({ name: 'PriceFilter' })
      expect(priceFilter.props('properties')).toEqual(mockProperties)

      const areaFilter = wrapper.findComponent({ name: 'AreaFilter' })
      expect(areaFilter.props('properties')).toEqual(mockProperties)
    })
  })

  describe('Event Emission', () => {
    it('should emit roomFilter event from RoomFilter', async() => {
      const roomFilter = wrapper.findComponent({ name: 'RoomFilter' })
      await roomFilter.vm.$emit('filter', { rooms: 2 })

      expect(wrapper.emitted('roomFilter')).toBeTruthy()
      expect(wrapper.emitted('roomFilter')?.[0]).toEqual([{ rooms: 2 }])
    })

    it('should emit priceFilter event from PriceFilter', async() => {
      const priceFilter = wrapper.findComponent({ name: 'PriceFilter' })
      const priceRange = { min: 60000, max: 90000 }
      await priceFilter.vm.$emit('filter', { price: priceRange })

      expect(wrapper.emitted('priceFilter')).toBeTruthy()
      expect(wrapper.emitted('priceFilter')?.[0]).toEqual([{ price: priceRange }])
    })

    it('should emit areaFilter event from AreaFilter', async() => {
      const areaFilter = wrapper.findComponent({ name: 'AreaFilter' })
      const areaRange = { min: 40, max: 70 }
      await areaFilter.vm.$emit('filter', { area: areaRange })

      expect(wrapper.emitted('areaFilter')).toBeTruthy()
      expect(wrapper.emitted('areaFilter')?.[0]).toEqual([{ area: areaRange }])
    })
  })

  describe('Accessibility', () => {
    it('should have proper link attributes', () => {
      const link = wrapper.find('[data-test="clear-filters-btn"]')
      expect(link.attributes('tabindex')).toBe('0')
    })
  })
})
