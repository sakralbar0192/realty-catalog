<template>
  <Card class="container">
    <template #title>Properties List</template>
    <template #actions>
      <Button @click="" size="small">Edit</Button>
      <Button type="secondary" size="large" @click="toggleTheme">{{ mainStore.isDarkTheme ? 'Light' : 'Dark' }} Theme</Button>
    </template>

    <ul>
      <li v-for="property in properties" :key="property.id">
        {{ property.title }} - ${{ property.price }} - {{ property.location }}
  
  <button @click="toggleFavorite(property.id)">
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
import { usePropertyStore } from './stores/property'
import { storeToRefs } from 'pinia'

const mainStore = useMainStore()
const propertyStore = usePropertyStore()

const { properties, loading, pagination } = storeToRefs(propertyStore)

// Тема сохраняется автоматически
const toggleTheme = () => mainStore.toggleTheme()

// Избранное сохраняется автоматически
const toggleFavorite = (propertyId: string) => {
  propertyStore.toggleFavorite(propertyId)
}

onMounted(async () => {propertyStore.fetchProperties()})
</script>

