import { defineStore } from 'pinia'
import type { Property } from '~/mocks/models'

interface PropertyState {
  properties: Property[]
  currentProperty: Property | null
  loading: boolean
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const usePropertyStore = defineStore('property', {
  state: (): PropertyState => ({
    properties: [],
    currentProperty: null,
    loading: false,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0
    }
  }),

  getters: {
    getPropertyById: (state) => (id: string) => 
      state.properties.find(p => p.id === id),
    
    hasMorePages: (state) => 
      state.pagination.page < state.pagination.totalPages
  },

  actions: {
    async fetchProperties(page = 1, limit = 20) {
      this.loading = true
      try {
        const response = await $fetch<{
          data: Property[]
          meta: PropertyState['pagination']
        }>('/api/properties', {
          query: { page, limit }
        })

        if (page === 1) {
          this.properties = response.data
        } else {
          this.properties.push(...response.data)
        }

        this.pagination = response.meta
      } catch (error) {
        console.error('Failed to fetch properties:', error)
      } finally {
        this.loading = false
      }
      console.log(this.properties)
    },

    async fetchPropertyById(id: string) {
      this.loading = true
      try {
        const response = await $fetch<{ data: Property }>(`/api/properties/${id}`)
        this.currentProperty = response.data
        return response.data
      } catch (error) {
        console.error('Failed to fetch property:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    loadMore() {
      if (this.hasMorePages) {
        this.fetchProperties(this.pagination.page + 1)
      }
    }
  }
})

