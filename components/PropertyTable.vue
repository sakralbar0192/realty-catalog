<template>
  <div :class="styles.propertyTableContainer">
    <!-- Desktop Table View -->
    <div :class="styles.tableResponsive" class="desktop-only" data-test="table-wrapper">
      <table :class="styles.propertyTable">
        <thead>
          <tr>
            <th scope="col">{{ $t('properties.table.headers.image') }}</th>
            <th scope="col">{{ $t('properties.table.headers.name') }}</th>
            <th scope="col">{{ $t('properties.table.headers.area') }}</th>
            <th scope="col">{{ $t('properties.table.headers.floor') }}</th>
            <th scope="col">{{ $t('properties.table.headers.price') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="property in properties" :key="property.id">
            <td>
              <img
                :src="getImageSrc(property)"
                :alt="$t('properties.table.imageAlt', { name: property.name })"
                :class="styles.propertyImage"
                loading="lazy"
              />
            </td>
            <td>{{ property.name }}</td>
            <td>{{ formatArea(property.area) }}</td>
            <td>{{ formatFloor(property.floor, property.totalFloors) }}</td>
            <td>{{ formatPrice(property.price) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile/Tablet Card View -->
    <div :class="styles.cardsContainer" class="mobile-tablet-only">
      <div
        v-for="property in properties"
        :key="property.id"
        :class="styles.propertyCard"
      >
        <div :class="styles.cardContent">
          <div :class="styles.cardInfo">
            <h3 :class="styles.propertyName">{{ property.name }}</h3>
            <div :class="styles.propertyDetails">
              <div>{{ formatArea(property.area) }}</div>
              <div>{{ formatFloor(property.floor, property.totalFloors) }}</div>
              <div :class="styles.price">{{ formatPrice(property.price) }}</div>
            </div>
          </div>
          <div :class="styles.cardImage">
            <img
              :src="getImageSrc(property)"
              :alt="$t('properties.table.imageAlt', { name: property.name })"
              :class="styles.propertyImage"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Load More Button -->
    <div v-if="hasMore" :class="styles.loadMoreContainer">
      <button
        type="button"
        :class="styles.loadMoreBtn"
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
    <div v-if="properties.length === 0 && !loading" :class="styles.emptyState" data-test="empty-state">
      <p>{{ $t('properties.empty') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Property } from '~/mocks/models'
import styles from '~/assets/styles/components/PropertyTable.module.scss'

interface Props {
  properties: Property[]
  loading: boolean
  hasMore: boolean
}

defineProps<Props>()

defineEmits<{
  loadMore: []
}>()

// Computed property for image source with fallback
const getImageSrc = (property: Property): string => {
  return property.imageUrl || '/img/flat.svg'
}

const formatArea = (area: number): string => {
  return `${area.toFixed(1)} м²`
}

const formatFloor = (floor: number, totalFloors: number): string => {
  return `${floor}/${totalFloors}`
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
}
</script>
