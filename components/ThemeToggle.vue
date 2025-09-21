<template>
  <button
    :class="styles.toggle"
    @click="toggleTheme"
    :aria-label="isDarkTheme ? $t('theme.Switch to light theme') : $t('theme.Switch to dark theme')"
  >
    <Icon
      :name="isDarkTheme ? 'sun' : 'moon'"
      :size="20"
    />
    <span :class="styles.label">
      {{ isDarkTheme ? $t('theme.light') : $t('theme.dark') }}
    </span>
  </button>
</template>

<script setup lang="ts">
import styles from '~/assets/styles/components/ThemeToggle.module.scss'
import { useTheme } from '~/composables/useTheme'

const { theme, isDarkTheme, toggleTheme } = useTheme()

// Применяем тему к document при изменении
watch(() => theme.value, (newTheme) => {
  if (newTheme && newTheme !== null) {
    document.documentElement.setAttribute('data-theme', newTheme)
  }
}, { immediate: true })
</script>
