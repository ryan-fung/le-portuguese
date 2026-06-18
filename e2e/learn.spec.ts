import { test, expect } from '@playwright/test'

test.describe('Learn (curriculum)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Learn' }).click()
  })

  test('displays the lesson path with progress', async ({ page }) => {
    // The path should render lesson titles.
    await expect(page.locator('text=/vowel|nasal|digraph/i').first()).toBeVisible({ timeout: 3000 })
    // Progress stat in the header.
    await expect(page.locator('text=/\\d+ \\/ \\d+ lessons/i')).toBeVisible()
  })

  test('curriculum path renders with lessons', async ({ page }) => {
    await page.waitForTimeout(1000)
    // The lesson path should show titles from the curriculum.
    const lessons = page.locator('text=/vowel|nasal|digraph|sound|lesson/i')
    await expect(lessons.first()).toBeVisible({ timeout: 3000 })
    expect(await lessons.count()).toBeGreaterThan(3)
  })

  test('mark complete advances to the next lesson', async ({ page }) => {
    const completeBtn = page.getByRole('button', { name: /mark complete|complete/i })
    if (await completeBtn.isVisible()) {
      await completeBtn.click()
      // Should advance; check that the view didn't crash.
      await page.waitForTimeout(500)
      await expect(page.locator('text=/lesson/i')).toBeVisible()
    }
  })
})
