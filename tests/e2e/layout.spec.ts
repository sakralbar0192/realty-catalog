import { test, expect } from '@playwright/test'

test.describe('Layout System', () => {
  test('should display header and main content on desktop', async({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForSelector('h1', { timeout: 10000 })

    // Check layout structure exists
    await expect(page.locator('[data-test="layout"]')).toBeVisible()
    await expect(page.locator('[data-test="layout-header"]')).toBeVisible()
    await expect(page.locator('[data-test="layout-main"]')).toBeVisible()
  })

  test('should display property table in main content', async({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForSelector('table', { timeout: 10000 })

    // Check that property table is rendered in main content
    const mainContent = page.locator('[data-test="layout-main"]')
    await expect(mainContent.locator('table')).toBeVisible()
  })

  test('should display header content', async({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForSelector('h1', { timeout: 10000 })

    // Check that header contains the title
    const header = page.locator('[data-test="layout-header"]')
    await expect(header.locator('h1')).toContainText('Квартиры')
  })
})
