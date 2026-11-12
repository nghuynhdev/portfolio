// Builds 1200×630 WebP social images into public/images/blog/og/:
//  - one per post, cropped from its WebP cover (public/images/blog/NN-*.webp)
//  - ai-for-devs-vi.webp / ai-for-devs-en.webp for the series index pages (cover mosaic + title)
// Run after adding or changing a cover:  node scripts/make-og-images.mjs
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const W = 1200
const H = 630
const SRC = path.join(process.cwd(), 'public', 'images', 'blog')
const OUT = path.join(SRC, 'og')
fs.mkdirSync(OUT, { recursive: true })

const covers = fs.readdirSync(SRC).filter((f) => /^\d+-.*\.webp$/.test(f)).sort()

for (const file of covers) {
  await sharp(path.join(SRC, file))
    .resize(W, H, { fit: 'cover', position: 'centre' })
    .webp({ quality: 82 })
    .toFile(path.join(OUT, file))
}

// Series image: 4×2 mosaic of the newest covers, darkened, with the series title on top.
const tileW = W / 4
const tileH = Math.round(H / 2)
const tiles = await Promise.all(
  covers.slice(-8).reverse().map(async (file, i) => ({
    input: await sharp(path.join(SRC, file)).resize(tileW, tileH, { fit: 'cover' }).toBuffer(),
    left: (i % 4) * tileW,
    top: Math.floor(i / 4) * tileH,
  }))
)

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const series = {
  vi: { sub: 'AI thực chiến cho Developer', foot: `${covers.length} bài · LLM · RAG · AI Agent · MCP · Claude Code` },
  en: { sub: 'Practical AI for Developers', foot: `${covers.length} articles · LLMs · RAG · AI Agents · MCP · Claude Code` },
}

for (const [lang, t] of Object.entries(series)) {
  const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0b0e18" fill-opacity="0.78"/>
  <g font-family="Helvetica Neue, Arial, sans-serif" fill="#ffffff">
    <text x="80" y="260" font-size="96" font-weight="700">AI for Devs</text>
    <text x="80" y="340" font-size="48" fill="#3b9dff">${esc(t.sub)}</text>
    <text x="80" y="430" font-size="28" fill="#c7ccd6">${esc(t.foot)}</text>
    <text x="80" y="550" font-size="26" fill="#8b93a3">Nguyen Huynh · huynhnguyen.info.vn</text>
  </g>
</svg>`)
  await sharp({ create: { width: W, height: H, channels: 3, background: '#0b0e18' } })
    .composite([...tiles, { input: overlay, left: 0, top: 0 }])
    .webp({ quality: 82 })
    .toFile(path.join(OUT, `ai-for-devs-${lang}.webp`))
}

console.log(`Wrote ${covers.length} post images + 2 series images to ${path.relative(process.cwd(), OUT)}`)
