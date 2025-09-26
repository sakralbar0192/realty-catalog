<template>
  <div :class="[styles['range-slider'], { [styles['range-slider--disabled']]: disabled }]">
    <div :class="styles['range-slider__values']" data-test="range-values">
      <p>
        <span class="text--muted">{{ $t('filters.from') }}</span>&nbsp;<span>{{ formatValue(displayMinValue) }}</span>
      </p>
      <p>
        <span class="text--muted">{{ $t('filters.to') }}</span>&nbsp;<span>{{ formatValue(displayMaxValue) }}</span>
      </p>
    </div>
    <div
      :class="styles['range-slider__track']"
      @mousedown="handleTrackClick"
      @touchstart="handleTrackClick"
      ref="trackRef"
      data-test="range-track"
    >
      <div
        :class="styles['range-slider__range']"
        :style="{ left: minPercent + '%', width: (maxPercent - minPercent) + '%' }"
        data-test="range-range"
      ></div>
      <div
        :class="styles['range-slider__thumb']"
        :style="{ left: minPercent + '%' }"
        @mousedown="startDrag('min')"
        @touchstart="startDrag('min')"
        :aria-label="`${label} min`"
        tabindex="0"
        @keydown="handleKeyDown('min', $event)"
        data-test="range-thumb"
      ></div>
      <div
        :class="styles['range-slider__thumb']"
        :style="{ left: maxPercent + '%' }"
        @mousedown="startDrag('max')"
        @touchstart="startDrag('max')"
        :aria-label="`${label} max`"
        tabindex="0"
        @keydown="handleKeyDown('max', $event)"
        data-test="range-thumb"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'
import styles from '~/assets/styles/components/RangeSlider.module.scss'
import { useAppI18n } from '~/composables/useI18n'

const { translate: $t } = useAppI18n()

interface Props {
  minValue: number
  maxValue: number
  min: number
  max: number
  step: number
  label: string
  // eslint-disable-next-line no-unused-vars
  formatter?: (value: number) => string
  disabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:minValue': [value: number]
  'update:maxValue': [value: number]
}>()

const trackRef = ref<HTMLElement>()
let dragging: 'min' | 'max' | null = null
let keyboardDebounceTimeout: ReturnType<typeof setTimeout> | null = null

// Local state for smooth dragging
const localMinValue = ref(props.minValue)
const localMaxValue = ref(props.maxValue)

const minPercent = computed(() => ((localMinValue.value - props.min) / (props.max - props.min)) * 100)
const maxPercent = computed(() => ((localMaxValue.value - props.min) / (props.max - props.min)) * 100)

const formatValue = (value: number): string => {
  return props.formatter ? props.formatter(value) : value.toString()
}

// Display values from local state for real-time updates
const displayMinValue = computed(() => localMinValue.value)
const displayMaxValue = computed(() => localMaxValue.value)

// Sync local state with props
watch(() => props.minValue, (newVal) => {
  localMinValue.value = newVal
})
watch(() => props.maxValue, (newVal) => {
  localMaxValue.value = newVal
})


const valueFromPercent = (percent: number): number => {
  const value = props.min + (percent / 100) * (props.max - props.min)
  const rounded = Math.round(value / props.step) * props.step
  // Additional rounding for display
  if (props.step >= 1) {
    return Math.round(rounded)
  } else {
    return Math.round(rounded * 10) / 10
  }
}

const handleTrackClick = (event: MouseEvent | TouchEvent) => {
  if (!trackRef.value || props.disabled) return
  const rect = trackRef.value.getBoundingClientRect()
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const percent = ((clientX - rect.left) / rect.width) * 100
  const value = valueFromPercent(percent)

  const minDiff = Math.abs(value - localMinValue.value)
  const maxDiff = Math.abs(value - localMaxValue.value)

  if (minDiff < maxDiff) {
    localMinValue.value = Math.min(value, localMaxValue.value - minDistance.value)
  } else {
    localMaxValue.value = Math.max(value, localMinValue.value + minDistance.value)
  }

  // No emit on track click, only on drag end
}

const startDrag = (type: 'min' | 'max') => {
  if (props.disabled) return
  dragging = type
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('touchmove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchend', stopDrag)
}

const minDistance = computed(() => Math.max(props.step, (props.max - props.min) * 0.1))

const handleDrag = (event: MouseEvent | TouchEvent) => {
  if (!dragging || !trackRef.value) return
  event.preventDefault()
  const rect = trackRef.value.getBoundingClientRect()
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
  const value = valueFromPercent(percent)

  if (dragging === 'min') {
    localMinValue.value = Math.min(value, localMaxValue.value - minDistance.value)
  } else {
    localMaxValue.value = Math.max(value, localMinValue.value + minDistance.value)
  }

  // Force DOM update
  nextTick()
}

const stopDrag = () => {
  dragging = null
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchend', stopDrag)

  // Emit final values
  emit('update:minValue', localMinValue.value)
  emit('update:maxValue', localMaxValue.value)
}

const handleKeyDown = (type: 'min' | 'max', event: KeyboardEvent) => {
  if (props.disabled) return
  const step = props.step
  let changed = false

  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
    event.preventDefault()
    if (type === 'min') {
      const newValue = Math.max(props.min, localMinValue.value - step)
      if (newValue !== localMinValue.value) {
        localMinValue.value = newValue
        changed = true
      }
    } else {
      const newValue = Math.max(localMinValue.value + step, localMaxValue.value - step)
      if (newValue !== localMaxValue.value) {
        localMaxValue.value = newValue
        changed = true
      }
    }
  } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (type === 'min') {
      const newValue = Math.min(localMaxValue.value - step, localMinValue.value + step)
      if (newValue !== localMinValue.value) {
        localMinValue.value = newValue
        changed = true
      }
    } else {
      const newValue = Math.min(props.max, localMaxValue.value + step)
      if (newValue !== localMaxValue.value) {
        localMaxValue.value = newValue
        changed = true
      }
    }
  }

  if (changed) {
    if (keyboardDebounceTimeout) {
      clearTimeout(keyboardDebounceTimeout)
    }
    keyboardDebounceTimeout = setTimeout(() => {
      emit('update:minValue', localMinValue.value)
      emit('update:maxValue', localMaxValue.value)
      keyboardDebounceTimeout = null
    }, 500)
  }
}

onBeforeUnmount(() => {
  if (keyboardDebounceTimeout) {
    clearTimeout(keyboardDebounceTimeout)
  }
})

</script>