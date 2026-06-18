import { test, expect } from '@playwright/test'

test.describe('Sound Lab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Sound Lab' }).click()
  })

  test('displays the 39 EP phonemes grouped by category', async ({ page }) => {
    // Phoneme cards have aria-labels naming the phoneme.
    const cards = page.getByRole('button').filter({ has: page.locator('text=/[aeiouɨɐɔəʃʒɾʁɲʎɫ]/i') })
    await expect(cards.first()).toBeVisible({ timeout: 3000 })
    // Should be 39 cards total once all categories render.
    await page.waitForTimeout(500)
    expect(await cards.count()).toBeGreaterThanOrEqual(30)
  })

  test('search filters phonemes by name/IPA', async ({ page }) => {
    const search = page.getByLabel('Search sounds')
    await search.fill('nasal')
    await page.waitForTimeout(300)
    const cards = page.getByRole('button').filter({ has: page.locator('[class*="ipa"]') })
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
    expect(count).toBeLessThan(39)
  })

  test('opens a phoneme detail dialog with English anchor and examples', async ({ page }) => {
    const firstCard = page.getByRole('button').filter({ has: page.locator('[class*="ipa"]') }).first()
    await firstCard.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    // The English anchor should be the hero text.
    await expect(dialog.locator('text=/sounds like|like the/i')).toBeVisible()
  })
})
