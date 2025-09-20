<template>
  <div :class="$style.switcher">
    <label :class="$style.label" for="language-select">
      {{ $t('common.language') }}:
    </label>
    <select
      id="language-select"
      :class="$style.select"
      :value="currentLocale"
      @change="handleLanguageChange"
    >
      <option
        v-for="lang in availableLocales"
        :key="lang.code"
        :value="lang.code"
      >
        {{ lang.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useAppI18n } from '~/composables/useI18n'

const { currentLocale, availableLocales, changeLocale } = useAppI18n()

const handleLanguageChange = async (event: Event) => {
  const target = event.target as HTMLSelectElement
  await changeLocale(target.value as 'en' | 'ru')
}
</script>

<style module lang="scss">
@use '/assets/styles/_mixins.scss' as *;

.switcher {
  @include flex-center;
  gap: 8px;
}

.label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.select {
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  font-size: 14px;
  cursor: pointer;
  
  &:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  
  option {
    background-color: var(--color-background);
    color: var(--color-text-primary);
  }
}
</style>
