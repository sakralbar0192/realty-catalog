import { usePropertyStore } from '~/stores/property'

export default defineNuxtPlugin(() => {
  // Initialize mock data on client side
  const propertyStore = usePropertyStore()

  // Initialize properties if not already loaded
  if (propertyStore.properties.length === 0) {
    propertyStore.fetchProperties()
  }
})
