<template>
  <div :class="styles.sidebar">
    <!-- Room Filter -->
    <RoomFilterComponent
      :properties="properties"
      :current-filter="currentFilters.rooms"
      @filter="handleRoomFilter"
    />

    <!-- Price Filter -->
    <PriceFilterComponent
      :properties="properties"
      :current-filter="currentFilters.price"
      @filter="handlePriceFilter"
    />

    <!-- Area Filter -->
    <AreaFilterComponent
      :properties="properties"
      :current-filter="currentFilters.area"
      @filter="handleAreaFilter"
    />

    <div
      :class="styles.sidebar__clear"
      @click="handleClearFilters"
      @keydown.enter="handleClearFilters"
      @keydown.space.prevent="handleClearFilters"
      tabindex="0"
      data-test="clear-filters-btn"
    >
      {{ $t('sidebar.clearFilters') }}
      <Icon name="close" :size="16" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RoomFilter as RoomFilterType, PriceFilter, AreaFilter, FilterState } from '~/composables/useFilters'
import styles from '~/assets/styles/components/Sidebar.module.scss'
import RoomFilterComponent from '~/components/RoomFilter.vue'
import PriceFilterComponent from '~/components/PriceFilter.vue'
import AreaFilterComponent from '~/components/AreaFilter.vue'
import Icon from '~/components/Icon.vue'

interface Props {
  properties: Array<{ rooms: number; price: number; area: number }>
  currentFilters: FilterState
}

defineProps<Props>()

const emit = defineEmits<{
  roomFilter: [filterData: { rooms: RoomFilterType }]
  priceFilter: [filterData: { price: PriceFilter }]
  areaFilter: [filterData: { area: AreaFilter }]
  clearFilters: []
}>()

const handleRoomFilter = (filterData: { rooms: RoomFilterType }) => {
  emit('roomFilter', filterData)
}

const handlePriceFilter = (filterData: { price: PriceFilter }) => {
  emit('priceFilter', filterData)
}

const handleAreaFilter = (filterData: { area: AreaFilter }) => {
  emit('areaFilter', filterData)
}

const handleClearFilters = () => {
  emit('clearFilters')
}
</script>