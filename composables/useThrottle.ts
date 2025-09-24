/**
 * Custom throttle implementation
 * Limits the rate at which a function can be called
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
export function useThrottle<T extends(...args: any[]) => any>(
  func: T,
  delay: number,
): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastExecTime = 0

  return ((...args: Parameters<T>) => {
    const currentTime = Date.now()

    if (currentTime - lastExecTime > delay) {
      // If enough time has passed, execute immediately
      func(...args)
      lastExecTime = currentTime
    } else {
      // Otherwise, schedule execution after the remaining delay
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        func(...args)
        lastExecTime = Date.now()
        timeoutId = null
      }, delay - (currentTime - lastExecTime))
    }
  }) as T
}

