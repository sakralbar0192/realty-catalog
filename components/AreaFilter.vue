<template>
  <div :class="styles['area-filter']">
    <h4 :class="styles['area-filter__title']">{{ $t('filters.area') }}</h4>
    <RangeSlider
      v-model:min-value="minArea"
      v-model:max-value="maxArea"
      :min="areaRange.min"
      :max="areaRange.max"
      :step="0.1"
      :label="$t('filters.area')"
      :formatter="formatArea"
      :disabled="loading"
      @update:min-value="handleAreaChange"
      @update:max-value="handleAreaChange"
    />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import type { AreaFilter } from '~/composables/useFilters'
import { useAppI18n } from '~/composables/useI18n'
import styles from '~/assets/styles/components/AreaFilter.module.scss'
import RangeSlider from '~/components/RangeSlider.vue'

interface Props {
  properties: Array<{ area: number }>
  currentFilter: AreaFilter
  areaRange?: { min: number; max: number }
  loading?: boolean
  metadataLoading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  filter: [filterData: { area: AreaFilter }]
}>()

const { translate: $t } = useAppI18n()

// Computed area range from server metadata or fallback to properties
const areaRange = computed(() => {
  if (props.areaRange) {
    return props.areaRange
  }

  if (props.metadataLoading) {
    return { min: 25, max: 175 }
  }

  if (props.properties.length > 0) {
    const areas = props.properties.map(p => p.area)
    return {
      min: Math.min(...areas),
      max: Math.max(...areas),
    }
  }

  return { min: 25, max: 175 }
})

// Reactive state for current filter values
// Always use currentFilter if available, otherwise use areaRange or defaults
const minArea = ref(props.currentFilter?.min ?? (props.areaRange?.min ?? 25))
const maxArea = ref(props.currentFilter?.max ?? (props.areaRange?.max ?? 175))

// Format area for display
const formatArea = (area: number): string => {
  const roundedArea = Math.round(area * 10) / 10
  return `${roundedArea}`
}

// Handle area change
const handleAreaChange = () => {
  const filter: AreaFilter = {
    min: minArea.value,
    max: maxArea.value,
  }
  emit('filter', { area: filter })
}

// Update values when props change
watch(() => props.currentFilter, (newFilter) => {
  if (newFilter) {
    minArea.value = newFilter.min
    maxArea.value = newFilter.max
  } else {
    minArea.value = props.areaRange?.min ?? 25
    maxArea.value = props.areaRange?.max ?? 175
  }
})
</script>