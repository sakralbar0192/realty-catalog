<template>
  <div :class="styles.performancePage">
    <h1>Performance Dashboard</h1>

    <div :class="styles.metricsGrid">
      <Card title="Web Vitals">
        <div :class="styles.metric" v-for="metric in webVitals" :key="metric.name">
          <h3>{{ metric.name }}</h3>
          <p :class="getMetricClass(metric)">{{ metric.value }}{{ metric.unit }}</p>
          <small>{{ metric.description }}</small>
        </div>
      </Card>

      <Card title="Bundle Analysis">
        <div :class="styles.bundleInfo">
          <p>Bundle size: {{ bundleSize }}</p>
          <p>Gzipped: {{ gzippedSize }}</p>
          <Button @click="runAnalysis">Analyze Bundle</Button>
        </div>
      </Card>

      <Card title="Memory Usage">
        <div :class="styles.memoryInfo">
          <p>Used: {{ memory.used }}</p>
          <p>Total: {{ memory.total }}</p>
          <p>Limit: {{ memory.limit }}</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import styles from '~/assets/styles/pages/performance.module.scss'
import { usePerformance } from '~/composables/usePerformance'

const { measureWebVitals, calculatePerformanceScore, monitorResources } = usePerformance()

// Types
interface WebVitalMetric {
  name: string
  value: number
  unit: string
  description: string
}

// Reactive data
const webVitals = ref<WebVitalMetric[]>([])
const bundleSize = ref('Not analyzed')
const gzippedSize = ref('Not analyzed')
const memory = ref({ used: 'N/A', total: 'N/A', limit: 'N/A' })

// Methods
const getMetricClass = (metric: any) => {
  if (metric.value < 100) return 'good'
  if (metric.value < 250) return 'needs-improvement'
  return 'poor'
}

const runAnalysis = () => {
  // Since we can't run child_process in the browser, show instructions
  alert('To run bundle analysis, execute "bun run analyze" in your terminal. The results will be available in dist/stats.html')
  bundleSize.value = 'Run "bun run analyze" in terminal'
  gzippedSize.value = 'Run "bun run analyze" in terminal'
}

// Collect web vitals data
const collectWebVitals = (metric: any) => {
  const existingIndex = webVitals.value.findIndex((m: any) => m.name === metric.name)
  const metricData = {
    name: metric.name,
    value: Math.round(metric.value),
    unit: metric.name === 'CLS' ? '' : 'ms',
    description: getMetricDescription(metric.name)
  }

  if (existingIndex >= 0) {
    webVitals.value[existingIndex] = metricData
  } else {
    webVitals.value.push(metricData)
  }
}

const getMetricDescription = (name: string) => {
  const descriptions = {
    'CLS': 'Cumulative Layout Shift',
    'INP': 'Interaction to Next Paint',
    'FCP': 'First Contentful Paint',
    'LCP': 'Largest Contentful Paint',
    'TTFB': 'Time to First Byte'
  }
  return descriptions[name as keyof typeof descriptions] || name
}

// Lifecycle
onMounted(() => {
  // Start measuring web vitals
  measureWebVitals(collectWebVitals)

  // Calculate performance score
  calculatePerformanceScore()

  // Monitor resources
  monitorResources()

  // Try to get memory info (if available)
  if (typeof performance !== 'undefined' && 'memory' in performance) {
    const memInfo = (performance as any).memory
    memory.value = {
      used: `${Math.round(memInfo.usedJSHeapSize / 1024 / 1024)} MB`,
      total: `${Math.round(memInfo.totalJSHeapSize / 1024 / 1024)} MB`,
      limit: `${Math.round(memInfo.jsHeapSizeLimit / 1024 / 1024)} MB`
    }
  }
})
</script>

