import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage', async({ page }) => {
    await page.goto('/')

    // Wait for page to load and components to render
    await page.waitForSelector('h3', { timeout: 10000 })

    // Check title
    await expect(page).toHaveTitle(/Properties List/)

    // Check main heading (Card title)
    await expect(page.locator('h3')).toContainText('Properties List')
  })

  test('should have theme toggle', async({ page }) => {
    await page.goto('/')

    // Wait for components to render
    await page.waitForSelector('[data-test="theme-toggle"]', { timeout: 10000 })

    // Check theme toggle exists
    const themeToggle = page.locator('[data-test="theme-toggle"]')
    await expect(themeToggle).toBeVisible()
  })

  test('should have language switcher', async({ page }) => {
    await page.goto('/')

    // Wait for components to render
    await page.waitForSelector('#language-select', { timeout: 10000 })

    // Check language selector exists
    const langSelect = page.locator('#language-select')
    await expect(langSelect).toBeVisible()
  })

  test('should switch theme', async({ page }) => {
    await page.goto('/')

    // Wait for components to render
    await page.waitForSelector('[data-test="theme-toggle"]', { timeout: 10000 })

    // Check initial theme
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark')

    // Click theme toggle
    await page.locator('[data-test="theme-toggle"]').click()

    // Wait for theme change
    await page.waitForTimeout(1000)

    // Check theme changed
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })

  test('should switch language', async({ page }) => {
    await page.goto('/')

    // Wait for components to render
    await page.waitForSelector('h3', { timeout: 10000 })
    await page.waitForSelector('#language-select', { timeout: 10000 })

    // Check initial language (English)
    await expect(page.locator('h3')).toContainText('Properties List')

    // Switch to Russian
    await page.selectOption('#language-select', 'ru')

    // Wait for language change and navigation
    await page.waitForTimeout(1000)

    // Check URL changed to Russian locale
    await expect(page).toHaveURL(/\/ru/)
  })
})
