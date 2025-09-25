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
            @room-filter="handleRoomFilter"
            @price-filter="handlePriceFilter"
            @area-filter="handleAreaFilter"
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
}

defineProps<Props>()

const emit = defineEmits<{
  roomFilter: [filterData: { rooms: RoomFilter }]
  priceFilter: [filterData: { price: PriceFilter }]
  areaFilter: [filterData: { area: AreaFilter }]
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

// Handle ESC key
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    closeDrawer()
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
watch(isOpen, (newIsOpen) => {
  if (newIsOpen) {
    // Focus the drawer when opened
    nextTick(() => {
      const drawer = document.querySelector('[data-test="filter-drawer"]') as HTMLElement
      if (drawer) {
        drawer.focus()
      }
    })
  }
})
</script>