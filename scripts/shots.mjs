import { chromium, devices } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const OUT = '/tmp/le-shots'
mkdirSync(OUT, { recursive: true })

const routes = ['reader', 'lab', 'drills', 'learn']
const browser = await chromium.launch()

// Desktop
const desk = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const dp = await desk.newPage()
await dp.goto('http://localhost:4173/')
await dp.waitForTimeout(800)
for (const r of routes) {
  // click the desktop sidebar button by its label
  await dp.getByRole('button', { name: new RegExp(r, 'i') }).first().click().catch(() => {})
  await dp.waitForTimeout(700)
  await dp.screenshot({ path: `${OUT}/desktop-${r}.png`, fullPage: false })
  console.log('shot desktop', r)
}

// Mobile (iPhone 13)
const mob = await browser.newContext({ ...devices['iPhone 13'] })
const mp = await mob.newPage()
await mp.goto('http://localhost:4173/')
await mp.waitForTimeout(800)
for (const r of routes) {
  await mp.getByRole('button', { name: new RegExp(r, 'i') }).first().click().catch(() => {})
  await mp.waitForTimeout(700)
  await mp.screenshot({ path: `${OUT}/mobile-${r}.png`, fullPage: false })
  console.log('shot mobile', r)
}

await browser.close()
console.log('done')
