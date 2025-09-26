import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Property } from '~/mocks/models'
import type { FilterState } from '~/composables/useFilters'

export const usePropertyStore = defineStore('property', () => {
  // Use useState for SSR compatibility (fallback to ref for tests)
  const properties = process.client ? useState<Property[]>('properties', () => []) : ref<Property[]>([])
  const currentProperty = ref<Property | null>(null)
  const loading = ref(false)
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const favorites = ref<string[]>([]) // ID избранных свойств
  const filters = ref<FilterState>({
    rooms: null,
    price: null,
    area: null,
  })

  // Filter metadata from server
  const filterMetadata = ref<{
    availableRooms: number[]
    priceRange: { min: number; max: number }
    areaRange: { min: number; max: number }
  } | null>(null)
  const metadataLoading = ref(true) // Start with true to disable filters initially

  const getPropertyById = computed(() => (id: string) =>
    properties.value.find(p => p.id === id),
  )

  const hasMorePages = computed(() =>
    pagination.value.page < pagination.value.totalPages,
  )

  const favoriteProperties = computed(() =>
    properties.value.filter(p => favorites.value.includes(p.id)),
  )

  const isFavorite = computed(() => (id: string) =>
    favorites?.value?.includes(id),
  )

  const fetchProperties = async(page = 1, limit = 20, filterParams?: Partial<FilterState>) => {
    loading.value = true
    try {
      const query: Record<string, string | number> = { page, limit }

      // Add filter parameters to query
      if (filterParams?.rooms !== null && filterParams?.rooms !== undefined) {
        query.rooms = filterParams.rooms
      }
      if (filterParams?.price?.min !== undefined) {
        query.price_min = filterParams.price.min
      }
      if (filterParams?.price?.max !== undefined) {
        query.price_max = filterParams.price.max
      }
      if (filterParams?.area?.min !== undefined) {
        query.area_min = filterParams.area.min
      }
      if (filterParams?.area?.max !== undefined) {
        query.area_max = filterParams.area.max
      }

      const response = await $fetch<{ data: Property[]; meta: { page: number; limit: number; total: number; totalPages: number } }>('/api/properties', {
        query,
      })

      if (page === 1) {
        properties.value = response.data
      } else {
        properties.value.push(...response.data)
      }

      pagination.value = response.meta
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch properties:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchFilterMetadata = async() => {
    metadataLoading.value = true
    try {
      const response = await $fetch<{
        availableRooms: number[]
        priceRange: { min: number; max: number }
        areaRange: { min: number; max: number }
      }>('/api/properties/metadata')
      filterMetadata.value = response
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch filter metadata:', error)
      throw error
    } finally {
      metadataLoading.value = false
    }
  }

  const fetchPropertyById = async(id: string) => {
    loading.value = true
    try {
      const response = await $fetch<{ data: Property }>(`/api/properties/${id}`)
      currentProperty.value = response.data
      return response.data
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch property:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const loadMore = () => {
    if (hasMorePages.value) {
      fetchProperties(pagination.value.page + 1, pagination.value.limit, filters.value)
    }
  }

  const toggleFavorite = (propertyId: string) => {
    const index = favorites.value.indexOf(propertyId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(propertyId)
    }
  }

  const setFilters = async(newFilters: Partial<FilterState>) => {
    filters.value = { ...filters.value, ...newFilters }
    // Clear current properties and reset pagination
    properties.value = []
    pagination.value.page = 1
    // Fetch with new filters
    await fetchProperties(1, pagination.value.limit, filters.value)
  }

  const clearFilters = async() => {
    filters.value = {
      rooms: null,
      price: null,
      area: null,
    }
    // Clear current properties and reset pagination
    properties.value = []
    pagination.value.page = 1
    // Fetch without filters
    await fetchProperties(1, pagination.value.limit)
  }

  // Note: getFilteredProperties is now obsolete since filtering is done server-side
  // Keeping for backward compatibility, but it will just return all properties
  const getFilteredProperties = () => {
    return properties.value
  }

  return {
    properties,
    currentProperty,
    loading,
    pagination,
    favorites,
    filters,
    filterMetadata,
    metadataLoading,
    getPropertyById,
    hasMorePages,
    favoriteProperties,
    isFavorite,
    fetchProperties,
    fetchFilterMetadata,
    fetchPropertyById,
    loadMore,
    toggleFavorite,
    setFilters,
    clearFilters,
    getFilteredProperties,
  }
}, {
  persist: {
    pick: ['favorites', 'filters'],
  },
})

