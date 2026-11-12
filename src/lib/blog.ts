import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

/**
 * The "AI for Devs" series exists in two languages:
 * - vi (original): content/blog/NN-*.md      -> /ai-for-devs/<slug>
 * - en (translation): content/blog/en/NN-*.md -> /en/ai-for-devs/<slug>
 * A post and its translation are paired by the NN series number.
 */
import type { BlogLang } from './blog-i18n'
export type { BlogLang }
export const BLOG_LANGS: BlogLang[] = ['vi', 'en']

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')
const BLOG_DIRS: Record<BlogLang, string> = {
  vi: CONTENT_DIR,
  en: path.join(CONTENT_DIR, 'en'),
}
const COVER_DIR = path.join(process.cwd(), 'public', 'images', 'blog')

/** Public URL prefix of the series in each language. */
export const BLOG_BASES: Record<BlogLang, string> = {
  vi: '/ai-for-devs',
  en: '/en/ai-for-devs',
}
/** Vietnamese series root, kept for existing imports. */
export const BLOG_BASE = BLOG_BASES.vi
export const POSTS_PER_PAGE = 12

export function postUrl(slug: string, lang: BlogLang = 'vi'): string {
  return `${BLOG_BASES[lang]}/${slug}`
}

/** Page 1 lives at the series root; later pages at <base>/page/N. */
export function pageUrl(page: number, lang: BlogLang = 'vi'): string {
  return page <= 1 ? BLOG_BASES[lang] : `${BLOG_BASES[lang]}/page/${page}`
}

export function getTotalPages(lang: BlogLang = 'vi'): number {
  return Math.max(1, Math.ceil(getAllPosts(lang).length / POSTS_PER_PAGE))
}

export function getPostsPage(page: number, lang: BlogLang = 'vi'): PostMeta[] {
  const start = (page - 1) * POSTS_PER_PAGE
  return getAllPosts(lang).slice(start, start + POSTS_PER_PAGE)
}

marked.setOptions({ gfm: true, breaks: false })

export interface PostMeta {
  slug: string
  lang: BlogLang
  title: string
  /** Shorter <title> for search results (≤ 60 chars); falls back to `title`. */
  seoTitle: string
  description: string
  keywords: string
  tags: string[]
  date: string
  /** Last substantive update (YYYY-MM-DD); empty when never updated. */
  updated: string
  readingTime: number
  order: number
  /** Public path of the cover image, or null when the post has none. */
  cover: string | null
  /** 1200×630 WebP for social previews (public/images/blog/og), or null. */
  ogImage: string | null
}

export interface Heading {
  id: string
  text: string
}

export interface Post extends PostMeta {
  html: string
  /** H2 headings, used for the table of contents. */
  headings: Heading[]
}

/** Vietnamese-safe slug for heading anchors: "Bảo mật AI" -> "bao-mat-ai". */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function listMarkdown(lang: BlogLang): string[] {
  const dir = BLOG_DIRS[lang]
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => /^\d+-.*\.md$/.test(f))
}

function orderOf(file: string): number {
  const m = file.match(/^(\d+)/)
  return m ? parseInt(m[1], 10) : 999
}

/**
 * Cover lookup: frontmatter `cover` wins; otherwise a file in public/images/blog
 * named like the Vietnamese Markdown file with the same series number
 * (.webp preferred), so both languages share one image.
 */
function findCover(order: number, fromFrontmatter: unknown): string | null {
  if (fromFrontmatter) return String(fromFrontmatter)
  const viFile = listMarkdown('vi').find((f) => orderOf(f) === order)
  if (!viFile) return null
  const base = viFile.replace(/\.md$/, '')
  for (const ext of ['webp', 'jpg', 'png']) {
    if (fs.existsSync(path.join(COVER_DIR, `${base}.${ext}`))) {
      return `/images/blog/${base}.${ext}`
    }
  }
  return null
}

/**
 * Social preview image: public/images/blog/og/<vi-file-base>.webp, generated from the
 * cover by scripts/make-og-images.mjs.
 */
function findOgImage(order: number): string | null {
  const viFile = listMarkdown('vi').find((f) => orderOf(f) === order)
  if (!viFile) return null
  const file = `${viFile.replace(/\.md$/, '')}.webp`
  return fs.existsSync(path.join(COVER_DIR, 'og', file)) ? `/images/blog/og/${file}` : null
}

/** YAML turns unquoted dates into Date objects; normalize everything to YYYY-MM-DD. */
function toIsoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return value ? String(value).trim() : ''
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
}

/**
 * English posts link to other posts by their Vietnamese URL (/ai-for-devs/<vi-slug>).
 * When that post has an English translation, point the link at it instead,
 * so new translations are picked up without editing older posts.
 */
function localizeInternalLinks(html: string, lang: BlogLang): string {
  if (lang === 'vi') return html
  const viToLocal = new Map<string, string>()
  const localPosts = getAllPosts(lang)
  for (const vi of getAllPosts('vi')) {
    const local = localPosts.find((p) => p.order === vi.order)
    if (local) viToLocal.set(vi.slug, local.slug)
  }
  return html.replace(/href="\/ai-for-devs\/([a-z0-9-]+)(#[^"]*)?"/g, (m, slug: string, hash = '') => {
    const local = viToLocal.get(slug)
    return local ? `href="${postUrl(local, lang)}${hash}"` : m
  })
}

/** Renders Markdown and gives every H2/H3 a stable id for anchor links. */
function renderMarkdown(body: string, lang: BlogLang): { html: string; headings: Heading[] } {
  const headings: Heading[] = []
  const used = new Map<string, number>()
  const html = marked.parse(body, { async: false }) as string
  const withIds = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_m, level: string, inner: string) => {
    const text = stripTags(inner).trim()
    let id = slugify(text) || 'section'
    const n = used.get(id) ?? 0
    used.set(id, n + 1)
    if (n > 0) id = `${id}-${n}`
    if (level === '2') headings.push({ id, text })
    return `<h${level} id="${id}">${inner}</h${level}>`
  })
  // External sources open in a new tab so readers keep their place on the blog.
  const withExternal = withIds.replace(
    /<a href="(https?:\/\/[^"]+)"/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer"',
  )
  return { html: localizeInternalLinks(withExternal, lang), headings }
}

function parseFile(file: string, lang: BlogLang): { meta: PostMeta; content: string } {
  const raw = fs.readFileSync(path.join(BLOG_DIRS[lang], file), 'utf8')
  const { data, content } = matter(raw)

  const words = content.trim().split(/\s+/).filter(Boolean).length
  const order = orderOf(file)

  const meta: PostMeta = {
    slug: String(data.slug || file.replace(/\.md$/, '')),
    lang,
    title: String(data.title || ''),
    seoTitle: String(data.seoTitle || data.title || ''),
    description: String(data.description || ''),
    keywords: String(data.keywords || ''),
    tags: String(data.tags || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    date: toIsoDate(data.date),
    updated: toIsoDate(data.updated),
    // English reads a little faster per word than Vietnamese (more syllables per word).
    readingTime: Math.max(1, Math.round(words / (lang === 'en' ? 230 : 200))),
    order,
    cover: findCover(order, data.cover),
    ogImage: findOgImage(order),
  }

  return { meta, content }
}

export function getAllPosts(lang: BlogLang = 'vi'): PostMeta[] {
  return listMarkdown(lang)
    .map((f) => parseFile(f, lang).meta)
    // Newest first; same-day posts fall back to the higher series number.
    .sort((a, b) => b.date.localeCompare(a.date) || b.order - a.order)
}

/** Posts in series order (01, 02, ...), for prev/next reading flow. */
function getSeriesPosts(lang: BlogLang): PostMeta[] {
  return [...getAllPosts(lang)].sort((a, b) => a.order - b.order)
}

export function getPostBySlug(slug: string, lang: BlogLang = 'vi'): Post | null {
  for (const file of listMarkdown(lang)) {
    const parsed = parseFile(file, lang)
    if (parsed.meta.slug === slug) {
      // Remove the first H1 from the body: the page renders the title separately.
      const body = parsed.content.replace(/^\s*#\s+.*(\r?\n)+/, '')
      const { html, headings } = renderMarkdown(body, lang)
      return { ...parsed.meta, html, headings }
    }
  }
  return null
}

/** The same post (by series number) in the other languages, when translated. */
export function getTranslations(order: number): Partial<Record<BlogLang, PostMeta>> {
  const out: Partial<Record<BlogLang, PostMeta>> = {}
  for (const lang of BLOG_LANGS) {
    const match = getAllPosts(lang).find((p) => p.order === order)
    if (match) out[lang] = match
  }
  return out
}

export function getAdjacentPosts(
  slug: string,
  lang: BlogLang = 'vi',
): {
  prev: PostMeta | null
  next: PostMeta | null
} {
  const all = getSeriesPosts(lang)
  const i = all.findIndex((p) => p.slug === slug)
  if (i === -1) return { prev: null, next: null }
  return {
    prev: i > 0 ? all[i - 1] : null,
    next: i < all.length - 1 ? all[i + 1] : null,
  }
}

export function formatDate(d: string, lang: BlogLang = 'vi'): string {
  const date = new Date(d)
  if (isNaN(date.getTime())) return d
  return lang === 'en'
    ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/** Posts sharing the most tags with `slug`; ties go to the nearest in the series. */
export function getRelatedPosts(slug: string, limit = 3, lang: BlogLang = 'vi'): PostMeta[] {
  const all = getAllPosts(lang)
  const current = all.find((p) => p.slug === slug)
  if (!current) return []
  const tags = new Set(current.tags.filter((t) => !['AI', 'Developer'].includes(t)))
  return all
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      p,
      score: p.tags.filter((t) => tags.has(t)).length,
      distance: Math.abs(p.order - current.order),
    }))
    .sort((a, b) => b.score - a.score || a.distance - b.distance)
    .slice(0, limit)
    .map((x) => x.p)
}
