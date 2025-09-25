<template>
  <div :class="styles.sidebar">

    <!-- Room Filter -->
    <RoomFilter
      :properties="properties"
      @filter="handleRoomFilter"
    />

    <div :class="styles.sidebarSection">
      <h4>{{ $t('sidebar.priceRange') }}</h4>
      <div :class="styles.priceInputs">
        <label for="min-price">{{ $t('sidebar.minPrice') }}</label>
        <input id="min-price" type="number" />
        <span>-</span>
        <label for="max-price">{{ $t('sidebar.maxPrice') }}</label>
        <input id="max-price" type="number" />
      </div>
    </div>

    <div :class="styles.sidebarSection">
      <h4>{{ $t('sidebar.propertyType') }}</h4>
      <div :class="styles.checkboxGroup">
        <label><input type="checkbox" /> {{ $t('sidebar.apartment') }}</label>
        <label><input type="checkbox" /> {{ $t('sidebar.house') }}</label>
        <label><input type="checkbox" /> {{ $t('sidebar.office') }}</label>
      </div>
    </div>

    <button :class="styles.applyFiltersBtn">{{ $t('sidebar.applyFilters') }}</button>
  </div>
</template>

<script setup lang="ts">
import type { RoomFilter } from '~/composables/useFilters'
import styles from '~/assets/styles/components/Sidebar.module.scss'

interface Props {
  properties: Array<{ rooms: number }>
}

defineProps<Props>()

const emit = defineEmits<{
  roomFilter: [filterData: { rooms: RoomFilter }]
}>()

const handleRoomFilter = (filterData: { rooms: RoomFilter }) => {
  emit('roomFilter', filterData)
}
</script>