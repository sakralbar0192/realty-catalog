<template>
  <Teleport to="body">
    <Transition name="slide-fade">
      <div
        v-if="isOpen"
        :class="styles.overlay"
        @click="close"
        @keydown.escape="close"
        tabindex="-1"
        data-test="settings-overlay"
      >
        <div
          :class="styles.panel"
          @click.stop
          data-test="settings-panel"
        >
          <div :class="styles.header">
            <h3 :class="styles.title">{{ $t('settings.title') }}</h3>
            <button
              :class="styles.closeButton"
              @click="close"
              :aria-label="$t('common.close')"
              data-test="settings-close"
            >
              <Icon name="x" :size="20" />
            </button>
          </div>

          <div :class="styles.content">
            <div :class="styles.section">
              <h4 :class="styles.sectionTitle">{{ $t('theme.title') }}</h4>
              <ThemeToggle />
            </div>

            <div :class="styles.section">
              <h4 :class="styles.sectionTitle">{{ $t('common.language') }}</h4>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Icon from '~/components/Icon.vue'
import ThemeToggle from '~/components/ThemeToggle.vue'
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'
import { useAppI18n } from '~/composables/useI18n'
import styles from '~/assets/styles/components/SettingsPanel.module.scss'

const { translate: $t } = useAppI18n()

const isOpen = ref(false)

const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

// Expose methods for parent components
defineExpose({
  open,
  close,
  isOpen
})
</script>