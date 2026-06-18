import { test, expect } from '@playwright/test'

test.describe('Drills (SRS practice)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Drills' }).click()
  })

  test('shows drill session start screen with due/quick options', async ({ page }) => {
    await expect(page.locator('text=/due now|quick|start/i').first()).toBeVisible({ timeout: 3000 })
  })

  test('drill start screen renders session options', async ({ page }) => {
    await page.waitForTimeout(1000)
    // The start screen should show "due", "quick", or lesson-based drill options.
    const startUI = page.locator('text=/due|quick|start|drill|practice/i').first()
    await expect(startUI).toBeVisible({ timeout: 3000 })
  })
})
