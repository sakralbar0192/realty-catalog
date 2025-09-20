<template>
  <Card class="container">
    <template #title>Properties List</template>
    <template #actions>
      <Button @click="" size="small">Edit</Button>
      <Button type="secondary" size="large" @click="">Delete</Button>
    </template>

    <ul>
      <li v-for="property in properties" :key="property.id">
        {{ property.title }} - ${{ property.price }} - {{ property.location }}
      </li>
    </ul>

    <template #footer>
      <span>Last updated: </span>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Property } from './mocks/models'
import type { PaginationMeta } from './types/index'

interface ApiResponse<T> {
  data: T
  meta: PaginationMeta
}

const properties = ref<Property[]>([])

onMounted(async () => {
  const response = await $fetch<ApiResponse<Property[]>>('/api/properties?page=1&limit=20')
  properties.value = response.data
  console.log(properties.value)
})
</script>

