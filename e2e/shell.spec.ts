import { test, expect } from '@playwright/test'

test.describe('Navigation and shell', () => {
  test('loads the app without console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
    page.on('pageerror', (e) => errors.push(String(e)))

    await page.goto('/')
    await page.waitForTimeout(1000)

    expect(errors.filter((e) => !e.includes('Manifest'))).toEqual([])
  })

  test('navigates between all four views', async ({ page }) => {
    await page.goto('/')
    const views = ['Sound Lab', 'Drills', 'Learn', 'Reader']
    for (const v of views) {
      await page.getByRole('button', { name: v }).click()
      await page.waitForTimeout(400)
      // The lazy-loaded view should render without crashing.
      await expect(page.locator('main')).toBeVisible()
    }
  })

  test('app renders without errors', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(800)
    await expect(page.locator('main')).toBeVisible()
    // Verify the app initialized (branding visible).
    await expect(page.locator('text=/lê|reader/i').first()).toBeVisible()
  })
})
