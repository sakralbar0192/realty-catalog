<template>
  <div :class="styles['sort-icon']" :data-test="`sort-icon-${direction}`">
    <!-- Chevron Up -->
    <svg
      :class="[styles['sort-icon__chevron'], styles['sort-icon__chevron--up'], { [styles.active]: direction === 'asc' }]"
      xmlns="http://www.w3.org/2000/svg"
      width="7"
      height="4"
      fill="none"
      viewBox="0 0 7 4"
    >
      <g fill-rule="evenodd" clip-rule="evenodd">
        <path
          fill="currentColor"
          d="M4.034.253A.846.846 0 0 0 3.428 0c-.229 0-.444.09-.605.253L.168 3.013a.583.583 0 0 0 0 .817.566.566 0 0 0 .807 0l2.453-2.555L5.882 3.83a.566.566 0 0 0 .808 0 .583.583 0 0 0 0-.817L4.034.253Z"
        />
      </g>
    </svg>

    <!-- Chevron Down -->
    <svg
      :class="[styles['sort-icon__chevron'], styles['sort-icon__chevron--down'], { [styles.active]: direction === 'desc' }]"
      xmlns="http://www.w3.org/2000/svg"
      width="7"
      height="4"
      fill="none"
      viewBox="0 0 7 4"
    >
      <g fill-rule="evenodd" clip-rule="evenodd">
        <path
          fill="currentColor"
          d="M4.034.253A.846.846 0 0 0 3.428 0c-.229 0-.444.09-.605.253L.168 3.013a.583.583 0 0 0 0 .817.566.566 0 0 0 .807 0l2.453-2.555L5.882 3.83a.566.566 0 0 0 .808 0 .583.583 0 0 0 0-.817L4.034.253Z"
        />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import styles from '~/assets/styles/components/SortIcon.module.scss'

interface Props {
  direction?: 'asc' | 'desc' | null
}

defineProps<Props>()

defineOptions({
  name: 'SortIcon'
})
</script>