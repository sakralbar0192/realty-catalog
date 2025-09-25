<template>
  <div :class="styles['room-filter']">
    <button
      v-for="roomCount in [1, 2, 3, 4]"
      :key="roomCount"
      type="button"
      :class="getButtonClass(roomCount)"
      :disabled="!isRoomAvailable(roomCount)"
      @click="handleFilter(roomCount)"
      @keydown.space.prevent="handleFilter(roomCount)"
      :aria-pressed="isActive(roomCount)"
      :aria-disabled="!isRoomAvailable(roomCount)"
      :aria-label="getRoomAriaLabel(roomCount)"
      :data-test="`room-filter-${roomCount}`"
      tabindex="0"
    >
      {{ roomCount }}{{ $t('properties.units.room') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { RoomFilter } from '~/composables/useFilters'
import { useAppI18n } from '~/composables/useI18n'
import styles from '~/assets/styles/components/RoomFilter.module.scss'

interface Props {
  properties: Array<{ rooms: number }>
  currentFilter: RoomFilter
}

const props = defineProps<Props>()

const emit = defineEmits<{
  filter: [filterData: { rooms: RoomFilter }]
}>()

const { translate: $t } = useAppI18n()

// Reactive state for active filter
const activeFilter = ref<RoomFilter>(props.currentFilter)

// Watch for external filter changes (e.g., clear filters)
watch(() => props.currentFilter, (newFilter) => {
  activeFilter.value = newFilter
})

// Check if room count is available in properties
const isRoomAvailable = (roomCount: number): boolean => {
  return props.properties.some(property => property.rooms === roomCount)
}

// Check if filter is currently active
const isActive = (filter: RoomFilter): boolean => {
  return activeFilter.value === filter
}

// Get CSS classes for button
const getButtonClass = (filter: RoomFilter): string => {
  const baseClass = styles['room-filter__button']
  const activeClass = isActive(filter) ? styles['room-filter__button--active'] : ''
  const disabledClass = filter !== null && !isRoomAvailable(filter)
    ? styles['room-filter__button--disabled']
    : ''

  return [baseClass, activeClass, disabledClass].filter(Boolean).join(' ')
}

// Get aria-label for room button
const getRoomAriaLabel = (roomCount: number): string => {
  const roomWord = roomCount === 1 ? $t('filters.rooms.room') : $t('filters.rooms.rooms')
  return `${roomCount} ${roomWord}`
}

// Handle filter selection
const handleFilter = (filter: RoomFilter) => {
  // Don't allow selecting disabled filters
  if (filter !== null && !isRoomAvailable(filter)) {
    return
  }

  // Toggle: if clicking on active filter, deactivate it
  if (activeFilter.value === filter) {
    activeFilter.value = null
  } else {
    activeFilter.value = filter
  }
  emit('filter', { rooms: activeFilter.value })
}
</script>