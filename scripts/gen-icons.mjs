import { chromium } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const pub = fileURLToPath(new URL('../public/', import.meta.url))
const svg = readFileSync(pub + 'icon.svg', 'utf8')

const targets = [
  { file: 'icon-192.png', size: 192, pad: 0 },
  { file: 'icon-512.png', size: 512, pad: 0 },
  { file: 'icon-512-maskable.png', size: 512, pad: 56 }, // safe-zone padding
  { file: 'apple-touch-icon.png', size: 180, pad: 0 },
]

const browser = await chromium.launch()
const page = await browser.newPage()

for (const t of targets) {
  const inner = t.size - t.pad * 2
  // Maskable needs the bg to fill the whole tile; render bg then the scaled icon.
  const html = `<!doctype html><html><body style="margin:0;width:${t.size}px;height:${t.size}px;background:#0f172a">
    <div style="position:absolute;inset:${t.pad}px;width:${inner}px;height:${inner}px">${svg.replace(/width="\d+"/, `width="${inner}"`).replace(/height="\d+"/, `height="${inner}"`)}</div>
  </body></html>`
  await page.setViewportSize({ width: t.size, height: t.size })
  await page.setContent(html)
  await page.waitForTimeout(120)
  await page.locator('body').screenshot({ path: pub + t.file })
  console.log('wrote', t.file)
}

await browser.close()
