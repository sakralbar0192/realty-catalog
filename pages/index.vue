<template>
  <NuxtLayout
    name="default"
    :properties="properties"
    @room-filter="handleRoomFilter"
  >
    <template #header>
      <h1>{{$t('properties.title')}}</h1>
    </template>

    <template #main>
      <PropertyTable
        :properties="filteredAndSortedProperties"
        :loading="loading"
        :has-more="hasMorePages"
        @load-more="handleLoadMore"
        @sort="handleSort"
      />
    </template>
    <template #sidebar>
      <Sidebar
        :properties="properties"
        @room-filter="handleRoomFilter"
      />
    </template>
  </NuxtLayout>

  <!-- Settings Panel -->
  <SettingsPanel ref="settingsPanel" />
  <SettingsToggle />

  <!-- Mobile Filter Drawer -->
  <FilterDrawer ref="filterDrawerRef" :properties="properties" @room-filter="handleRoomFilter" />
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import { usePropertyStore } from '~/stores/property'
import { useTheme } from '~/composables/useTheme'
import { useSorting } from '~/composables/useSorting'
import { useFilters } from '~/composables/useFilters'
import { storeToRefs } from 'pinia'
import type { SortField, SortDirection } from '~/components/PropertyTable.vue'
import type { RoomFilter } from '~/composables/useFilters'
import SettingsPanel from '~/components/SettingsPanel.vue'
import SettingsToggle from '~/components/SettingsToggle.vue'
import FilterDrawer from '~/components/FilterDrawer.vue'

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
const { setSort } = useSorting()
const { applyFilters, setRoomFilter } = useFilters()
const route = useRoute()
const router = useRouter()

const { properties, loading, hasMorePages } = storeToRefs(propertyStore)

// Settings panel reference
const settingsPanel = ref()

// Provide settings panel methods to child components
provide('settingsPanel', computed(() => ({
  open: () => settingsPanel.value?.open(),
  close: () => settingsPanel.value?.close(),
  isOpen: settingsPanel.value?.isOpen ?? false,
})))

// Provide filter drawer ref to child components
const filterDrawerRef = ref()
provide('filterDrawerRef', filterDrawerRef)

// Reactive route query
const routeQuery = computed(() => route.query)

// Initialize sorting from URL params
if (route.query.sort && route.query.order) {
  setSort(route.query.sort as SortField, route.query.order as SortDirection)
}

// Reactive filtered and sorted properties
const filteredAndSortedProperties = computed(() => {
  // First apply filters
  const filtered = applyFilters(properties.value)

  // Then apply sorting
  const sortField = routeQuery.value.sort as SortField | undefined
  const sortDirection = routeQuery.value.order as SortDirection | undefined

  if (!sortField) return filtered

  return [...filtered].sort((a, b) => {
    let aValue: number
    let bValue: number

    switch (sortField) {
    case 'area':
      aValue = a.area
      bValue = b.area
      break
    case 'floor':
      aValue = a.floor
      bValue = b.floor
      break
    case 'price':
      aValue = a.price
      bValue = b.price
      break
    default:
      return 0
    }

    if (sortDirection === 'desc') {
      return bValue - aValue
    }
    return aValue - bValue
  })
})

const handleLoadMore = () => {
  propertyStore.loadMore()
}

const handleSort = (sortData: { field: SortField; direction: SortDirection }) => {
  // Update URL query params
  router.push({
    query: {
      ...route.query,
      sort: sortData.field,
      order: sortData.direction
    }
  })
}

const handleRoomFilter = (filterData: { rooms: RoomFilter }) => {
  setRoomFilter(filterData.rooms)
}

onBeforeMount(async () => {
  propertyStore.fetchProperties()
  initializeTheme()
})
</script>
