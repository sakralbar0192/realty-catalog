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
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
          @click.stop
          data-test="settings-panel"
        >
          <div :class="styles.header">
            <h3 id="settings-title" :class="styles.title">{{ $t('settings.title') }}</h3>
            <button
              :class="styles.closeButton"
              @click="close"
              @keydown.enter="close"
              @keydown.space.prevent="close"
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
import { ref, nextTick, watch } from 'vue'
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

// Focus management
const focusableElements = ref<HTMLElement[]>([])

const getFocusableElements = () => {
  const panel = document.querySelector('[data-test="settings-panel"]') as HTMLElement
  if (!panel) return []
  return Array.from(panel.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )) as HTMLElement[]
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) return

  if (event.key === 'Tab') {
    focusableElements.value = getFocusableElements()
    const firstElement = focusableElements.value[0]
    const lastElement = focusableElements.value[focusableElements.value.length - 1]

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  }
}

// Watch for panel open/close to manage focus
watch(isOpen, (newIsOpen) => {
  if (newIsOpen) {
    // Focus first element when panel opens
    nextTick(() => {
      const themeToggle = document.querySelector('[data-test="theme-toggle"]') as HTMLElement
      if (themeToggle) {
        themeToggle.focus()
      }
    })
  }
})

// Add/remove event listeners
const addEventListeners = () => {
  document.addEventListener('keydown', handleKeydown)
}

const removeEventListeners = () => {
  document.removeEventListener('keydown', handleKeydown)
}

watch(isOpen, (newIsOpen) => {
  if (newIsOpen) {
    addEventListeners()
  } else {
    removeEventListeners()
  }
})

// Expose methods for parent components
defineExpose({
  open,
  close,
  isOpen
})
</script>