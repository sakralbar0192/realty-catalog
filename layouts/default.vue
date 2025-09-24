<template>
  <div ref="layoutRef" :class="styles.layout" data-test="layout">
    <div :class="styles.layout__content">
      <header ref="headerRef" :class="styles.layout__header" data-test="layout-header">
        <slot name="header"></slot>
      </header>

      <main :class="styles.layout__main" :style="{ maxHeight: mainMaxHeight }" data-test="layout-main">
        <slot name="main"></slot>
      </main>
    </div>

    <aside :class="styles.layout__sidebar" v-if="!isMobile" data-test="layout-sidebar">
      <slot name="sidebar"></slot>
    </aside>
    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
import { useDevice } from '~/composables/useDevice'
import styles from '~/assets/styles/layouts/default.module.scss'

const { isMobile } = useDevice()

defineOptions({
  name: 'DefaultLayout'
})

const layoutRef = ref<HTMLElement>()
const headerRef = ref<HTMLElement>()

const mainMaxHeight = ref('calc(100vh - 70px)')

const updateHeights = () => {
  if (import.meta.client && layoutRef.value && headerRef.value) {
    const layoutStyles = window.getComputedStyle(layoutRef.value)
    const headerRect = headerRef.value.getBoundingClientRect()
    
    // Get padding from layout element
    const paddingTop = parseFloat(layoutStyles.paddingTop) || 0
    const paddingBottom = parseFloat(layoutStyles.paddingBottom) || 0
    
    mainMaxHeight.value = `calc(100vh - ${headerRect.height}px - ${paddingTop + paddingBottom}px)`
  }
}

onMounted(() => {
  updateHeights()
  window.addEventListener('resize', updateHeights)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateHeights)
})
</script>