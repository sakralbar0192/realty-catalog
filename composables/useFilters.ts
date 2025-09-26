import { computed, readonly } from 'vue'
import { storeToRefs } from 'pinia'
import type { Property } from '~/mocks/models'
import { usePropertyStore } from '~/stores/property'

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
  const propertyStore = usePropertyStore()
  const { filters, filterMetadata } = storeToRefs(propertyStore)

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
    propertyStore.setFilters({ rooms })
  }

  const clearRoomFilter = () => {
    propertyStore.setFilters({ rooms: null })
  }

  const setPriceFilter = (price: PriceFilter) => {
    propertyStore.setFilters({ price })
  }

  const clearPriceFilter = () => {
    propertyStore.setFilters({ price: null })
  }

  const setAreaFilter = (area: AreaFilter) => {
    propertyStore.setFilters({ area })
  }

  const clearAreaFilter = () => {
    propertyStore.setFilters({ area: null })
  }

  const clearAllFilters = async() => {
    await propertyStore.clearFilters()
  }

  const setFilters = async(newFilters: Partial<FilterState>) => {
    await propertyStore.setFilters(newFilters)
  }

  // Apply filters to properties (now server-side, so just return as-is)
  const applyFilters = (properties: Property[]): Property[] => {
    return properties
  }

  // Get available filter options based on server metadata
  const getAvailableRooms = (): number[] => {
    return filterMetadata.value?.availableRooms || []
  }

  const isRoomFilterAvailable = (roomCount: number): boolean => {
    return filterMetadata.value?.availableRooms.includes(roomCount) || false
  }

  const getPriceRange = (): { min: number; max: number } => {
    return filterMetadata.value?.priceRange || { min: 0, max: 0 }
  }

  const getAreaRange = (): { min: number; max: number } => {
    return filterMetadata.value?.areaRange || { min: 0, max: 0 }
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
