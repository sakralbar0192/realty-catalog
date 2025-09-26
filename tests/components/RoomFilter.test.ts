import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RoomFilter from '../../components/RoomFilter.vue'
import type { Property } from '../../mocks/models'

// Mock the useAppI18n composable
vi.mock('../../composables/useI18n', () => ({
  useAppI18n: () => ({
    translate: (key: string) => {
      const translations: Record<string, string> = {
        'filters.rooms.label': 'Rooms',
        'filters.rooms.all': 'All',
        'filters.rooms.room': 'room',
        'filters.rooms.rooms': 'rooms',
      }
      return translations[key] || key
    },
  }),
}))

describe('RoomFilter', () => {
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
      {
        id: '4',
        name: '4-room flat',
        area: 95,
        floor: 8,
        totalFloors: 16,
        price: 150000,
        imageUrl: '/flat.svg',
        rooms: 4,
      },
    ]

    wrapper = mount(RoomFilter, {
      props: {
        properties: mockProperties,
        currentFilter: null,
        availableRooms: [1, 2, 3, 4],
      },
      global: {
        mocks: {
          $t: (key: string) => {
            const translations: Record<string, string> = {
              'filters.rooms.label': 'Rooms',
              'filters.rooms.all': 'All',
              'filters.rooms.room': 'room',
              'filters.rooms.rooms': 'rooms',
            }
            return translations[key] || key
          },
        },
      },
    })
  })

  describe('Component Structure', () => {
    it('should render room count buttons (1,2,3,4)', () => {
      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBe(4)
      expect(buttons[0].text()).toContain('1')
      expect(buttons[1].text()).toContain('2')
      expect(buttons[2].text()).toContain('3')
      expect(buttons[3].text()).toContain('4')
    })
  })

  describe('Button States', () => {
    it('should have no active button by default', () => {
      const buttons = wrapper.findAll('button')
      buttons.forEach(button => {
        expect(button.classes()).not.toContain('room-filter__button--active')
      })
    })

    it('should enable all room buttons when properties exist', () => {
      const buttons = wrapper.findAll('button')
      buttons.forEach(button => {
        expect(button.attributes('disabled')).toBeUndefined()
      })
    })

    it('should disable room button when no properties match', () => {
      // Create properties without 4-room flats
      const propertiesWithout4Rooms = mockProperties.filter(p => p.rooms !== 4)

      wrapper = mount(RoomFilter, {
        props: {
          properties: propertiesWithout4Rooms,
          currentFilter: null,
          availableRooms: [1, 2, 3], // 4 is not available
        },
        global: {
          mocks: {
            $t: (key: string) => key,
          },
        },
      })

      const buttons = wrapper.findAll('button')
      const button4 = buttons[3] // 4-room button (index 3, since no "All" button)
      expect(button4.attributes('disabled')).toBeDefined()
    })

    it('should disable all room buttons when loading is true', () => {
      wrapper = mount(RoomFilter, {
        props: {
          properties: mockProperties,
          currentFilter: null,
          availableRooms: [1, 2, 3, 4],
          loading: true,
        },
        global: {
          mocks: {
            $t: (key: string) => key,
          },
        },
      })

      const buttons = wrapper.findAll('button')
      buttons.forEach(button => {
        expect(button.attributes('disabled')).toBeDefined()
        expect(button.attributes('aria-disabled')).toBe('true')
      })
    })

    it('should not emit event when clicking button while loading', async() => {
      wrapper = mount(RoomFilter, {
        props: {
          properties: mockProperties,
          currentFilter: null,
          availableRooms: [1, 2, 3, 4],
          loading: true,
        },
        global: {
          mocks: {
            $t: (key: string) => key,
          },
        },
      })

      const button2 = wrapper.findAll('button')[1] // 2-room button

      await button2.trigger('click')

      expect(wrapper.emitted('filter')).toBeFalsy()
    })

    it('should activate clicked room button and deactivate others', async() => {
      const buttons = wrapper.findAll('button')
      const button2 = buttons[1] // 2-room button (index 1)

      await button2.trigger('click')

      // Check that event was emitted
      expect(wrapper.emitted('filter')).toBeTruthy()
      expect(wrapper.emitted('filter')?.[0]).toEqual([{ rooms: 2 }])

      // Update props to simulate parent component reaction
      await wrapper.setProps({ currentFilter: 2 })

      // Now check aria-pressed attributes
      expect(button2.attributes('aria-pressed')).toBe('true')
      expect(buttons[0].attributes('aria-pressed')).toBe('false') // 1-room button
      expect(buttons[2].attributes('aria-pressed')).toBe('false') // 3-room button
      expect(buttons[3].attributes('aria-pressed')).toBe('false') // 4-room button
    })

    it('should deactivate filter when clicking on active button', async() => {
      const buttons = wrapper.findAll('button')
      const button3 = buttons[2] // 3-room button (index 2)

      // Set initial active state
      await wrapper.setProps({ currentFilter: 3 })
      expect(button3.attributes('aria-pressed')).toBe('true')

      // Click on active button deactivates it
      await button3.trigger('click')
      expect(wrapper.emitted('filter')?.[0]).toEqual([{ rooms: null }])

      // Update props to simulate parent reaction
      await wrapper.setProps({ currentFilter: null })
      expect(button3.attributes('aria-pressed')).toBe('false')
    })

    it('should update active state when currentFilter prop changes', async() => {
      const buttons = wrapper.findAll('button')
      const button2 = buttons[1] // 2-room button

      // Initially no active filter
      expect(button2.attributes('aria-pressed')).toBe('false')

      // Update prop to make button2 active
      await wrapper.setProps({ currentFilter: 2 })
      expect(button2.attributes('aria-pressed')).toBe('true')

      // Update prop to clear filter
      await wrapper.setProps({ currentFilter: null })
      expect(button2.attributes('aria-pressed')).toBe('false')
    })
  })

  describe('Filtering Logic', () => {
    it('should emit "filter" event with room count when room button clicked', async() => {
      const button3 = wrapper.findAll('button')[2] // 3-room button (index 2)

      await button3.trigger('click')

      expect(wrapper.emitted('filter')).toBeTruthy()
      expect(wrapper.emitted('filter')?.[0]).toEqual([{ rooms: 3 }])
    })

    it('should not emit event when clicking disabled button', async() => {
      // Create properties without 4-room flats
      const propertiesWithout4Rooms = mockProperties.filter(p => p.rooms !== 4)

      wrapper = mount(RoomFilter, {
        props: {
          properties: propertiesWithout4Rooms,
          currentFilter: null,
          availableRooms: [1, 2, 3], // 4 is not available
        },
        global: {
          mocks: {
            $t: (key: string) => key,
          },
        },
      })

      const button4 = wrapper.findAll('button')[3] // 4-room button (index 3)

      await button4.trigger('click')

      expect(wrapper.emitted('filter')).toBeFalsy()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for buttons', () => {
      const buttons = wrapper.findAll('button')

      buttons.forEach((button) => {
        expect(button.attributes('aria-label')).toBeDefined()
        expect(button.attributes('aria-label')).not.toBe('')
      })
    })

    it('should have aria-pressed false for all buttons by default', () => {
      const buttons = wrapper.findAll('button')
      buttons.forEach(button => {
        expect(button.attributes('aria-pressed')).toBe('false')
      })
    })

    it('should update aria-pressed when button clicked', async() => {
      const button2 = wrapper.findAll('button')[1] // 2-room button

      await button2.trigger('click')
      expect(wrapper.emitted('filter')?.[0]).toEqual([{ rooms: 2 }])

      // Update props to simulate parent reaction
      await wrapper.setProps({ currentFilter: 2 })

      expect(button2.attributes('aria-pressed')).toBe('true')
      expect(wrapper.findAll('button')[0].attributes('aria-pressed')).toBe('false') // 1-room button
      expect(wrapper.findAll('button')[2].attributes('aria-pressed')).toBe('false') // 3-room button
    })

    it('should be keyboard accessible', async() => {
      const button2 = wrapper.findAll('button')[1] // 2-room button

      await button2.trigger('keydown.space')

      expect(wrapper.emitted('filter')).toBeTruthy()
      expect(wrapper.emitted('filter')?.[0]).toEqual([{ rooms: 2 }])
    })

    it('should indicate disabled state with aria-disabled', () => {
      // Create properties without 4-room flats
      const propertiesWithout4Rooms = mockProperties.filter(p => p.rooms !== 4)

      wrapper = mount(RoomFilter, {
        props: {
          properties: propertiesWithout4Rooms,
          currentFilter: null,
          availableRooms: [1, 2, 3], // 4 is not available
        },
        global: {
          mocks: {
            $t: (key: string) => key,
          },
        },
      })

      const button4 = wrapper.findAll('button')[3] // 4-room button (index 3)
      expect(button4.attributes('aria-disabled')).toBe('true')
    })
  })

  describe('Styling', () => {
    it('should have buttons with proper styling classes', () => {
      const buttons = wrapper.findAll('button')

      buttons.forEach((button) => {
        // Check that buttons have CSS Modules classes applied
        expect(button.classes().length).toBeGreaterThan(0)
        // Check that at least one class contains the expected pattern
        expect(button.classes().some(cls => cls.includes('room-filter'))).toBe(true)
      })
    })

    it('should have different styling when button is active', async() => {
      const button2 = wrapper.findAll('button')[1] // 2-room button

      await button2.trigger('click')
      await wrapper.setProps({ currentFilter: 2 })

      // Check that active button has more classes than inactive ones (active state adds class)
      expect(button2.classes().length).toBeGreaterThan(1)
    })

    it('should have disabled styling for unavailable rooms', () => {
      // Create properties without 4-room flats
      const propertiesWithout4Rooms = mockProperties.filter(p => p.rooms !== 4)

      wrapper = mount(RoomFilter, {
        props: {
          properties: propertiesWithout4Rooms,
          currentFilter: null,
        },
        global: {
          mocks: {
            $t: (key: string) => key,
          },
        },
      })

      const button4 = wrapper.findAll('button')[3] // 4-room button (index 3)
      expect(button4.attributes('disabled')).toBeDefined()
    })
  })

  describe('i18n', () => {
    it('should handle singular/plural room labels', () => {
      const buttons = wrapper.findAll('button')
      expect(buttons[0].attributes('aria-label')).toContain('1 room') // 1-room button
      expect(buttons[1].attributes('aria-label')).toContain('2 rooms') // 2-room button
    })
  })
})
