<template>
  <div :class="styles.table">
    <table v-if="!isMobile && !isTablet">
      <thead>
        <tr>
          <th scope="col">{{ $t('properties.table.headers.image') }}</th>
          <th scope="col">{{ $t('properties.table.headers.name') }}</th>
          <th scope="col">
            <button
              ref="sortButtonRefs.area"
              type="button"
              :class="getSortButtonClass('area')"
              @click="handleSort('area')"
              @keydown.enter.prevent="handleSort('area')"
              @keydown.space.prevent="handleSort('area')"
              :aria-sort="getAriaSort('area')"
              :aria-label="getSortAriaLabel('area')"
              data-test="sort-area"
            >
              {{ $t('properties.table.headers.area') }}
              <SortIcon :direction="getSortDirection('area')" />
            </button>
          </th>
          <th scope="col">
            <button
              ref="sortButtonRefs.floor"
              type="button"
              :class="getSortButtonClass('floor')"
              @click="handleSort('floor')"
              @keydown.enter.prevent="handleSort('floor')"
              @keydown.space.prevent="handleSort('floor')"
              :aria-sort="getAriaSort('floor')"
              :aria-label="getSortAriaLabel('floor')"
              data-test="sort-floor"
            >
              {{ $t('properties.table.headers.floor') }}
              <SortIcon :direction="getSortDirection('floor')" />
            </button>
          </th>
          <th scope="col">
            <button
              ref="sortButtonRefs.price"
              type="button"
              :class="getSortButtonClass('price')"
              @click="handleSort('price')"
              @keydown.enter.prevent="handleSort('price')"
              @keydown.space.prevent="handleSort('price')"
              :aria-sort="getAriaSort('price')"
              :aria-label="getSortAriaLabel('price')"
              data-test="sort-price"
            >
              {{ $t('properties.table.headers.price') }}
              <SortIcon :direction="getSortDirection('price')" />
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="property in properties" :key="property.id">
          <td>
            <img
              :src="getImageSrc(property)"
              :alt="$t('properties.table.imageAlt', { name: property.name })"
              loading="lazy"
            />
          </td>
          <td>{{ property.name }}</td>
          <td>{{ formatArea(property.area) }}</td>
          <td>
            {{ property.floor }}<span class="text--muted">{{ formatFloor(property.totalFloors) }} </span>
          </td>
          <td>{{ formatPrice(property.price) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Mobile/Tablet Card View -->
    <div v-else>
      <div :class="styles['table__mobile-sort']">
        <button
          ref="sortButtonRefs.area"
          type="button"
          :class="getSortButtonClass('area')"
          @click="handleSort('area')"
          @keydown.enter.prevent="handleSort('area')"
          @keydown.space.prevent="handleSort('area')"
          :aria-sort="getAriaSort('area')"
          :aria-label="getSortAriaLabel('area')"
          data-test="sort-area"
        >
          {{ $t('properties.table.headers.area') }}
          <SortIcon :direction="getSortDirection('area')" />
        </button>
        <button
          ref="sortButtonRefs.floor"
          type="button"
          :class="getSortButtonClass('floor')"
          @click="handleSort('floor')"
          @keydown.enter.prevent="handleSort('floor')"
          @keydown.space.prevent="handleSort('floor')"
          :aria-sort="getAriaSort('floor')"
          :aria-label="getSortAriaLabel('floor')"
          data-test="sort-floor"
        >
          {{ $t('properties.table.headers.floor') }}
          <SortIcon :direction="getSortDirection('floor')" />
        </button>
        <button
          ref="sortButtonRefs.price"
          type="button"
          :class="getSortButtonClass('price')"
          @click="handleSort('price')"
          @keydown.enter.prevent="handleSort('price')"
          @keydown.space.prevent="handleSort('price')"
          :aria-sort="getAriaSort('price')"
          :aria-label="getSortAriaLabel('price')"
          data-test="sort-price"
        >
          {{ $t('properties.table.headers.price') }}
          <SortIcon :direction="getSortDirection('price')" />
        </button>
      </div>
      <div :class="styles.cards" class="mobile-tablet-only">
        <div
          v-for="property in properties"
          :key="property.id"
          :class="styles.card"
        >
          <div :class="styles.card__content">
            <h3 :class="styles.card__title">{{ property.name }}</h3>
            <div :class="styles.card__details">
              <div :class="['font-weight-medium', styles.card__area]">{{ formatArea(property.area) }}{{ $t('properties.units.area') }}</div>
              <div :class="styles.card__floor">
                <span class="font-weight-medium">{{ property.floor }}</span>
                <span class="text--muted">
                  {{ formatFloor(property.totalFloors) }} {{ $t('properties.table.headers.floor').toLowerCase() }}
                </span>
              </div>
              <div class="font-weight-medium">{{ formatPrice(property.price) }}{{ $t('properties.units.currency') }}</div>
            </div>
          </div>
          <div :class="styles.card__image">
            <img
              :src="getImageSrc(property)"
              :alt="$t('properties.table.imageAlt', { name: property.name })"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Load More Button -->
    <div v-if="hasMore" :class="styles.table__more">
      <button
        type="button"
        :disabled="loading"
        @click="$emit('loadMore')"
        data-test="load-more"
        :aria-label="$t('properties.loadMore')"
      >
        <span v-if="loading">{{ $t('properties.loading') }}</span>
        <span v-else>{{ $t('properties.loadMore') }}</span>
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="properties.length === 0 && !loading" :class="styles.table__empty" data-test="empty-state">
      <p>{{ $t('properties.empty') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { Property } from '~/mocks/models'
import { useDevice } from '~/composables/useDevice'
import { useAppI18n } from '~/composables/useI18n'
import { useSorting } from '~/composables/useSorting'
import SortIcon from '~/components/SortIcon.vue'
import styles from '~/assets/styles/components/PropertyTable.module.scss'


interface Props {
  properties: Property[]
  loading: boolean
  hasMore: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  loadMore: []
  sort: [sortData: { field: SortField; direction: SortDirection }]
}>()

const { isMobile, isTablet } = useDevice()
const {translate: $t} = useAppI18n()
const {
  toggleSort,
  getAriaSort,
  isSortedBy,
  getSortDirection
} = useSorting()

// Refs for sort buttons to maintain focus after sorting
const sortButtonRefs = ref<Record<string, HTMLButtonElement | null>>({
  area: null,
  floor: null,
  price: null
})

const getImageSrc = (property: Property): string => {
  return property.imageUrl || '/img/flat.svg'
}

const formatArea = (area: number): string => {
  return area.toFixed(1)
}

const formatFloor = (totalFloors: number): string => {
  return ` ${$t('properties.out_of')} ${totalFloors}`
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU').format(price)
}

// Sorting functionality
export type SortField = 'area' | 'floor' | 'price'
export type SortDirection = 'asc' | 'desc'

const handleSort = (field: SortField) => {
  toggleSort(field)
  // Emit sort event to parent with current sort data
  const direction = getSortDirection(field)
  if (direction) {
    emit('sort', { field, direction })
    // Restore focus to the button after sorting (in case properties reorder causes re-render)
    nextTick(() => {
      const button = sortButtonRefs.value[field]
      if (button) {
        button.focus()
      }
    })
  }
}

const getSortButtonClass = (field: SortField): string => {
  const baseClass = styles['sort-button']
  const activeClass = isSortedBy(field) ? styles['sort-button--active'] : ''
  return `${baseClass} ${activeClass}`.trim()
}

const getSortAriaLabel = (field: SortField): string => {
  const direction = getSortDirection(field)
  if (!direction) return $t('properties.table.headers.area') // fallback

  const key = `sort.${field}${direction === 'asc' ? 'Asc' : 'Desc'}`
  return $t(key)
}
</script>
