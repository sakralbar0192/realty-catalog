<template>
  <div :class="styles['price-filter']">
    <h4 :class="styles['price-filter__title']">{{ $t('filters.price') }}</h4>
    <RangeSlider
      v-model:min-value="minPrice"
      v-model:max-value="maxPrice"
      :min="priceRange.min"
      :max="priceRange.max"
      :step="100000"
      :label="$t('filters.price')"
      :formatter="formatPrice"
      :disabled="loading"
      @update:min-value="handlePriceChange"
      @update:max-value="handlePriceChange"
    />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import type { PriceFilter } from '~/composables/useFilters'
import { useAppI18n } from '~/composables/useI18n'
import styles from '~/assets/styles/components/PriceFilter.module.scss'
import RangeSlider from '~/components/RangeSlider.vue'

interface Props {
  properties: Array<{ price: number }>
  currentFilter: PriceFilter
  priceRange?: { min: number; max: number }
  loading?: boolean
  metadataLoading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  filter: [filterData: { price: PriceFilter }]
}>()

const { translate: $t } = useAppI18n()

// Computed price range from server metadata or fallback to properties
const priceRange = computed(() => {
  if (props.priceRange) {
    return props.priceRange
  }

  if (props.metadataLoading) {
    return { min: 1000000, max: 6000000 }
  }

  if (props.properties.length > 0) {
    const prices = props.properties.map(p => p.price)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    }
  }

  return { min: 1000000, max: 6000000 }
})

const minPrice = ref(props.currentFilter?.min ?? (props.priceRange?.min ?? 1000000))
const maxPrice = ref(props.currentFilter?.max ?? (props.priceRange?.max ?? 6000000))

// Format price for display
const formatPrice = (price: number): string => {
  const roundedPrice = Math.round(price)
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
  }).format(roundedPrice)
}

// Handle price change
const handlePriceChange = () => {
  const filter: PriceFilter = {
    min: minPrice.value,
    max: maxPrice.value,
  }
  emit('filter', { price: filter })
}

// Update values when props change
watch(() => props.currentFilter, (newFilter) => {
  if (newFilter) {
    minPrice.value = newFilter.min
    maxPrice.value = newFilter.max
  } else {
    minPrice.value = props.priceRange?.min ?? 1000000
    maxPrice.value = props.priceRange?.max ?? 6000000
  }
})
</script>