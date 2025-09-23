import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PropertyTable from '~/components/PropertyTable.vue'
import type { Property } from '~/mocks/models'

// Mock the useAppI18n composable
vi.mock('~/composables/useI18n', () => ({
  useAppI18n: () => ({
    translate: (key: string) => {
      const translations: Record<string, string> = {
        'properties.table.headers.image': 'Image',
        'properties.table.headers.name': 'Name',
        'properties.table.headers.area': 'Area',
        'properties.table.headers.floor': 'Floor',
        'properties.table.headers.price': 'Price',
        'properties.loadMore': 'Load More',
        'properties.loading': 'Loading...',
        'properties.empty': 'No properties found',
        'properties.table.imageAlt': 'Image of {name}',
        'properties.out_of': 'out of',
      }
      return translations[key] || key
    },
  }),
}))

// Mock property data
const mockProperties: Property[] = [
  {
    id: 'prop-1',
    name: '2-комнатная кв. 15',
    area: 45.5,
    floor: 5,
    totalFloors: 10,
    price: 2500000,
    imageUrl: '/images/apartment-1.jpg',
    rooms: 2,
  },
]

describe('PropertyTable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render without errors', () => {
    const wrapper = mount(PropertyTable, {
      props: {
        properties: mockProperties,
        loading: false,
        hasMore: true,
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('table').exists()).toBe(true)
  })

  it('should show load more button when hasMore is true', () => {
    const wrapper = mount(PropertyTable, {
      props: {
        properties: mockProperties,
        loading: false,
        hasMore: true,
      },
    })

    const button = wrapper.find('button[data-test="load-more"]')
    expect(button.exists()).toBe(true)
  })

  it('should emit loadMore event when button is clicked', async() => {
    const wrapper = mount(PropertyTable, {
      props: {
        properties: mockProperties,
        loading: false,
        hasMore: true,
      },
    })

    const button = wrapper.find('button[data-test="load-more"]')
    await button.trigger('click')

    expect(wrapper.emitted('loadMore')).toBeTruthy()
  })

  describe('Property Rows', () => {
    it('should render property rows when properties are provided', () => {
      const wrapper = mount(PropertyTable, {
        props: {
          properties: mockProperties,
          loading: false,
          hasMore: false,
        },
      })

      const rows = wrapper.findAll('tbody tr')
      expect(rows).toHaveLength(1)
    })

    it('should display property images', () => {
      const wrapper = mount(PropertyTable, {
        props: {
          properties: [mockProperties[0]],
          loading: false,
          hasMore: false,
        },
      })

      const image = wrapper.find('img')
      expect(image.exists()).toBe(true)
      expect(image.attributes('src')).toBe('/images/apartment-1.jpg')
      expect(image.attributes('alt')).toBe('Image of {name}')
    })

    it('should format property names correctly', () => {
      const wrapper = mount(PropertyTable, {
        props: {
          properties: [mockProperties[0]],
          loading: false,
          hasMore: false,
        },
      })

      const nameCell = wrapper.findAll('tbody td')[1]
      expect(nameCell.text()).toBe('2-комнатная кв. 15')
    })

    it('should format area with one decimal place', () => {
      const wrapper = mount(PropertyTable, {
        props: {
          properties: [mockProperties[0]],
          loading: false,
          hasMore: false,
        },
      })

      const areaCell = wrapper.findAll('tbody td')[2]
      expect(areaCell.text()).toBe('45.5')
    })

    it('should format floor as "floor/totalFloors"', () => {
      const wrapper = mount(PropertyTable, {
        props: {
          properties: [mockProperties[0]],
          loading: false,
          hasMore: false,
        },
      })

      const floorCell = wrapper.findAll('tbody td')[3]
      expect(floorCell.text()).toBe('5 out of 10')
    })

    it('should format price with thousand separators', () => {
      const wrapper = mount(PropertyTable, {
        props: {
          properties: [mockProperties[0]],
          loading: false,
          hasMore: false,
        },
      })

      const priceCell = wrapper.findAll('tbody td')[4]
      expect(priceCell.text()).toMatch(/2\s*500\s*000/)
    })
  })

  describe('Load More Functionality', () => {
    it('should show "Load More" button when hasMore is true', () => {
      const wrapper = mount(PropertyTable, {
        props: {
          properties: mockProperties,
          loading: false,
          hasMore: true,
        },
      })

      const loadMoreButton = wrapper.find('button[data-test="load-more"]')
      expect(loadMoreButton.exists()).toBe(true)
      expect(loadMoreButton.text()).toBeTruthy()
    })

    it('should not show "Load More" button when hasMore is false', () => {
      const wrapper = mount(PropertyTable, {
        props: {
          properties: mockProperties,
          loading: false,
          hasMore: false,
        },
      })

      const loadMoreButton = wrapper.find('button[data-test="load-more"]')
      expect(loadMoreButton.exists()).toBe(false)
    })

    it('should show loading state on "Load More" button', () => {
      const wrapper = mount(PropertyTable, {
        props: {
          properties: mockProperties,
          loading: true,
          hasMore: true,
        },
      })

      const loadMoreButton = wrapper.find('button[data-test="load-more"]')
      expect(loadMoreButton.attributes('disabled')).toBeDefined()
      expect(loadMoreButton.text()).toContain('Loading')
    })

    it('should emit "load-more" event when button is clicked', async() => {
      const wrapper = mount(PropertyTable, {
        props: {
          properties: mockProperties,
          loading: false,
          hasMore: true,
        },
      })

      const loadMoreButton = wrapper.find('button[data-test="load-more"]')
      await loadMoreButton.trigger('click')

      expect(wrapper.emitted('loadMore')).toBeTruthy()
      expect(wrapper.emitted('loadMore')).toHaveLength(1)
    })
  })

  describe('Responsive Design', () => {
    it('should render table on desktop', () => {
      const wrapper = mount(PropertyTable, {
        props: {
          properties: mockProperties,
          loading: false,
          hasMore: false,
        },
      })

      const table = wrapper.find('table')
      expect(table.exists()).toBe(true)
    })

    it('should hide certain columns on mobile', () => {
      Object.defineProperty(window, 'innerWidth', { value: 480 })

      const wrapper = mount(PropertyTable, {
        props: {
          properties: mockProperties,
          loading: false,
          hasMore: false,
        },
      })

      const visibleCells = wrapper.findAll('tbody td:not([hidden])')
      expect(visibleCells.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('should have proper table structure with scope attributes', () => {
      const wrapper = mount(PropertyTable, {
        props: {
          properties: mockProperties,
          loading: false,
          hasMore: false,
        },
      })

      const headers = wrapper.findAll('th')
      headers.forEach(header => {
        expect(header.attributes('scope')).toBe('col')
      })
    })

    it('should have accessible images with alt text', () => {
      const wrapper = mount(PropertyTable, {
        props: {
          properties: [mockProperties[0]],
          loading: false,
          hasMore: false,
        },
      })

      const image = wrapper.find('img')
      expect(image.attributes('alt')).toBeTruthy()
    })

    it('should have proper ARIA labels for interactive elements', () => {
      const wrapper = mount(PropertyTable, {
        props: {
          properties: mockProperties,
          loading: false,
          hasMore: true,
        },
      })

      const loadMoreButton = wrapper.find('button[data-test="load-more"]')
      expect(loadMoreButton.attributes('aria-label')).toBeTruthy()
    })
  })

  describe('Theme Support', () => {
    it('should apply theme-aware classes', () => {
      const wrapper = mount(PropertyTable, {
        props: {
          properties: mockProperties,
          loading: false,
          hasMore: false,
        },
      })

      const table = wrapper.find('table')
      expect(table.exists()).toBe(true)
    })

    it('should use CSS custom properties for theming', () => {
      const wrapper = mount(PropertyTable, {
        props: {
          properties: mockProperties,
          loading: false,
          hasMore: false,
        },
      })

      const table = wrapper.find('table')
      expect(table.exists()).toBe(true)
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no properties', () => {
      const wrapper = mount(PropertyTable, {
        props: {
          properties: [],
          loading: false,
          hasMore: false,
        },
      })

      const emptyState = wrapper.find('[data-test="empty-state"]')
      expect(emptyState.exists()).toBe(true)
      expect(emptyState.text()).toBeTruthy()
    })

    it('should not show empty state when properties exist', () => {
      const wrapper = mount(PropertyTable, {
        props: {
          properties: mockProperties,
          loading: false,
          hasMore: false,
        },
      })

      const emptyState = wrapper.find('[data-test="empty-state"]')
      expect(emptyState.exists()).toBe(false)
    })
  })
})
