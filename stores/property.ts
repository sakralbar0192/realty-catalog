import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Property } from '~/mocks/models'

export const usePropertyStore = defineStore('property', () => {
  const properties = ref<Property[]>([])
  const currentProperty = ref<Property | null>(null)
  const loading = ref(false)
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })
  const favorites = ref<string[]>([]) // ID избранных свойств
  const filters = ref({
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    location: undefined as string | undefined,
    bedrooms: undefined as number | undefined
  })

  const getPropertyById = computed(() => (id: string) =>
    properties.value.find(p => p.id === id)
  )

  const hasMorePages = computed(() =>
    pagination.value.page < pagination.value.totalPages
  )

  const favoriteProperties = computed(() =>
    properties.value.filter(p => favorites.value.includes(p.id))
  )

  const isFavorite = computed(() => (id: string) =>
    favorites?.value?.includes(id)
  )

  const fetchProperties = async (page = 1, limit = 20) => {
    loading.value = true
    try {
      const response = await $fetch<{
        data: Property[]
        meta: typeof pagination.value
      }>('/api/properties', {
        query: { page, limit }
      })

      if (page === 1) {
        properties.value = response.data
      } else {
        properties.value.push(...response.data)
      }

      pagination.value = response.meta
    } catch (error) {
      console.error('Failed to fetch properties:', error)
    } finally {
      loading.value = false
    }
    console.log(properties.value)
  }

  const fetchPropertyById = async (id: string) => {
    loading.value = true
    try {
      const response = await $fetch<{ data: Property }>(`/api/properties/${id}`)
      currentProperty.value = response.data
      return response.data
    } catch (error) {
      console.error('Failed to fetch property:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const loadMore = () => {
    if (hasMorePages.value) {
      fetchProperties(pagination.value.page + 1)
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

  const setFilters = (newFilters: Partial<typeof filters.value>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {
      minPrice: undefined,
      maxPrice: undefined,
      location: undefined,
      bedrooms: undefined
    }
  }

  const getFilteredProperties = () => {
    return properties.value.filter(property => {
      if ((property?.price || 0) < (filters?.value?.minPrice || 0)) return false
      if ((property?.price || 0) > (filters?.value?.maxPrice || 0)) return false
      if (filters.value.location && !property.location?.includes(filters.value.location)) return false
      if (filters.value.bedrooms && property.bedrooms !== filters.value.bedrooms) return false
      return true
    })
  }


  return {
    properties,
    currentProperty,
    loading,
    pagination,
    favorites,
    filters,
    getPropertyById,
    hasMorePages,
    favoriteProperties,
    isFavorite,
    fetchProperties,
    fetchPropertyById,
    loadMore,
    toggleFavorite,
    setFilters,
    clearFilters,
    getFilteredProperties
  }
}, {
  persist: {
    pick: ['favorites', 'filters']
  }
})

