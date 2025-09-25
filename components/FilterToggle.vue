<template>
  <button
    :class="styles['toggle-button']"
    @click="toggleDrawer"
    :aria-label="$t('sidebar.filters')"
    :aria-expanded="isOpen"
    data-test="filter-toggle"
    type="button"
  >
    <Icon name="filter" :size="20" />
  </button>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import Icon from '~/components/Icon.vue'
import { useAppI18n } from '~/composables/useI18n'
import styles from '~/assets/styles/components/FilterToggle.module.scss'

const { translate: $t } = useAppI18n()

// Inject the filter drawer ref
const filterDrawerRef = inject('filterDrawerRef') as any

const isOpen = computed(() => filterDrawerRef?.value?.isOpen ?? false)

const toggleDrawer = () => {
  if (filterDrawerRef?.value) {
    if (filterDrawerRef.value.isOpen) {
      filterDrawerRef.value.close()
    } else {
      filterDrawerRef.value.open()
    }
  }
}
</script>