<template>
  <div :class="styles['room-filter']">
    <button
      v-for="roomCount in [1, 2, 3, 4]"
      :key="roomCount"
      type="button"
      :class="getButtonClass(roomCount)"
      :disabled="!isRoomAvailable(roomCount) || props.loading"
      @click="handleFilter(roomCount)"
      @keydown.space.prevent="handleFilter(roomCount)"
      :aria-pressed="isActive(roomCount)"
      :aria-disabled="!isRoomAvailable(roomCount) || props.loading"
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
  availableRooms?: number[]
  loading?: boolean
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

// Check if room count is available based on server metadata
const isRoomAvailable = (roomCount: number): boolean => {
  return props.availableRooms?.includes(roomCount) || false
}

// Check if filter is currently active
const isActive = (filter: RoomFilter): boolean => {
  return activeFilter.value === filter
}

// Get CSS classes for button
const getButtonClass = (filter: RoomFilter): string => {
  const baseClass = styles['room-filter__button']
  const activeClass = isActive(filter) ? styles['room-filter__button--active'] : ''

  // Determine disabled state and class
  const isUnavailable = props.availableRooms && filter !== null && !isRoomAvailable(filter)
  const isLoading = props.loading

  let disabledClass = ''
  if (isUnavailable || isLoading) {
    // Unavailable or loading buttons get disabled style
    disabledClass = styles['room-filter__button--disabled']
  }

  return [baseClass, activeClass, disabledClass].filter(Boolean).join(' ')
}

// Get aria-label for room button
const getRoomAriaLabel = (roomCount: number): string => {
  const roomWord = roomCount === 1 ? $t('filters.rooms.room') : $t('filters.rooms.rooms')
  return `${roomCount} ${roomWord}`
}

const handleFilter = (filter: RoomFilter) => {
  if ((filter !== null && !isRoomAvailable(filter)) || props.loading) {
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