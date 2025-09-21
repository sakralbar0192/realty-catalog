<script setup lang="ts">
import styles from '~/assets/styles/components/Card.module.scss'
</script>

<template>
  <div :class="styles.card">
    <div :class="styles.card__header">
      <h3 :class="styles.card__title">
        <slot name="title" ></slot>
      </h3>
      <div :class="styles.card__actions">
        <slot name="actions" ></slot>
      </div>
    </div>

    <div :class="styles.card__content">
      <slot ></slot>
    </div>

    <div :class="styles.card__footer">
      <slot name="footer" ></slot>
    </div>
  </div>
</template>
