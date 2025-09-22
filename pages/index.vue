<template>
  <div class="properties-page">
    <header class="page-header">
      <h1>{{ $t('properties.title') }}</h1>
      <div class="header-actions">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>

    <PropertyTable
      :properties="properties"
      :loading="loading"
      :has-more="hasMorePages"
      @load-more="handleLoadMore"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { usePropertyStore } from '~/stores/property'
import { useTheme } from '~/composables/useTheme'
import { useDevice } from '~/composables/useDevice'
import { storeToRefs } from 'pinia'

const propertyStore = usePropertyStore()
const { initializeTheme } = useTheme()
const { isMobile, isTablet, isDesktop, deviceType } = useDevice()

const { properties, loading, hasMorePages } = storeToRefs(propertyStore)

const handleLoadMore = () => {
  propertyStore.loadMore()
}

// Example usage of device detection
console.log('Current device:', deviceType.value)
console.log('Is mobile:', isMobile.value)
console.log('Is tablet:', isTablet.value)
console.log('Is desktop:', isDesktop.value)

onMounted(async () => {
  propertyStore.fetchProperties()
  initializeTheme()
})
</script>
