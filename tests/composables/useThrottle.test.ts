import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useThrottle } from '~/composables/useThrottle'

describe('useThrottle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should execute function immediately on first call', () => {
    const mockFn = vi.fn()
    const throttledFn = useThrottle(mockFn, 100)

    throttledFn()

    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should throttle subsequent calls within delay period', () => {
    const mockFn = vi.fn()
    const throttledFn = useThrottle(mockFn, 100)

    // First call - should execute immediately
    throttledFn()
    expect(mockFn).toHaveBeenCalledTimes(1)

    // Second call within delay - should be throttled
    throttledFn()
    expect(mockFn).toHaveBeenCalledTimes(1)

    // Advance time past delay
    vi.advanceTimersByTime(100)

    // Should execute again
    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('should execute function after delay when called rapidly', () => {
    const mockFn = vi.fn()
    const throttledFn = useThrottle(mockFn, 100)

    // Call multiple times rapidly
    throttledFn()
    throttledFn()
    throttledFn()

    // Should only execute once immediately
    expect(mockFn).toHaveBeenCalledTimes(1)

    // Advance time
    vi.advanceTimersByTime(100)

    // Should execute once more after delay
    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('should pass arguments correctly', () => {
    const mockFn = vi.fn()
    const throttledFn = useThrottle(mockFn, 100)

    throttledFn('arg1', 'arg2', 123)

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 123)
  })

  it('should handle different delay values', () => {
    const mockFn = vi.fn()
    const throttledFn = useThrottle(mockFn, 50)

    throttledFn()
    throttledFn()

    expect(mockFn).toHaveBeenCalledTimes(1)

    // Advance time by 50ms
    vi.advanceTimersByTime(50)

    expect(mockFn).toHaveBeenCalledTimes(2)
  })

})
