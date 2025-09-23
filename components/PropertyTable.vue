<template>
  <div :class="styles.table">
    <table v-if="!isMobile && !isTablet">
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
    <template v-else>
      <div>
        <span scope="col">{{ $t('properties.table.headers.area') }}</span>
        <span scope="col">{{ $t('properties.table.headers.floor') }}</span>
        <span scope="col">{{ $t('properties.table.headers.price') }}</span>
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
    </template>

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
import type { Property } from '~/mocks/models'
import { useDevice } from '~/composables/useDevice'
import { useAppI18n } from '~/composables/useI18n'
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

const { isMobile, isTablet } = useDevice()
const {translate: $t} = useAppI18n()

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
</script>
