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
}

const props = defineProps<Props>()

const emit = defineEmits<{
  filter: [filterData: { price: PriceFilter }]
}>()

const { translate: $t } = useAppI18n()

// Computed price range from properties
const priceRange = computed(() => {
  const prices = props.properties.map(p => p.price)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
})

// Reactive state for current filter values
const defaultMin = priceRange.value.min + (priceRange.value.max - priceRange.value.min) * 0.25
const defaultMax = priceRange.value.min + (priceRange.value.max - priceRange.value.min) * 0.75
const minPrice = ref(props.currentFilter?.min ?? defaultMin)
const maxPrice = ref(props.currentFilter?.max ?? defaultMax)

// Format price for display
const formatPrice = (price: number): string => {
  const roundedPrice = Math.round(price)
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
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
    minPrice.value = priceRange.value.min + (priceRange.value.max - priceRange.value.min) * 0.25
    maxPrice.value = priceRange.value.min + (priceRange.value.max - priceRange.value.min) * 0.75
  }
})
</script>