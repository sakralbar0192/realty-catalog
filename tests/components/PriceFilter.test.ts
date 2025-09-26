import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PriceFilter from '../../components/PriceFilter.vue'
import type { Property } from '../../mocks/models'

// Mock the useAppI18n composable
vi.mock('../../composables/useI18n', () => ({
  useAppI18n: () => ({
    translate: (key: string) => {
      const translations: Record<string, string> = {
        'filters.price': 'Apartment cost, ₽',
        'filters.from': 'from',
        'filters.to': 'to',
        'properties.units.currency': '₽',
      }
      return translations[key] || key
    },
  }),
}))

describe('PriceFilter', () => {
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

    wrapper = mount(PriceFilter, {
      props: {
        properties: mockProperties,
        currentFilter: null,
      },
      global: {
        mocks: {
          $t: (key: string) => {
            const translations: Record<string, string> = {
              'filters.price': 'Apartment cost, ₽',
              'filters.from': 'from',
              'filters.to': 'to',
              'properties.units.currency': '₽',
            }
            return translations[key] || key
          },
        },
      },
    })
  })

  describe('Component Structure', () => {
    it('should render title', () => {
      const title = wrapper.find('h4')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('Apartment cost, ₽')
    })

    it('should render RangeSlider component', () => {
      const rangeSlider = wrapper.findComponent({ name: 'RangeSlider' })
      expect(rangeSlider.exists()).toBe(true)
    })
  })

  describe('Price Range Calculation', () => {
    it('should calculate correct price range from properties', () => {
      const rangeSlider = wrapper.findComponent({ name: 'RangeSlider' })
      expect(rangeSlider.props('min')).toBe(50000)
      expect(rangeSlider.props('max')).toBe(100000)
    })

    it('should set default values to full range', () => {
      const rangeSlider = wrapper.findComponent({ name: 'RangeSlider' })
      expect(rangeSlider.props('minValue')).toBe(1000000)
      expect(rangeSlider.props('maxValue')).toBe(6000000)
    })
  })

  describe('Price Formatting', () => {
    it('should format prices correctly', () => {
      const rangeSlider = wrapper.findComponent({ name: 'RangeSlider' })
      const formatter = rangeSlider.props('formatter')

      expect(formatter(50000)).toBe('50\u00A0000')
      expect(formatter(100000)).toBe('100\u00A0000')
    })
  })

  describe('Filter Emission', () => {
    it('should emit filter event when range changes', async() => {
      const rangeSlider = wrapper.findComponent({ name: 'RangeSlider' })

      // Simulate range change
      await rangeSlider.vm.$emit('update:minValue', 60000)
      await rangeSlider.vm.$emit('update:maxValue', 90000)

      expect(wrapper.emitted('filter')).toBeTruthy()
      const emitted = wrapper.emitted('filter')
      expect(emitted?.[emitted.length - 1]).toEqual([{ price: { min: 60000, max: 90000 } }])
    })
  })

  describe('Current Filter Handling', () => {
    it('should use current filter values when provided', () => {
      wrapper = mount(PriceFilter, {
        props: {
          properties: mockProperties,
          currentFilter: { min: 55000, max: 95000 },
        },
      })

      const rangeSlider = wrapper.findComponent({ name: 'RangeSlider' })
      expect(rangeSlider.props('minValue')).toBe(55000)
      expect(rangeSlider.props('maxValue')).toBe(95000)
    })

    it('should reset to default values when currentFilter is null', async() => {
      wrapper = mount(PriceFilter, {
        props: {
          properties: mockProperties,
          currentFilter: { min: 55000, max: 95000 },
        },
      })

      await wrapper.setProps({ currentFilter: null })

      const rangeSlider = wrapper.findComponent({ name: 'RangeSlider' })
      expect(rangeSlider.props('minValue')).toBe(1000000)
      expect(rangeSlider.props('maxValue')).toBe(6000000)
    })
  })

  describe('Step Configuration', () => {
    it('should use correct step for price filtering', () => {
      const rangeSlider = wrapper.findComponent({ name: 'RangeSlider' })
      expect(rangeSlider.props('step')).toBe(100000)
    })
  })
})
