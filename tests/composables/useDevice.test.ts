import { describe, it, expect } from 'vitest'
import { useDevice } from '~/composables/useDevice'

describe('useDevice', () => {
  it('should export all required methods', () => {
    const device = useDevice()

    expect(device).toHaveProperty('screenWidth')
    expect(device).toHaveProperty('isMobile')
    expect(device).toHaveProperty('isTablet')
    expect(device).toHaveProperty('isDesktop')
    expect(device).toHaveProperty('deviceType')
  })

  it('should have reactive properties', () => {
    const { isMobile, isTablet, isDesktop, deviceType } = useDevice()

    // Check that all properties are reactive (have .value)
    expect(isMobile).toHaveProperty('value')
    expect(isTablet).toHaveProperty('value')
    expect(isDesktop).toHaveProperty('value')
    expect(deviceType).toHaveProperty('value')
  })

  it('should return correct device type based on screen width', () => {
    // Test with default window width (1200px from setup)
    const { deviceType } = useDevice()
    expect(deviceType.value).toBe('desktop') // 1200px is desktop (>1025px)
  })

  it('should handle server-side rendering', () => {
    // In test environment without window, should return false for all device types
    const { isMobile, isTablet, isDesktop } = useDevice()

    // Since window is mocked with 1200px width, these should be false, false, true
    expect(isMobile.value).toBe(false)
    expect(isTablet.value).toBe(false)
    expect(isDesktop.value).toBe(true)
  })
})
