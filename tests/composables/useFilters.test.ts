import { describe, it, expect, beforeEach } from 'vitest'
import { useFilters } from '../../composables/useFilters'
import type { Property } from '../../mocks/models'

describe('useFilters', () => {
  let filters: ReturnType<typeof useFilters>
  let mockProperties: Property[]

  beforeEach(() => {
    // Reset filters before each test
    filters = useFilters()
    filters.clearAllFilters()

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
  })

  describe('Initial State', () => {
    it('should initialize with no active filters', () => {
      expect(filters.filters.value.rooms).toBe(null)
      expect(filters.filters.value.price).toBe(null)
      expect(filters.filters.value.area).toBe(null)
      expect(filters.hasActiveFilters.value).toBe(false)
      expect(filters.activeFilterCount.value).toBe(0)
    })
  })

  describe('Room Filtering', () => {
    it('should set room filter', () => {
      filters.setRoomFilter(2)
      expect(filters.filters.value.rooms).toBe(2)
      expect(filters.hasActiveFilters.value).toBe(true)
      expect(filters.activeFilterCount.value).toBe(1)
    })

    it('should clear room filter', () => {
      filters.setRoomFilter(2)
      filters.clearRoomFilter()
      expect(filters.filters.value.rooms).toBe(null)
    })

    it('should filter properties by rooms', () => {
      filters.setRoomFilter(2)
      const filtered = filters.applyFilters(mockProperties)
      expect(filtered.length).toBe(1)
      expect(filtered[0].rooms).toBe(2)
    })
  })

  describe('Price Filtering', () => {
    it('should set price filter', () => {
      const priceFilter = { min: 60000, max: 120000 }
      filters.setPriceFilter(priceFilter)
      expect(filters.filters.value.price).toEqual(priceFilter)
      expect(filters.hasActiveFilters.value).toBe(true)
      expect(filters.activeFilterCount.value).toBe(1)
    })

    it('should clear price filter', () => {
      filters.setPriceFilter({ min: 60000, max: 120000 })
      filters.clearPriceFilter()
      expect(filters.filters.value.price).toBe(null)
    })

    it('should filter properties by price range', () => {
      filters.setPriceFilter({ min: 60000, max: 120000 })
      const filtered = filters.applyFilters(mockProperties)
      expect(filtered.length).toBe(2) // Properties with prices 75000 and 100000
      expect(filtered.every(p => p.price >= 60000 && p.price <= 120000)).toBe(true)
    })

    it('should include properties at boundary values', () => {
      filters.setPriceFilter({ min: 75000, max: 100000 })
      const filtered = filters.applyFilters(mockProperties)
      expect(filtered.length).toBe(2) // Properties with prices exactly 75000 and 100000
    })
  })

  describe('Area Filtering', () => {
    it('should set area filter', () => {
      const areaFilter = { min: 40, max: 80 }
      filters.setAreaFilter(areaFilter)
      expect(filters.filters.value.area).toEqual(areaFilter)
      expect(filters.hasActiveFilters.value).toBe(true)
      expect(filters.activeFilterCount.value).toBe(1)
    })

    it('should clear area filter', () => {
      filters.setAreaFilter({ min: 40, max: 80 })
      filters.clearAreaFilter()
      expect(filters.filters.value.area).toBe(null)
    })

    it('should filter properties by area range', () => {
      filters.setAreaFilter({ min: 40, max: 80 })
      const filtered = filters.applyFilters(mockProperties)
      expect(filtered.length).toBe(2) // Properties with areas 55 and 75
      expect(filtered.every(p => p.area >= 40 && p.area <= 80)).toBe(true)
    })
  })

  describe('Combined Filtering', () => {
    it('should apply multiple filters simultaneously', () => {
      filters.setRoomFilter(3)
      filters.setPriceFilter({ min: 80000, max: 120000 })
      filters.setAreaFilter({ min: 60, max: 90 })

      const filtered = filters.applyFilters(mockProperties)
      expect(filtered.length).toBe(1) // Only the 3-room flat with price 100000 and area 75
      expect(filtered[0].id).toBe('3')
      expect(filters.activeFilterCount.value).toBe(3)
    })

    it('should count active filters correctly', () => {
      filters.setRoomFilter(2)
      expect(filters.activeFilterCount.value).toBe(1)

      filters.setPriceFilter({ min: 60000, max: 120000 })
      expect(filters.activeFilterCount.value).toBe(2)

      filters.setAreaFilter({ min: 40, max: 80 })
      expect(filters.activeFilterCount.value).toBe(3)
    })
  })

  describe('Filter Management', () => {
    it('should clear all filters', () => {
      filters.setRoomFilter(2)
      filters.setPriceFilter({ min: 60000, max: 120000 })
      filters.setAreaFilter({ min: 40, max: 80 })

      filters.clearAllFilters()

      expect(filters.filters.value.rooms).toBe(null)
      expect(filters.filters.value.price).toBe(null)
      expect(filters.filters.value.area).toBe(null)
      expect(filters.hasActiveFilters.value).toBe(false)
    })

    it('should set multiple filters at once', () => {
      const newFilters = {
        rooms: 3 as const,
        price: { min: 80000, max: 120000 },
        area: { min: 60, max: 90 },
      }

      filters.setFilters(newFilters)

      expect(filters.filters.value).toEqual(newFilters)
    })
  })

  describe('Helper Functions', () => {
    it('should get available rooms', () => {
      const availableRooms = filters.getAvailableRooms(mockProperties)
      expect(availableRooms).toEqual([1, 2, 3, 4])
    })

    it('should check if room filter is available', () => {
      expect(filters.isRoomFilterAvailable(2, mockProperties)).toBe(true)
      expect(filters.isRoomFilterAvailable(5, mockProperties)).toBe(false)
    })

    it('should get price range', () => {
      const priceRange = filters.getPriceRange(mockProperties)
      expect(priceRange).toEqual({ min: 50000, max: 150000 })
    })

    it('should get area range', () => {
      const areaRange = filters.getAreaRange(mockProperties)
      expect(areaRange).toEqual({ min: 35, max: 95 })
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty properties array', () => {
      const filtered = filters.applyFilters([])
      expect(filtered).toEqual([])
    })

    it('should handle filters with no matching properties', () => {
      filters.setPriceFilter({ min: 200000, max: 300000 })
      const filtered = filters.applyFilters(mockProperties)
      expect(filtered).toEqual([])
    })

    it('should handle null filters gracefully', () => {
      filters.setFilters({
        rooms: null,
        price: null,
        area: null,
      })
      const filtered = filters.applyFilters(mockProperties)
      expect(filtered).toEqual(mockProperties)
    })
  })
})
