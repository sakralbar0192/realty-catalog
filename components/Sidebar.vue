<template>
  <div :class="styles.sidebarContent">
    <h3>{{ $t('sidebar.filters') }}</h3>
    <p>{{ $t('sidebar.filtersDescription') }}</p>

    <div :class="styles.sidebarSection">
      <h4>{{ $t('sidebar.priceRange') }}</h4>
      <div :class="styles.priceInputs">
        <label for="min-price">{{ $t('sidebar.minPrice') }}</label>
        <input id="min-price" type="number" />
        <span>-</span>
        <label for="max-price">{{ $t('sidebar.maxPrice') }}</label>
        <input id="max-price" type="number" />
      </div>
    </div>

    <div :class="styles.sidebarSection">
      <h4>{{ $t('sidebar.propertyType') }}</h4>
      <div :class="styles.checkboxGroup">
        <label><input type="checkbox" /> {{ $t('sidebar.apartment') }}</label>
        <label><input type="checkbox" /> {{ $t('sidebar.house') }}</label>
        <label><input type="checkbox" /> {{ $t('sidebar.office') }}</label>
      </div>
    </div>

    <button :class="styles.applyFiltersBtn">{{ $t('sidebar.applyFilters') }}</button>
  </div>
</template>

<script setup lang="ts">
import styles from '~/assets/styles/components/Sidebar.module.scss'
</script>