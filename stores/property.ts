import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Property } from '~/mocks/models'
import { db } from '~/mocks/models'
import { seedDatabase } from '~/mocks/seed'

export const usePropertyStore = defineStore('property', () => {
  // Use useState for SSR compatibility
  const properties = useState<Property[]>('properties', () => [])
  const currentProperty = ref<Property | null>(null)
  const loading = ref(false)
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const favorites = ref<string[]>([]) // ID избранных свойств
  const filters = ref({
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    location: undefined as string | undefined,
    bedrooms: undefined as number | undefined,
  })

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

  const fetchProperties = async(page = 1, limit = 20) => {
    loading.value = true
    try {
      // Use mock data for production demo since API doesn't exist yet
      seedDatabase()
      const allProperties = db.property.getAll()
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedProperties = allProperties.slice(startIndex, endIndex)

      if (page === 1) {
        properties.value = paginatedProperties
      } else {
        properties.value.push(...paginatedProperties)
      }

      pagination.value = {
        page,
        limit,
        total: allProperties.length,
        totalPages: Math.ceil(allProperties.length / limit),
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch properties:', error)
    } finally {
      loading.value = false
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
      bedrooms: undefined,
    }
  }

  const getFilteredProperties = () => {
    return properties.value.filter(property => {
      if ((property?.price || 0) < (filters?.value?.minPrice || 0)) {
        return false
      }
      if ((property?.price || 0) > (filters?.value?.maxPrice || 0)) {
        return false
      }
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
    getFilteredProperties,
  }
}, {
  persist: {
    pick: ['favorites', 'filters'],
  },
})

