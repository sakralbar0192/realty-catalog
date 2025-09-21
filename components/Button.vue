<template>
  <button :class="buttonClasses" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
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

const styles = useCssModule()

const buttonClasses = computed(() => [
  styles.button,
  styles[`button--${props.type}`],
  styles[`button--${props.size}`]
])
</script>

<style module lang="scss">
@use '/assets/styles/_mixins.scss';
@use '/assets/styles/variables' as *;

.button {
  @include mixins.flex-center;

  cursor: pointer;
  transition: all 0.3s ease;
  padding: 12px 24px;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
  
  &--primary {
    background-color: $primary-color;

    &:hover {
      background-color: $primary-hover-color;
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
    }
  }

  &--secondary {
    background-color: $secondary-color;

    &:hover {
      background-color: $secondary-hover-color;
    }
  }

  &--small {
    padding: 8px 16px;
    font-size: 14px;
  }

  &--medium {
    padding: 12px 24px;
    font-size: 16px;
  }

  &--large {
    padding: 16px 32px;
    font-size: 18px;
  }
}
</style>
