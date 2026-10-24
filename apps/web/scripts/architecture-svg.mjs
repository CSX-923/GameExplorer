// README images of the archify diagrams (Phase 13): opens each finalized
// HTML of docs/architecture/site and saves its "Export → SVG (dark)" into
// docs/architecture/images/<lang>/. Run with `task architecture-svg`.
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

import { chromium } from '@playwright/test'

const root = join(import.meta.dirname, '..', '..', '..', 'docs', 'architecture')
const pages = [
  ['site/architecture.html', 'images/en/architecture.svg'],
  ['site/upload-lifecycle.html', 'images/en/upload-lifecycle.svg'],
  ['site/es/architecture.html', 'images/es/architecture.svg'],
  ['site/es/upload-lifecycle.html', 'images/es/upload-lifecycle.svg'],
]

const browser = await chromium.launch()
try {
  for (const [html, svg] of pages) {
    const page = await browser.newPage({ acceptDownloads: true, colorScheme: 'dark' })
    await page.goto(pathToFileURL(join(root, html)).href)
    await page.waitForTimeout(1500)
    await page
      .getByRole('button', { name: /^Export(ar)? (diagram|el diagrama|diagrama)/ })
      .first()
      .click()
    const download = page.waitForEvent('download')
    await page.locator('[data-format="svg-dark"]').first().click()
    const out = join(root, svg)
    mkdirSync(join(out, '..'), { recursive: true })
    await (await download).saveAs(out)
    await page.close()
    console.log('saved', svg)
  }
} finally {
  await browser.close()
}
