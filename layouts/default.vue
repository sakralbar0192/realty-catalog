<template>
  <div :class="styles.layout">
    <main :class="styles.mainContent">
      <div :class="styles.pageContent">
        <slot></slot>
      </div>
    </main>

    <aside :class="styles.sidebar" v-if="!isMobile">
      <Sidebar />
    </aside>
  </div>
</template>

<script setup lang="ts">
import { useDevice } from '~/composables/useDevice'
import styles from '~/assets/styles/layouts/default.module.scss'
import Sidebar from '~/components/Sidebar.vue'

const { isMobile } = useDevice()

defineOptions({
  name: 'DefaultLayout'
})
</script>