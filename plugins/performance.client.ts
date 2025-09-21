// plugins/performance.client.ts
export default defineNuxtPlugin(() => {
  // Performance monitoring только в production
  if (process.env.NODE_ENV === 'production') {
    const { measureWebVitals, calculatePerformanceScore, monitorResources } = usePerformance()
    
    // Web Vitals через web-vitals пакет
    measureWebVitals()

    // Performance metrics
    onMounted(() => {
      nextTick(() => {
        calculatePerformanceScore()
        monitorResources()
      })
    })
    
    console.log('📈 Performance monitoring enabled (production only)')
  }
})
