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
}

const props = defineProps<Props>()

const emit = defineEmits<{
  filter: [filterData: { area: AreaFilter }]
}>()

const { translate: $t } = useAppI18n()

// Computed area range from properties
const areaRange = computed(() => {
  const areas = props.properties.map(p => p.area)
  return {
    min: Math.min(...areas),
    max: Math.max(...areas),
  }
})

// Reactive state for current filter values
const defaultMin = areaRange.value.min + (areaRange.value.max - areaRange.value.min) * 0.25
const defaultMax = areaRange.value.min + (areaRange.value.max - areaRange.value.min) * 0.75
const minArea = ref(props.currentFilter?.min ?? defaultMin)
const maxArea = ref(props.currentFilter?.max ?? defaultMax)

// Format area for display
const formatArea = (area: number): string => {
  const roundedArea = Math.round(area * 10) / 10
  return `${roundedArea} ${$t('properties.units.area')}`
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
    minArea.value = areaRange.value.min + (areaRange.value.max - areaRange.value.min) * 0.25
    maxArea.value = areaRange.value.min + (areaRange.value.max - areaRange.value.min) * 0.75
  }
})
</script>