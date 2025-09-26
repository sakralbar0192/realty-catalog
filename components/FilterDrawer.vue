<template>
  <!-- Overlay -->
  <Teleport to="body">
    <Transition name="overlay" appear>
      <div
        v-if="isOpen"
        :class="styles.overlay"
        @click="closeDrawer"
        @keydown.esc="closeDrawer"
        tabindex="-1"
        data-test="filter-drawer-overlay"
      ></div>
    </Transition>

    <!-- Drawer -->
    <Transition name="drawer" appear>
      <div
        v-if="isOpen"
        :class="styles.drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-drawer-title"
        data-test="filter-drawer"
      >
        <div :class="styles.drawer__header">
          <h2 id="filter-drawer-title" :class="styles.drawerTitle">
            {{ $t('sidebar.filters') }}
          </h2>
          <button
            :class="styles.drawer__close"
            @click="closeDrawer"
            @keydown.enter.prevent="closeDrawer"
            @keydown.space.prevent="closeDrawer"
            :aria-label="$t('common.close')"
            data-test="filter-drawer-close"
          >
            <Icon name="close" :size="20" />
          </button>
        </div>

        <div :class="styles.drawer__content">
          <Sidebar
            :properties="properties"
            :current-filters="currentFilters"
            :loading="loading"
            @room-filter="handleRoomFilter"
            @price-filter="handlePriceFilter"
            @area-filter="handleAreaFilter"
            @clear-filters="handleClearFilters"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted, watch } from 'vue'
import Icon from '~/components/Icon.vue'
import Sidebar from '~/components/Sidebar.vue'
import { useAppI18n } from '~/composables/useI18n'
import type { RoomFilter, PriceFilter, AreaFilter, FilterState } from '~/composables/useFilters'
import styles from '~/assets/styles/components/FilterDrawer.module.scss'

interface Props {
  properties: Array<{ rooms: number; price: number; area: number }>
  currentFilters: FilterState
  loading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  roomFilter: [filterData: { rooms: RoomFilter }]
  priceFilter: [filterData: { price: PriceFilter }]
  areaFilter: [filterData: { area: AreaFilter }]
  clearFilters: []
}>()

const { translate: $t } = useAppI18n()

// Reactive drawer state
const isOpen = ref(false)

// Drawer methods
const openDrawer = () => {
  isOpen.value = true
}

const closeDrawer = () => {
  isOpen.value = false
}

defineExpose({
  isOpen,
  open: openDrawer,
  close: closeDrawer
})

const handleRoomFilter = (filterData: { rooms: RoomFilter }) => {
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

// Handle keyboard navigation and ESC key
const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) return

  if (event.key === 'Escape') {
    closeDrawer()
    return
  }

  if (event.key === 'Tab') {
    focusableElements.value = getFocusableElements()
    const firstElement = focusableElements.value[0]
    const lastElement = focusableElements.value[focusableElements.value.length - 1]

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  }
}

// Add/remove event listeners
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Focus management
const focusableElements = ref<HTMLElement[]>([])
const previouslyFocusedElement = ref<HTMLElement | null>(null)

watch(isOpen, (newIsOpen) => {
  if (newIsOpen) {
    // Store previously focused element
    previouslyFocusedElement.value = document.activeElement as HTMLElement

    // Focus first element when drawer opens
    nextTick(() => {
      focusableElements.value = getFocusableElements()
      const firstElement = focusableElements.value[0]
      if (firstElement) {
        firstElement.focus()
      }
    })
  } else {
    // Restore focus when closing
    if (previouslyFocusedElement.value) {
      previouslyFocusedElement.value.focus()
    }
  }
})

const getFocusableElements = () => {
  const drawer = document.querySelector('[data-test="filter-drawer"]') as HTMLElement
  if (!drawer) return []
  return Array.from(drawer.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )) as HTMLElement[]
}

</script>