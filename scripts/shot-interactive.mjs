import { chromium } from '@playwright/test'

const OUT = '/tmp/le-shots'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', (e) => errors.push(String(e)))

await page.goto('http://localhost:4173/')
await page.waitForTimeout(600)

// Type a sentence with lots of EP-defining features and analyze it.
const ta = page.locator('textarea').first()
await ta.click()
await ta.fill('Bom dia. Os livros do telefone são pequenos.')
await page.waitForTimeout(200)

// Click the analyze/read button (try common labels)
for (const name of [/read it/i, /analy/i, /read/i, /go/i]) {
  const btn = page.getByRole('button', { name }).first()
  if (await btn.count()) { await btn.click().catch(() => {}); break }
}
await page.waitForTimeout(900)
await page.screenshot({ path: `${OUT}/reader-analyzed.png`, fullPage: false })

// Try tapping the first segment tile to open the phoneme modal.
const tile = page.locator('button').filter({ hasText: /^b$|^bom$/i }).first()
await tile.click({ timeout: 2000 }).catch(() => {})
await page.waitForTimeout(600)
await page.screenshot({ path: `${OUT}/reader-modal.png`, fullPage: false })

console.log('CONSOLE_ERRORS:', errors.length ? JSON.stringify(errors.slice(0, 10)) : 'none')
await browser.close()
