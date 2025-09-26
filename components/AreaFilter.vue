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
}

const props = defineProps<Props>()

const emit = defineEmits<{
  filter: [filterData: { area: AreaFilter }]
}>()

const { translate: $t } = useAppI18n()

// Computed area range from server metadata or fallback to properties
const areaRange = computed(() => {
  return props.areaRange || {
    min: Math.min(...props.properties.map(p => p.area)),
    max: Math.max(...props.properties.map(p => p.area)),
  }
})

// Reactive state for current filter values
const minArea = ref(props.currentFilter?.min ?? areaRange.value.min)
const maxArea = ref(props.currentFilter?.max ?? areaRange.value.max)

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
    minArea.value = areaRange.value.min
    maxArea.value = areaRange.value.max
  }
})
</script>