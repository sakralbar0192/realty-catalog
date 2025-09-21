<template>
  <div :class="styles.switcher">
    <label :class="styles.label" for="language-select">
      {{ $t('common.language') }}:
    </label>
    <select
      id="language-select"
      :class="styles.select"
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
import styles from '~/assets/styles/components/LanguageSwitcher.module.scss'
import { useAppI18n } from '~/composables/useI18n'

const { currentLocale, availableLocales, changeLocale } = useAppI18n()

const handleLanguageChange = async (event: Event) => {
  const target = event.target as HTMLSelectElement
  await changeLocale(target.value as 'en' | 'ru')
}
</script>
