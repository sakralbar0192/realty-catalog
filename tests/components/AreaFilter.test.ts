import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AreaFilter from '../../components/AreaFilter.vue'
import type { Property } from '../../mocks/models'

// Mock the useAppI18n composable
vi.mock('../../composables/useI18n', () => ({
  useAppI18n: () => ({
    translate: (key: string) => {
      const translations: Record<string, string> = {
        'filters.area': 'Area, m²',
        'filters.from': 'from',
        'filters.to': 'to',
        'properties.units.area': 'm²',
      }
      return translations[key] || key
    },
  }),
}))

describe('AreaFilter', () => {
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

    wrapper = mount(AreaFilter, {
      props: {
        properties: mockProperties,
        currentFilter: null,
      },
      global: {
        mocks: {
          $t: (key: string) => {
            const translations: Record<string, string> = {
              'filters.area': 'Area, m²',
              'filters.from': 'from',
              'filters.to': 'to',
              'properties.units.area': 'm²',
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
      expect(title.text()).toBe('Area, m²')
    })

    it('should render RangeSlider component', () => {
      const rangeSlider = wrapper.findComponent({ name: 'RangeSlider' })
      expect(rangeSlider.exists()).toBe(true)
    })
  })

  describe('Area Range Calculation', () => {
    it('should calculate correct area range from properties', () => {
      const rangeSlider = wrapper.findComponent({ name: 'RangeSlider' })
      expect(rangeSlider.props('min')).toBe(35)
      expect(rangeSlider.props('max')).toBe(75)
    })

    it('should set default values at 25% and 75% of range', () => {
      const rangeSlider = wrapper.findComponent({ name: 'RangeSlider' })
      // 35 + (75-35)*0.25 = 45
      // 35 + (75-35)*0.75 = 65
      expect(rangeSlider.props('minValue')).toBe(45)
      expect(rangeSlider.props('maxValue')).toBe(65)
    })
  })

  describe('Area Formatting', () => {
    it('should format areas correctly', () => {
      const rangeSlider = wrapper.findComponent({ name: 'RangeSlider' })
      const formatter = rangeSlider.props('formatter')

      expect(formatter(35)).toBe('35 m²')
      expect(formatter(55.5)).toBe('55.5 m²')
    })

    it('should round area values to one decimal place', () => {
      const rangeSlider = wrapper.findComponent({ name: 'RangeSlider' })
      const formatter = rangeSlider.props('formatter')

      expect(formatter(35.123)).toBe('35.1 m²')
      expect(formatter(55.678)).toBe('55.7 m²')
    })
  })

  describe('Filter Emission', () => {
    it('should emit filter event when range changes', async() => {
      const rangeSlider = wrapper.findComponent({ name: 'RangeSlider' })

      // Simulate range change
      await rangeSlider.vm.$emit('update:minValue', 40)
      await rangeSlider.vm.$emit('update:maxValue', 70)

      expect(wrapper.emitted('filter')).toBeTruthy()
      const emitted = wrapper.emitted('filter')
      expect(emitted?.[emitted.length - 1]).toEqual([{ area: { min: 40, max: 70 } }])
    })
  })

  describe('Current Filter Handling', () => {
    it('should use current filter values when provided', () => {
      wrapper = mount(AreaFilter, {
        props: {
          properties: mockProperties,
          currentFilter: { min: 40, max: 70 },
        },
      })

      const rangeSlider = wrapper.findComponent({ name: 'RangeSlider' })
      expect(rangeSlider.props('minValue')).toBe(40)
      expect(rangeSlider.props('maxValue')).toBe(70)
    })

    it('should reset to default values when currentFilter is null', async() => {
      wrapper = mount(AreaFilter, {
        props: {
          properties: mockProperties,
          currentFilter: { min: 40, max: 70 },
        },
      })

      await wrapper.setProps({ currentFilter: null })

      const rangeSlider = wrapper.findComponent({ name: 'RangeSlider' })
      expect(rangeSlider.props('minValue')).toBe(45)
      expect(rangeSlider.props('maxValue')).toBe(65)
    })
  })

  describe('Step Configuration', () => {
    it('should use correct step for area filtering', () => {
      const rangeSlider = wrapper.findComponent({ name: 'RangeSlider' })
      expect(rangeSlider.props('step')).toBe(0.1)
    })
  })
})
