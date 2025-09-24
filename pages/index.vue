<template>
  <NuxtLayout name="default">
    <template #header>
      <h1>{{$t('properties.title')}}</h1>
    </template>

    <template #main>
      <PropertyTable
        :properties="properties"
        :loading="loading"
        :has-more="hasMorePages"
        @load-more="handleLoadMore"
      />
    </template>
    <template #sidebar>
      <LanguageSwitcher />
      <ThemeToggle />
      <Sidebar />
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { usePropertyStore } from '~/stores/property'
import { useTheme } from '~/composables/useTheme'
import { storeToRefs } from 'pinia'

useHead({
  title: 'Realty Catalog',
  meta: [
    {
      name: 'description',
      content: 'A catalog of real estate properties with multi-language support and theme toggling.'
    }
  ]
})

const propertyStore = usePropertyStore()
const { initializeTheme } = useTheme()

const { properties, loading, hasMorePages } = storeToRefs(propertyStore)

const handleLoadMore = () => {
  propertyStore.loadMore()
}

onBeforeMount(async () => {
  propertyStore.fetchProperties()
  initializeTheme()
})
</script>
