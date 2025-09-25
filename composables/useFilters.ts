import { ref, computed, readonly } from 'vue'
import type { Property } from '~/mocks/models'

// Filter types
export type RoomFilter = number | null // null means "all rooms"

export interface FilterState {
  rooms: RoomFilter
}

export interface FilterOptions {
  rooms?: RoomFilter
}

export function useFilters() {
  const filters = ref<FilterState>({
    rooms: null, // null = show all
  })

  // Computed properties for filter checks
  const hasActiveFilters = computed(() => {
    return filters.value.rooms !== null
  })

  const activeFilterCount = computed(() => {
    let count = 0
    if (filters.value.rooms !== null) {
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

  const clearAllFilters = () => {
    filters.value = {
      rooms: null,
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

  return {
    // State
    filters: readonly(filters),

    // Computed
    hasActiveFilters,
    activeFilterCount,

    // Actions
    setRoomFilter,
    clearRoomFilter,
    clearAllFilters,
    setFilters,

    // Filtering
    applyFilters,

    // Helpers
    getAvailableRooms,
    isRoomFilterAvailable,
  }
}
