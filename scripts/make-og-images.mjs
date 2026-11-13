// Builds 1200×630 JPEG social images:
//  - one per series post, cropped from its WebP cover (public/images/blog/NN-*.webp) into public/images/blog/og/
//  - one per general post (public/images/blog/posts/NN-*.webp) into public/images/blog/posts/og/
//  - ai-for-devs-vi.jpg / ai-for-devs-en.jpg for the series index pages (cover mosaic + title)
//  - blog-vi.jpg / blog-en.jpg for the /blog index of every post (same mosaic, blog title)
// Run after adding or changing a cover:  node scripts/make-og-images.mjs
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const W = 1200
const H = 630
const SRC = path.join(process.cwd(), 'public', 'images', 'blog')
const OUT = path.join(SRC, 'og')
fs.mkdirSync(OUT, { recursive: true })

const isCover = (f) => /^\d+-.*\.webp$/.test(f)
const covers = fs.readdirSync(SRC).filter(isCover).sort()

async function writePostImages(srcDir, files) {
  const outDir = path.join(srcDir, 'og')
  fs.mkdirSync(outDir, { recursive: true })
  for (const file of files) {
    await sharp(path.join(srcDir, file))
      .resize(W, H, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 82, mozjpeg: true })
      // Cover URLs may be versioned to bypass image caches; social lookup uses the article basename.
      .toFile(path.join(outDir, file.replace(/(?:-v\d+)?\.webp$/, '.jpg')))
  }
}

await writePostImages(SRC, covers)

// General blog posts keep their covers (and social images) in their own folder.
const POSTS_SRC = path.join(SRC, 'posts')
const postCovers = fs.existsSync(POSTS_SRC) ? fs.readdirSync(POSTS_SRC).filter(isCover).sort() : []
await writePostImages(POSTS_SRC, postCovers)

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
// One image per index page and language: [file prefix, title, { lang: { sub, foot } }].
const indexes = [
  ['ai-for-devs', 'AI for Devs', {
    vi: { sub: 'AI thực chiến cho Developer', foot: `${covers.length} bài · LLM · RAG · AI Agent · MCP · Claude Code` },
    en: { sub: 'Practical AI for Developers', foot: `${covers.length} articles · LLMs · RAG · AI Agents · MCP · Claude Code` },
  }],
  ['blog', 'Blog', {
    vi: { sub: 'AI và công nghệ web thực chiến', foot: 'React · Next.js · Node.js · TypeScript · AI for Devs' },
    en: { sub: 'Practical Web Tech and AI', foot: 'React · Next.js · Node.js · TypeScript · AI for Devs' },
  }],
]

for (const [prefix, title, langs] of indexes) for (const [lang, t] of Object.entries(langs)) {
  const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0b0e18" fill-opacity="0.78"/>
  <g font-family="Helvetica Neue, Arial, sans-serif" fill="#ffffff">
    <text x="80" y="260" font-size="96" font-weight="700">${esc(title)}</text>
    <text x="80" y="340" font-size="48" fill="#3b9dff">${esc(t.sub)}</text>
    <text x="80" y="430" font-size="28" fill="#c7ccd6">${esc(t.foot)}</text>
    <text x="80" y="550" font-size="26" fill="#8b93a3">Nguyen Huynh · huynhnguyen.info.vn</text>
  </g>
</svg>`)
  await sharp({ create: { width: W, height: H, channels: 3, background: '#0b0e18' } })
    .composite([...tiles, { input: overlay, left: 0, top: 0 }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT, `${prefix}-${lang}.jpg`))
}

console.log(`Wrote ${covers.length} series + ${postCovers.length} general post images + ${indexes.length * 2} index images to ${path.relative(process.cwd(), OUT)}`)
