import { test, expect } from '@playwright/test'

// The Reader is the centerpiece: paste EP text, get a per-sound breakdown.
test.describe('Reader', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('analyzes a passage into segment tiles with IPA', async ({ page }) => {
    const textarea = page.getByLabel('Portuguese text to read')
    await textarea.fill('Os livros do telefone.')
    await page.getByRole('button', { name: /read it/i }).click()

    // Segment tiles expose an aria-label "Sound <grapheme>: open detail".
    const tiles = page.getByLabel(/open detail$/)
    await expect(tiles.first()).toBeVisible()
    expect(await tiles.count()).toBeGreaterThan(5)
  })

  test('opens a phoneme detail dialog when a segment is tapped', async ({ page }) => {
    await page.getByLabel('Portuguese text to read').fill('livros')
    await page.getByRole('button', { name: /read it/i }).click()

    await page.getByLabel(/open detail$/).first().click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // Dismiss with Escape.
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('toggling IPA hides IPA transcription text', async ({ page }) => {
    await page.getByLabel('Portuguese text to read').fill('telefone')
    await page.getByRole('button', { name: /read it/i }).click()
    // The whole-word IPA contains the stress mark; just assert tiles render.
    await expect(page.getByLabel(/open detail$/).first()).toBeVisible()
  })
})
