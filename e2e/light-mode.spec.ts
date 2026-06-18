import { test, expect } from '@playwright/test'

test.describe('Light Mode', () => {
  test('should render light mode correctly', async ({ page }) => {
    await page.goto('/')

    // Dismiss the voice quality banner if present
    const banner = page.locator('.voice-quality-banner')
    if (await banner.isVisible()) {
      await page.locator('.voice-quality-banner button[aria-label*="Dismiss"]').click()
      await page.waitForTimeout(300)
    }

    // Switch to light mode by clicking the theme toggle in header
    await page.locator('button[aria-label*="light mode"]').click()

    // Wait for theme to apply
    await page.waitForTimeout(100)

    // Verify root has light class
    const root = page.locator('html')
    await expect(root).toHaveClass(/light/)

    // Take screenshot of initial view
    await page.screenshot({ path: '/tmp/le-light-mode-fixed/0-initial-view.png', fullPage: true })

    // Navigate to Reader and add text
    await page.locator('text=Reader').first().click()
    await page.fill('textarea[aria-label="Portuguese text to read"]', 'Olá, como estás?')
    await page.locator('button:has-text("Read it")').click()

    // Wait for results
    await page.waitForSelector('.segment-vowel', { timeout: 2000 })
    await page.screenshot({ path: '/tmp/le-light-mode-fixed/1-reader-view.png', fullPage: true })

    // Navigate to Sound Lab
    await page.locator('text=Sound Lab').first().click()
    await page.waitForSelector('h1:has-text("Sound Lab")', { timeout: 2000 })
    await page.screenshot({ path: '/tmp/le-light-mode-fixed/2-sound-lab.png', fullPage: true })

    // Check theme toggle in header
    await page.screenshot({ path: '/tmp/le-light-mode-fixed/3-header-theme-toggle.png' })
  })
})
