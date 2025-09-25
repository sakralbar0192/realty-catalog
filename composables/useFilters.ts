import { ref, computed, readonly } from 'vue'
import type { Property } from '~/mocks/models'

// Filter types
export type RoomFilter = number | null // null means "all rooms"
export type PriceFilter = { min: number; max: number } | null
export type AreaFilter = { min: number; max: number } | null

export interface FilterState {
  rooms: RoomFilter
  price: PriceFilter
  area: AreaFilter
}

export interface FilterOptions {
  rooms?: RoomFilter
  price?: PriceFilter
  area?: AreaFilter
}

export function useFilters() {
  const filters = ref<FilterState>({
    rooms: null, // null = show all
    price: null,
    area: null,
  })

  // Computed properties for filter checks
  const hasActiveFilters = computed(() => {
    return filters.value.rooms !== null || filters.value.price !== null || filters.value.area !== null
  })

  const activeFilterCount = computed(() => {
    let count = 0
    if (filters.value.rooms !== null) {
      count++
    }
    if (filters.value.price !== null) {
      count++
    }
    if (filters.value.area !== null) {
      count++
    }
    return count
  })

  // Filter functions
  const setRoomFilter = (rooms: RoomFilter) => {
    filters.value.rooms = rooms
  }

  const clearRoomFilter = () => {
    filters.value.rooms = null
  }

  const setPriceFilter = (price: PriceFilter) => {
    filters.value.price = price
  }

  const clearPriceFilter = () => {
    filters.value.price = null
  }

  const setAreaFilter = (area: AreaFilter) => {
    filters.value.area = area
  }

  const clearAreaFilter = () => {
    filters.value.area = null
  }

  const clearAllFilters = () => {
    filters.value = {
      rooms: null,
      price: null,
      area: null,
    }
  }

  const setFilters = (newFilters: Partial<FilterState>) => {
    filters.value = {
      ...filters.value,
      ...newFilters,
    }
  }

  // Apply filters to properties
  const applyFilters = (properties: Property[]): Property[] => {
    let filtered = [...properties]

    // Room filter
    if (filters.value.rooms !== null) {
      filtered = filtered.filter(property => property.rooms === filters.value.rooms)
    }

    // Price filter
    if (filters.value.price !== null) {
      filtered = filtered.filter(property =>
        property.price >= filters.value.price!.min && property.price <= filters.value.price!.max,
      )
    }

    // Area filter
    if (filters.value.area !== null) {
      filtered = filtered.filter(property =>
        property.area >= filters.value.area!.min && property.area <= filters.value.area!.max,
      )
    }

    return filtered
  }

  // Get available filter options based on current properties
  const getAvailableRooms = (properties: Property[]): number[] => {
    const roomCounts = new Set(properties.map(p => p.rooms))
    return Array.from(roomCounts).sort((a, b) => a - b)
  }

  const isRoomFilterAvailable = (roomCount: number, properties: Property[]): boolean => {
    return properties.some(property => property.rooms === roomCount)
  }

  const getPriceRange = (properties: Property[]): { min: number; max: number } => {
    const prices = properties.map(p => p.price)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    }
  }

  const getAreaRange = (properties: Property[]): { min: number; max: number } => {
    const areas = properties.map(p => p.area)
    return {
      min: Math.min(...areas),
      max: Math.max(...areas),
    }
  }

  return {
    // State
    filters: readonly(filters),

    // Computed
    hasActiveFilters,
    activeFilterCount,

    // Actions
    setRoomFilter,
    clearRoomFilter,
    setPriceFilter,
    clearPriceFilter,
    setAreaFilter,
    clearAreaFilter,
    clearAllFilters,
    setFilters,

    // Filtering
    applyFilters,

    // Helpers
    getAvailableRooms,
    isRoomFilterAvailable,
    getPriceRange,
    getAreaRange,
  }
}
