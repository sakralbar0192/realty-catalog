<template>
  <transition name="fade">
    <button
      v-show="isVisible"
      :class="styles.scroll"
      @click="scrollToTop"
      @keydown.enter="scrollToTop"
      @keydown.space.prevent="scrollToTop"
      :aria-label="$t('scrollToTop')"
      type="button"
      data-test="scroll-to-top"
    >
      <Icon name="arrow-up" :class="styles.scrollToTop__icon" />
    </button>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useThrottle } from '~/composables/useThrottle'

import styles from '~/assets/styles/components/ScrollToTop.module.scss'

// Reactive state
const isVisible = ref(false)

// Configuration
const SCROLL_THRESHOLD = computed(() => {
  if (import.meta.client && 'ontouchstart' in window) {
    return 200 // Lower threshold for mobile
  }
  return 150 // Lower threshold for desktop
})
const THROTTLE_DELAY = 100 // Throttle scroll events to 100ms

// DOM references
let scrollableElement: HTMLElement | Window = window

// Methods
const scrollToTop = () => {
  if (!scrollableElement) return

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    // Instant scroll for users who prefer reduced motion
    scrollableElement.scrollTo(0, 0)
    return
  }

  // Check for native smooth scroll support
  if ('scrollBehavior' in document.documentElement.style) {
    scrollableElement.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  } else {
    // Fallback for older browsers (IE, Safari < 14)
    smoothScrollToTopFallback(scrollableElement)
  }
}

// Fallback smooth scroll for older browsers
const smoothScrollToTopFallback = (element: HTMLElement | Window) => {
  const startPosition = element === window ? window.pageYOffset : (element as HTMLElement).scrollTop
  const startTime = performance.now()
  const duration = 500 // ms

  // Easing function for smooth animation
  const easeInOutQuad = (t: number): number => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  const animateScroll = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    const newPosition = startPosition * (1 - easeInOutQuad(progress))

    if (element === window) {
      window.scrollTo(0, newPosition)
    } else {
      (element as HTMLElement).scrollTop = newPosition
    }

    if (progress < 1) {
      requestAnimationFrame(animateScroll)
    }
  }

  requestAnimationFrame(animateScroll)
}

const updateVisibility = () => {
  const scrollTop = scrollableElement === window
    ? window.scrollY
    : (scrollableElement as HTMLElement).scrollTop || 0
  isVisible.value = scrollTop > SCROLL_THRESHOLD.value
}

// Create throttled version of updateVisibility
const throttledUpdateVisibility = useThrottle(updateVisibility, THROTTLE_DELAY)

// Intersection Observer for more efficient scroll detection
let observer: IntersectionObserver | null = null
let sentinel: HTMLDivElement | null = null

const setupIntersectionObserver = () => {
  // For window scrolling, use traditional approach
  if (scrollableElement === window) {
    setupScrollListener()
    return
  }

  // For element scrolling, use Intersection Observer
  const element = scrollableElement as HTMLElement

  // Create sentinel element at scroll threshold
  sentinel = document.createElement('div')
  sentinel.style.position = 'absolute'
  sentinel.style.top = `${SCROLL_THRESHOLD.value}px`
  sentinel.style.left = '0'
  sentinel.style.width = '1px'
  sentinel.style.height = '1px'
  sentinel.style.pointerEvents = 'none'
  sentinel.style.zIndex = '-1'

  // Append to scrollable element
  element.appendChild(sentinel)
  element.style.position = 'relative' // Ensure proper positioning context

  observer = new IntersectionObserver(
    (entries) => {
      // Button is visible when sentinel is not intersecting (scrolled past threshold)
      isVisible.value = !entries[0].isIntersecting
    },
    {
      threshold: 0,
      rootMargin: '0px 0px -100px 0px', // Small buffer for better UX
      root: element
    }
  )

  observer.observe(sentinel)
}

const cleanupIntersectionObserver = () => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (sentinel && sentinel.parentNode) {
    sentinel.parentNode.removeChild(sentinel)
    sentinel = null
  }
}

// Fallback scroll listener for browsers without Intersection Observer
const setupScrollListener = () => {
  if (scrollableElement === window) {
    window.addEventListener('scroll', throttledUpdateVisibility, { passive: true })
  } else {
    (scrollableElement as HTMLElement).addEventListener('scroll', throttledUpdateVisibility, { passive: true })
  }
  updateVisibility()
}

const cleanupScrollListener = () => {
  if (scrollableElement === window) {
    window.removeEventListener('scroll', throttledUpdateVisibility)
  } else {
    (scrollableElement as HTMLElement).removeEventListener('scroll', throttledUpdateVisibility)
  }
}

// Find scrollable element (main content area)
const findScrollableElement = (): HTMLElement | Window => {
  // Try to find main element first
  const mainElement = document.querySelector('main')
  if (mainElement) {
    const mainOverflow = getComputedStyle(mainElement).overflowY
    if (mainOverflow !== 'visible') {
      return mainElement as HTMLElement
    }
  }

  // Fallback to body
  const bodyElement = document.body
  const bodyOverflow = getComputedStyle(bodyElement).overflowY
  if (bodyOverflow !== 'visible') {
    return bodyElement
  }

  // Ultimate fallback to window
  return window
}

// Lifecycle
onMounted(() => {
  // Find the actual scrollable element
  scrollableElement = findScrollableElement()

  // Use Intersection Observer for element scrolling, scroll listener for window scrolling
  if ('IntersectionObserver' in window && scrollableElement !== window) {
    setupIntersectionObserver()
  } else {
    setupScrollListener()
  }

  // Initial visibility check
  updateVisibility()
})

onUnmounted(() => {
  // Cleanup based on what was initialized
  if ('IntersectionObserver' in window && scrollableElement !== window) {
    cleanupIntersectionObserver()
  } else {
    cleanupScrollListener()
  }
})
</script>
