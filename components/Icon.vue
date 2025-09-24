<template>
  <span :class="[styles.icon, {[`icon--${props.size}`]: true}]" v-html="iconSvg"></span>
</template>

<script setup lang="ts">
import styles from '~/assets/styles/components/Icon.module.scss'

interface Props {
  name: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 16
})

const iconSvg = computed(() => {
  const icons: Record<string, string> = {
    sun: `<svg width="${props.size}" height="${props.size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    moon: `<svg width="${props.size}" height="${props.size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    'arrow-up': `<svg width="${props.size}" height="${props.size}" viewBox="0 0 10 15" xmlns="http://www.w3.org/2000/svg" fill="none"><path stroke="#fff" stroke-linecap="round" stroke-width="2" d="M5 14.003v-12m0 0 4 4m-4-4-4 4"/></svg>`
  }

  return icons[props.name] || ''
})
</script>