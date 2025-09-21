<template>
  <button :type="props.type" :class="buttonClasses" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<!-- Styles should be in separate SCSS files, not in <style> blocks -->
<script setup lang="ts">
import styles from '~/assets/styles/components/Button.module.scss'

interface Props {
  size?: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'secondary'
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  variant: 'primary',
  type: 'button'
})

defineEmits<{
  click: []
}>()

const buttonClasses = computed(() => [
  styles.button,
  styles[`button--${props.variant}`],
  styles[`button--${props.size}`]
])
</script>
