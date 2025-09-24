import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage', async({ page }) => {
    await page.goto('/')

    // Wait for page to load and components to render
    await page.waitForSelector('h1', { timeout: 10000 })

    // Check title
    await expect(page).toHaveTitle(/Realty Catalog/)

    // Check main heading in header slot
    await expect(page.locator('h1')).toContainText('Квартиры')
  })

  test('should have theme toggle in sidebar', async({ page }) => {
    await page.goto('/')

    // Wait for components to render
    await page.waitForSelector('[data-test="theme-toggle"]', { timeout: 10000 })

    // Check theme toggle exists in sidebar
    const themeToggle = page.locator('[data-test="theme-toggle"]')
    await expect(themeToggle).toBeVisible()
  })

  test('should have language switcher in sidebar', async({ page }) => {
    await page.goto('/')

    // Wait for components to render
    await page.waitForSelector('#language-select', { timeout: 10000 })

    // Check language selector exists in sidebar
    const langSelect = page.locator('#language-select')
    await expect(langSelect).toBeVisible()
  })

  test('should display property table in main content', async({ page }) => {
    await page.goto('/')

    // Wait for property table to load
    await page.waitForSelector('table', { timeout: 10000 })

    // Check that table exists in main content
    const mainContent = page.locator('[data-test="layout-main"]')
    await expect(mainContent.locator('table')).toBeVisible()
  })
})
