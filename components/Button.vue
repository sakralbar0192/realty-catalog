<template>
  <button :class="buttonClasses" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<!-- Styles should be in separate SCSS files, not in <style> blocks -->
<script setup lang="ts">
import styles from '~/assets/styles/components/Button.module.scss'

interface Props {
  size?: 'small' | 'medium' | 'large'
  type?: 'primary' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  type: 'primary'
})

defineEmits<{
  click: []
}>()

const buttonClasses = computed(() => [
  styles.button,
  styles[`button--${props.type}`],
  styles[`button--${props.size}`]
])
</script>
