<template>
  <Card class="container">
    <template #title>Realty Catalog</template>
    <template #actions>
      <LanguageSwitcher />
      <ThemeToggle />
    </template>

    <ul>
      <li v-for="property in properties" :key="property.id">
        {{ property.title }} - ${{ property.price }} - {{ property.location }}

        <button type="button" @click="toggleFavorite(property.id)">
          {{ propertyStore.isFavorite(property.id) ? '❤️' : '🤍' }}
        </button>
      </li>
    </ul>

    <template #footer>
      <span>Last updated: </span>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { usePropertyStore } from '~/stores/property'
import { useTheme } from '~/composables/useTheme'
import { storeToRefs } from 'pinia'
import { useHead } from '#imports'

useHead({
  title: 'Realty Catalog'
})

const propertyStore = usePropertyStore()
const { initializeTheme } = useTheme()

const { properties } = storeToRefs(propertyStore)

const toggleFavorite = (propertyId: string) => {
  propertyStore.toggleFavorite(propertyId)
}

onMounted(async () => {
  propertyStore.fetchProperties()
  initializeTheme()
})
</script>