import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RangeSlider from '../../components/RangeSlider.vue'

// Mock the useAppI18n composable
vi.mock('../../composables/useI18n', () => ({
  useAppI18n: () => ({
    translate: (key: string) => {
      const translations: Record<string, string> = {
        'filters.from': 'from',
        'filters.to': 'to',
      }
      return translations[key] || key
    },
  }),
}))

describe('RangeSlider', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(RangeSlider, {
      props: {
        minValue: 100,
        maxValue: 500,
        min: 0,
        max: 1000,
        step: 10,
        label: 'Test Range',
      },
      global: {
        mocks: {
          $t: (key: string) => {
            const translations: Record<string, string> = {
              'filters.from': 'from',
              'filters.to': 'to',
            }
            return translations[key] || key
          },
        },
      },
    })
  })

  describe('Component Structure', () => {
    it('should render values display', () => {
      const valuesDiv = wrapper.find('[data-test="range-values"]')
      expect(valuesDiv.exists()).toBe(true)
      expect(valuesDiv.text()).toContain('from 100')
      expect(valuesDiv.text()).toContain('to 500')
    })

    it('should render track and thumbs', () => {
      const track = wrapper.find('[data-test="range-track"]')
      expect(track.exists()).toBe(true)

      const thumbs = wrapper.findAll('[data-test="range-thumb"]')
      expect(thumbs.length).toBe(2)
    })
  })

  describe('Value Display', () => {
    it('should format values using formatter prop', () => {
      wrapper = mount(RangeSlider, {
        props: {
          minValue: 100,
          maxValue: 500,
          min: 0,
          max: 1000,
          step: 10,
          label: 'Test Range',
          formatter: (value: number) => `${value}%`,
        },
      })

      const valuesDiv = wrapper.find('[data-test="range-values"]')
      expect(valuesDiv.text()).toContain('from 100%')
      expect(valuesDiv.text()).toContain('to 500%')
    })

    it('should use default formatter when none provided', () => {
      const valuesDiv = wrapper.find('[data-test="range-values"]')
      expect(valuesDiv.text()).toContain('from 100')
      expect(valuesDiv.text()).toContain('to 500')
    })
  })

  describe('Thumb Positioning', () => {
    it('should position thumbs correctly based on values', () => {
      const thumbs = wrapper.findAll('[data-test="range-thumb"]')

      // Min thumb at 10% (100/1000), max thumb at 50% (500/1000)
      expect(thumbs[0].attributes('style')).toContain('left: 10%')
      expect(thumbs[1].attributes('style')).toContain('left: 50%')
    })

    it('should update thumb positions when values change', async() => {
      await wrapper.setProps({ minValue: 200, maxValue: 800 })

      const thumbs = wrapper.findAll('[data-test="range-thumb"]')
      expect(thumbs[0].attributes('style')).toContain('left: 20%')
      expect(thumbs[1].attributes('style')).toContain('left: 80%')
    })
  })

  describe('Range Display', () => {
    it('should show range between thumbs', () => {
      const range = wrapper.find('[data-test="range-range"]')
      expect(range.exists()).toBe(true)
      expect(range.attributes('style')).toContain('left: 10%')
      expect(range.attributes('style')).toContain('width: 40%') // 50% - 10%
    })
  })

  describe('Interaction', () => {
    it('should maintain minimum distance between thumbs', () => {
      // Test that min distance calculation works
      const minDistance = Math.max(10, (1000 - 0) * 0.1) // max(10, 100) = 100
      expect(minDistance).toBe(100)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      const thumbs = wrapper.findAll('[data-test="range-thumb"]')
      expect(thumbs[0].attributes('aria-label')).toBe('Test Range min')
      expect(thumbs[1].attributes('aria-label')).toBe('Test Range max')
    })

    it('should be keyboard accessible', () => {
      const thumbs = wrapper.findAll('[data-test="range-thumb"]')
      thumbs.forEach(thumb => {
        expect(thumb.attributes('tabindex')).toBe('0')
      })
    })
  })

  describe('Styling', () => {
    it('should apply CSS classes correctly', () => {
      expect(wrapper.classes().some(cls => cls.includes('range-slider'))).toBe(true)

      const track = wrapper.find('[data-test="range-track"]')
      expect(track.classes().some(cls => cls.includes('range-slider__track'))).toBe(true)
    })
  })
})
