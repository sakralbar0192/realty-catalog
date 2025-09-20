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
import { onMounted } from 'vue'
import { usePropertyStore } from './stores/property'
import { storeToRefs } from 'pinia'

const propertyStore = usePropertyStore()
const { properties, loading, pagination } = storeToRefs(propertyStore)

onMounted(async () => {propertyStore.fetchProperties()})
</script>

