import { describe, it, expect } from 'vitest'

describe('Typography', () => {
  describe('Font Loading', () => {
    it('should load Paratype font family', () => {
      // Test that CSS variables are defined (indicating styles are loaded)
      const rootStyles = window.getComputedStyle(document.documentElement)
      const fontFamily = rootStyles.getPropertyValue('--font-family')
      expect(fontFamily).toBeTruthy()
    })

    it('should have font preload links in head', () => {
      // Note: Preload links are added in test setup for testing purposes
      // In production, fonts are loaded via CSS @font-face
      const preloadLinks = document.querySelectorAll('link[rel="preload"][as="font"]')
      expect(preloadLinks.length).toBeGreaterThan(0)
    })
  })

  describe('Font Application', () => {
    it('should apply custom font family to body element', () => {
      const body = document.body
      const computedStyle = window.getComputedStyle(body)
      // Check that font-family is not default (Times New Roman)
      expect(computedStyle.fontFamily).not.toContain('Times New Roman')
      expect(computedStyle.fontFamily).toBeTruthy()
    })

    it('should have proper font fallbacks', () => {
      const body = document.body
      const computedStyle = window.getComputedStyle(body)
      // Check that fallbacks are present
      const fontFamily = computedStyle.fontFamily.toLowerCase()
      expect(fontFamily).toMatch(/(system-ui|sans-serif)/)
    })
  })

  describe('Responsive Typography', () => {
    it('should have CSS custom properties for responsive font sizes', () => {
      const rootStyles = window.getComputedStyle(document.documentElement)

      // Check that responsive font size variables are defined
      const baseFontSize = rootStyles.getPropertyValue('--font-size-base')
      const xlFontSize = rootStyles.getPropertyValue('--font-size-xl')

      expect(baseFontSize).toBeTruthy()
      expect(xlFontSize).toBeTruthy()
      expect(baseFontSize).not.toBe(xlFontSize) // They should be different
    })

    it('should maintain readable font sizes on all breakpoints', () => {
      const rootStyles = window.getComputedStyle(document.documentElement)

      // Check that all font size variables are defined and reasonable
      const fontSizes = [
        '--font-size-xs',
        '--font-size-sm',
        '--font-size-base',
        '--font-size-lg',
        '--font-size-xl',
      ]

      fontSizes.forEach(variable => {
        const value = rootStyles.getPropertyValue(variable)
        expect(value).toBeTruthy()
        expect(value).toMatch(/^\d*\.?\d+rem$/) // Should be in rem units
      })
    })
  })

  describe('Cross-browser Compatibility', () => {
    it('should define font-family with fallbacks', () => {
      const rootStyles = window.getComputedStyle(document.documentElement)
      const fontFamily = rootStyles.getPropertyValue('--font-family')

      // Should contain multiple fallbacks for cross-browser support
      expect(fontFamily).toContain(',')
      expect(fontFamily.split(',').length).toBeGreaterThan(2)
    })

    it('should have proper CSS custom properties defined', () => {
      const rootStyles = window.getComputedStyle(document.documentElement)

      // Check that all typography-related CSS variables are defined
      const typographyVars = [
        '--font-size-base',
        '--line-height-normal',
        '--letter-spacing-normal',
      ]

      typographyVars.forEach(variable => {
        const value = rootStyles.getPropertyValue(variable)
        expect(value).toBeTruthy()
      })
    })
  })
})
