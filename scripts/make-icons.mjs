// Regenerate favicon and PWA assets after editing public/logo.svg.
// Run: node scripts/make-icons.mjs
import fs from 'node:fs/promises'
import sharp from 'sharp'

const svg = await fs.readFile(new URL('../public/logo.svg', import.meta.url))
const out = new URL('../public/', import.meta.url)
await fs.writeFile(new URL('../src/app/icon.svg', import.meta.url), svg)

for (const [name, size] of [
  ['favicon-16x16.png', 16], ['favicon-32x32.png', 32],
  ['apple-touch-icon.png', 180], ['android-chrome-192x192.png', 192],
  ['android-chrome-512x512.png', 512],
]) {
  await sharp(svg).resize(size, size).png().toFile(new URL(name, out).pathname)
}

// Opaque full-bleed background; the complete mark fits inside the central
// 80% safe-zone circle used by maskable icons.
const maskable = await sharp({ create: { width: 512, height: 512, channels: 4, background: '#0D2027' } })
  .composite([{ input: await sharp(svg).resize(410, 410).png().toBuffer(), left: 51, top: 51 }])
  .png().toBuffer()
await fs.writeFile(new URL('icon-maskable-512x512.png', out), maskable)

// ICO container with PNG images at common browser sizes.
const sizes = [16, 32, 48]
const images = await Promise.all(sizes.map(size => sharp(svg).resize(size, size).png().toBuffer()))
const header = Buffer.alloc(6 + sizes.length * 16)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(sizes.length, 4)
let offset = header.length
images.forEach((data, i) => {
  const entry = 6 + i * 16
  header[entry] = header[entry + 1] = sizes[i]
  header.writeUInt16LE(1, entry + 4)
  header.writeUInt16LE(32, entry + 6)
  header.writeUInt32LE(data.length, entry + 8)
  header.writeUInt32LE(offset, entry + 12)
  offset += data.length
})
await fs.writeFile(new URL('favicon.ico', out), Buffer.concat([header, ...images]))
console.log('Generated SVG, favicon, Apple touch, and PWA icons.')
