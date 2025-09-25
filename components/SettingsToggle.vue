<template>
  <button
    :class="styles.toggleButton"
    @click="togglePanel"
    :aria-label="$t('settings.open')"
    :aria-expanded="isOpen"
    data-test="settings-toggle"
  >
    <Icon name="settings" :size="20" />
  </button>
</template>

<script setup lang="ts">
import { inject, computed, type ComputedRef } from 'vue'
import Icon from '~/components/Icon.vue'
import { useAppI18n } from '~/composables/useI18n'
import styles from '~/assets/styles/components/SettingsToggle.module.scss'

const { translate: $t } = useAppI18n()

// Inject the settings panel methods
const settingsPanel = inject('settingsPanel') as ComputedRef<{
  open: () => void
  close: () => void
  isOpen: boolean
}> | null

const isOpen = computed(() => settingsPanel?.value?.isOpen ?? false)

const togglePanel = () => {
  if (settingsPanel?.value) {
    if (settingsPanel.value.isOpen) {
      settingsPanel.value.close()
    } else {
      settingsPanel.value.open()
    }
  }
}
</script>