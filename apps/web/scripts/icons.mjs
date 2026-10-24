// App icons from the two SVG sources in apps/web/public (Phase 13). Run with
// `task icons`: Chromium renders the PNGs, and favicon.ico packs the small
// ones (PNG entries, which every current browser reads).
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { chromium } from '@playwright/test'

const pub = join(import.meta.dirname, '..', 'public')
const favicon = readFileSync(join(pub, 'favicon.svg'), 'utf8')
const maskable = readFileSync(join(pub, 'icon-maskable.svg'), 'utf8')

const browser = await chromium.launch()
const page = await browser.newPage()

async function png(svg, size) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(
    `<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
  )
  return page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } })
}

const outputs = {
  'apple-touch-icon.png': [maskable, 180],
  'icon-192.png': [maskable, 192],
  'icon-512.png': [maskable, 512],
}
for (const [name, [svg, size]] of Object.entries(outputs)) {
  writeFileSync(join(pub, name), await png(svg, size))
}

// ICO: a header, one directory entry per image, then the PNG data.
const sizes = [16, 32, 48]
const images = []
for (const size of sizes) images.push(await png(favicon, size))
const header = Buffer.alloc(6 + 16 * images.length)
header.writeUInt16LE(0, 0)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(images.length, 4)
let offset = header.length
images.forEach((data, i) => {
  const at = 6 + 16 * i
  header.writeUInt8(sizes[i], at)
  header.writeUInt8(sizes[i], at + 1)
  header.writeUInt16LE(1, at + 4) // color planes
  header.writeUInt16LE(32, at + 6) // bits per pixel
  header.writeUInt32LE(data.length, at + 8)
  header.writeUInt32LE(offset, at + 12)
  offset += data.length
})
writeFileSync(join(pub, 'favicon.ico'), Buffer.concat([header, ...images]))

await browser.close()
console.log('icons written to', pub)
