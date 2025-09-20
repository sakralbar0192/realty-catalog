<template>
  <button 
    :class="$style.toggle"
    @click="toggleTheme"
    :aria-label="isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'"
  >
    <Icon
      :name="isDarkTheme ? 'sun' : 'moon'"
      :size="20"
    />
    <span :class="$style.label">
      {{ isDarkTheme ? 'Light' : 'Dark' }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '~/composables/useTheme'

const { theme, isDarkTheme, toggleTheme } = useTheme()

// Применяем тему к document при изменении
watch(() => theme.value, (newTheme) => {
  if (newTheme && newTheme !== null) {
    document.documentElement.setAttribute('data-theme', newTheme)
  }
}, { immediate: true })
</script>

<style module lang="scss">
@use '/assets/styles/_mixins.scss' as *;

.toggle {
  @include flex-center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-background);
    @include theme-shadow(md);
  }
  
  &:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}


.label {
  font-size: 14px;
  font-weight: 500;
}
</style>
