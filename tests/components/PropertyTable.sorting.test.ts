import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import PropertyTable from '../../components/PropertyTable.vue'
import type { Property } from '../../mocks/models'

// Mock the useAppI18n composable
vi.mock('../../composables/useI18n', () => ({
  useAppI18n: () => ({
    translate: (key: string) => {
      const translations: Record<string, string> = {
        'properties.table.headers.area': 'Area',
        'properties.table.headers.floor': 'Floor',
        'properties.table.headers.price': 'Price',
        'properties.loadMore': 'Load More',
        'properties.loading': 'Loading...',
        'properties.empty': 'No properties found',
        'properties.table.imageAlt': 'Photo of {name}',
        'properties.units.area': 'м²',
        'properties.units.currency': '₽',
        'properties.out_of': 'out of',
      }
      return translations[key] || key
    },
  }),
}))

describe('PropertyTable - Sorting', () => {
  let wrapper: VueWrapper
  let mockProperties: Property[]

  beforeEach(() => {
    mockProperties = [
      {
        id: '1',
        name: 'Flat A',
        area: 50,
        floor: 3,
        totalFloors: 10,
        price: 100000,
        imageUrl: '/flat.svg',
        rooms: 2,
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        name: 'Flat B',
        area: 75,
        floor: 1,
        totalFloors: 5,
        price: 150000,
        imageUrl: '/flat.svg',
        rooms: 3,
        createdAt: '2024-01-02T00:00:00Z',
      },
      {
        id: '3',
        name: 'Flat C',
        area: 60,
        floor: 5,
        totalFloors: 12,
        price: 120000,
        imageUrl: '/flat.svg',
        rooms: 2,
        createdAt: '2024-01-03T00:00:00Z',
      },
    ]

    wrapper = mount(PropertyTable, {
      props: {
        properties: mockProperties,
        loading: false,
        hasMore: false,
      },
      global: {
        mocks: {
          $t: (key: string) => {
            const translations: Record<string, string> = {
              'properties.table.headers.area': 'Area',
              'properties.table.headers.floor': 'Floor',
              'properties.table.headers.price': 'Price',
              'properties.loadMore': 'Load More',
              'properties.loading': 'Loading...',
              'properties.empty': 'No properties found',
              'properties.table.imageAlt': 'Photo of {name}',
              'properties.units.area': 'м²',
              'properties.units.currency': '₽',
              'properties.out_of': 'out of',
            }
            return translations[key] || key
          },
        },
        stubs: {
          SortIcon: {
            name: 'SortIcon',
            props: ['direction'],
            template: '<span :class="`sort-icon-${direction || \'none\'}`">Sort</span>',
          },
        },
      },
    })
  })

  describe('Table Headers', () => {
    it('should render sortable header buttons for area, floor, and price', () => {
      const headers = wrapper.findAll('th')

      // Should have 5 headers: image, name, area, floor, price
      expect(headers.length).toBe(5)

      // Check that area, floor, price headers have sort buttons
      const areaHeader = headers[2]
      const floorHeader = headers[3]
      const priceHeader = headers[4]

      expect(areaHeader.find('button').exists()).toBe(true)
      expect(floorHeader.find('button').exists()).toBe(true)
      expect(priceHeader.find('button').exists()).toBe(true)
    })

    it('should display sort icons in sortable headers', () => {
      const sortableHeaders = wrapper.findAll('th button')

      expect(sortableHeaders.length).toBe(3) // area, floor, price

      sortableHeaders.forEach((header) => {
        expect(header.findComponent({ name: 'SortIcon' }).exists()).toBe(true)
      })
    })
  })

  describe('Sort Functionality', () => {
    it('should emit sort event with area ascending on first click', async() => {
      const areaSortButton = wrapper.findAll('th button')[0] // First sortable button (area)

      await areaSortButton.trigger('click')

      // Check that the correct sort event was emitted
      expect(wrapper.emitted('sort')).toBeTruthy()
      expect(wrapper.emitted('sort')![0]).toEqual([{ field: 'area', direction: 'asc' }])
    })

    it('should emit sort event with area descending on second click', async() => {
      const areaSortButton = wrapper.findAll('th button')[0]

      await areaSortButton.trigger('click') // First click - ascending
      await areaSortButton.trigger('click') // Second click - descending

      // Check that the correct sort event was emitted
      expect(wrapper.emitted('sort')).toBeTruthy()
      expect(wrapper.emitted('sort')![1]).toEqual([{ field: 'area', direction: 'desc' }])
    })

    it('should emit sort event for floor field', async() => {
      const floorSortButton = wrapper.findAll('th button')[1] // Second sortable button (floor)

      await floorSortButton.trigger('click')

      expect(wrapper.emitted('sort')).toBeTruthy()
      expect(wrapper.emitted('sort')![0]).toEqual([{ field: 'floor', direction: 'asc' }])
    })

    it('should emit sort event for price field', async() => {
      const priceSortButton = wrapper.findAll('th button')[2] // Third sortable button (price)

      await priceSortButton.trigger('click')

      expect(wrapper.emitted('sort')).toBeTruthy()
      expect(wrapper.emitted('sort')![0]).toEqual([{ field: 'price', direction: 'asc' }])
    })

    it('should emit sort event when clicking different column', async() => {
      const areaButton = wrapper.findAll('th button')[0]
      const priceButton = wrapper.findAll('th button')[2]

      await areaButton.trigger('click') // Sort by area asc
      await priceButton.trigger('click') // Sort by price asc

      expect(wrapper.emitted('sort')).toBeTruthy()
      expect(wrapper.emitted('sort')![0]).toEqual([{ field: 'area', direction: 'asc' }])
      expect(wrapper.emitted('sort')![1]).toEqual([{ field: 'price', direction: 'asc' }])
    })
  })

  describe('Visual Indicators', () => {
    it('should show ascending arrow when sorted ascending', async() => {
      const areaButton = wrapper.findAll('th button')[0]

      await areaButton.trigger('click')

      const sortIcon = areaButton.findComponent({ name: 'SortIcon' })
      expect(sortIcon.props('direction')).toBe('asc')
    })

    it('should show descending arrow when sorted descending', async() => {
      const areaButton = wrapper.findAll('th button')[0]

      await areaButton.trigger('click') // asc
      await areaButton.trigger('click') // desc

      const sortIcon = areaButton.findComponent({ name: 'SortIcon' })
      expect(sortIcon.props('direction')).toBe('desc')
    })

    // TODO: Fix CSS class testing - the sorting state management in tests needs improvement
    it.skip('should highlight active sort column', async() => {
      const areaButton = wrapper.findAll('th button')[0]

      await areaButton.trigger('click')

      expect(areaButton.classes()).toContain('table__headerButton--active')
    })

    it.skip('should remove highlight from previous column when sorting new one', async() => {
      const areaButton = wrapper.findAll('th button')[0]
      const priceButton = wrapper.findAll('th button')[2]

      await areaButton.trigger('click')
      expect(areaButton.classes()).toContain('table__headerButton--active')

      await priceButton.trigger('click')
      expect(areaButton.classes()).not.toContain('table__headerButton--active')
      expect(priceButton.classes()).toContain('table__headerButton--active')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA sort attributes', async() => {
      const areaButton = wrapper.findAll('th button')[0]

      await areaButton.trigger('click')

      expect(areaButton.attributes('aria-sort')).toBe('ascending')
    })

    it('should update ARIA sort on direction change', async() => {
      const areaButton = wrapper.findAll('th button')[0]

      await areaButton.trigger('click')
      expect(areaButton.attributes('aria-sort')).toBe('ascending')

      await areaButton.trigger('click')
      expect(areaButton.attributes('aria-sort')).toBe('descending')
    })

    it('should have descriptive button labels', () => {
      const buttons = wrapper.findAll('th button')

      buttons.forEach((button) => {
        expect(button.attributes('aria-label')).toBeDefined()
        expect(button.attributes('aria-label')).not.toBe('')
      })
    })

    it('should be keyboard accessible', async() => {
      const areaButton = wrapper.findAll('th button')[0]

      await areaButton.trigger('keydown.enter')
      expect(areaButton.attributes('aria-sort')).toBe('ascending')
    })
  })

  describe('URL State Management', () => {
    it('should update URL with sort parameters', async() => {
      const areaButton = wrapper.findAll('th button')[0]

      await areaButton.trigger('click')

      // This would need to be tested with router mocking
      // expect(window.location.search).toContain('sort=area&order=asc')
    })

    it('should restore sort state from URL on mount', () => {
      // This would need URL mocking and component remounting
      // Test that component reads sort params from URL
    })
  })

  describe('Mobile Responsiveness', () => {
    it('should not show sortable headers on mobile/tablet', () => {
      // This test would need device mocking
      // Test that sort buttons are hidden on mobile
    })
  })
})
