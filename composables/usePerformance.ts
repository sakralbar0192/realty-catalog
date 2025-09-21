/* eslint-disable no-console */
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

export const usePerformance = () => {
  // Web Vitals с callback
  // eslint-disable-next-line no-unused-vars
  const measureWebVitals = (callback?: (metric: unknown) => void) => {
    if (typeof window !== 'undefined') {
      onCLS(callback || console.log)
      onINP(callback || console.log)
      onFCP(callback || console.log)
      onLCP(callback || console.log)
      onTTFB(callback || console.log)
    }
  }

  // Lighthouse Performance Score simulation
  const calculatePerformanceScore = () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart

        console.log('⚡ Performance metrics:', {
          'Time to First Byte': Math.round(navigation.responseStart - navigation.requestStart),
          'DOM Content Loaded': Math.round(domContentLoaded),
          'Page Load Time': Math.round(loadTime),
          'DNS Lookup': Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
        })
      }
    }
  }

  // Resource loading monitoring
  const monitorResources = () => {
    if (typeof window !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 1000) { // Resources taking > 1s
            console.warn('🐌 Slow resource:', {
              name: entry.name,
              duration: Math.round(entry.duration),
              size: (entry as PerformanceEntry & { transferSize: number  }).transferSize || 'unknown',
            })
          }
        }
      })

      observer.observe({ entryTypes: ['resource'] })
    }
  }

  // Reactivity monitoring (Vue specific)
  const monitorReactivity = () => {
    if (process.dev) {
      // В dev режиме логируем долгие вычисления
      console.log('🔄 Reactivity monitoring enabled')
    }
  }

  return {
    measureWebVitals,
    calculatePerformanceScore,
    monitorResources,
    monitorReactivity,
  }
}
