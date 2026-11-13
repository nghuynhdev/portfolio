import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

/**
 * Posts live in two sections, each in two languages:
 * - 'ai'   the "AI for Devs" series: content/blog/NN-*.md  -> /ai-for-devs/<slug>
 * - 'blog' general tech posts:       content/posts/NN-*.md -> /blog/<slug>
 * English versions sit in an en/ subfolder and are served under /en/...
 * A post and its translation are paired by the NN number within their section.
 *
 * The /blog index lists both sections; /ai-for-devs lists the series only.
 */
import { HOME_URLS, SECTION_BASES, type BlogLang, type BlogSection } from './blog-i18n'
export type { BlogLang, BlogSection }
export const BLOG_LANGS: BlogLang[] = ['vi', 'en']
export const BLOG_SECTIONS: BlogSection[] = ['ai', 'blog']

const SECTION_DIRS: Record<BlogSection, string> = {
  ai: path.join(process.cwd(), 'content', 'blog'),
  blog: path.join(process.cwd(), 'content', 'posts'),
}
/** Cover images, relative to public/. Sections are kept apart so file names can't collide. */
const COVER_PATHS: Record<BlogSection, string> = {
  ai: '/images/blog',
  blog: '/images/blog/posts',
}

/** Public URL prefix of the AI for Devs series in each language. */
export const BLOG_BASES: Record<BlogLang, string> = SECTION_BASES.ai
/** Vietnamese series root, kept for existing imports. */
export const BLOG_BASE = BLOG_BASES.vi
export const POSTS_PER_PAGE = 12

export function postUrl(slug: string, lang: BlogLang = 'vi', section: BlogSection = 'ai'): string {
  return `${SECTION_BASES[section][lang]}/${slug}`
}

/** Page 1 lives at the index root; later pages at <base>/page/N. */
export function pageUrl(page: number, lang: BlogLang = 'vi', scope: BlogSection = 'ai'): string {
  const base = SECTION_BASES[scope][lang]
  return page <= 1 ? base : `${base}/page/${page}`
}

/** Posts listed on an index: the series only for 'ai', every post for 'blog'. */
export function getIndexPosts(lang: BlogLang = 'vi', scope: BlogSection = 'ai'): PostMeta[] {
  if (scope === 'ai') return getAllPosts(lang, 'ai')
  return BLOG_SECTIONS.flatMap((section) => getAllPosts(lang, section)).sort(byNewest)
}

export function getTotalPages(lang: BlogLang = 'vi', scope: BlogSection = 'ai'): number {
  return Math.max(1, Math.ceil(getIndexPosts(lang, scope).length / POSTS_PER_PAGE))
}

export function getPostsPage(page: number, lang: BlogLang = 'vi', scope: BlogSection = 'ai'): PostMeta[] {
  const start = (page - 1) * POSTS_PER_PAGE
  return getIndexPosts(lang, scope).slice(start, start + POSTS_PER_PAGE)
}

marked.setOptions({ gfm: true, breaks: false })

export interface PostMeta {
  slug: string
  lang: BlogLang
  /** 'ai' = part of the AI for Devs series, 'blog' = general tech post. */
  section: BlogSection
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
  /** 1200×630 JPEG for social previews (public/images/blog/og), or null. */
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

function contentDir(lang: BlogLang, section: BlogSection): string {
  return lang === 'vi' ? SECTION_DIRS[section] : path.join(SECTION_DIRS[section], lang)
}

function listMarkdown(lang: BlogLang, section: BlogSection = 'ai'): string[] {
  const dir = contentDir(lang, section)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => /^\d+-.*\.md$/.test(f))
}

function orderOf(file: string): number {
  const m = file.match(/^(\d+)/)
  return m ? parseInt(m[1], 10) : 999
}

function publicFileExists(publicPath: string): boolean {
  return fs.existsSync(path.join(process.cwd(), 'public', publicPath))
}

/**
 * Cover lookup: frontmatter `cover` wins; otherwise a file in the section's cover
 * folder named like the Vietnamese Markdown file with the same number
 * (.webp preferred), so both languages share one image.
 */
function findCover(order: number, fromFrontmatter: unknown, section: BlogSection): string | null {
  if (fromFrontmatter) return String(fromFrontmatter)
  const viFile = listMarkdown('vi', section).find((f) => orderOf(f) === order)
  if (!viFile) return null
  const base = viFile.replace(/\.md$/, '')
  for (const ext of ['webp', 'jpg', 'png']) {
    const file = `${COVER_PATHS[section]}/${base}.${ext}`
    if (publicFileExists(file)) return file
  }
  return null
}

/**
 * Social preview image: <cover folder>/og/<vi-file-base>.jpg, generated from the
 * cover by scripts/make-og-images.mjs (JPEG, because some share targets drop WebP).
 */
function findOgImage(order: number, section: BlogSection): string | null {
  const viFile = listMarkdown('vi', section).find((f) => orderOf(f) === order)
  if (!viFile) return null
  const file = `${COVER_PATHS[section]}/og/${viFile.replace(/\.md$/, '')}.jpg`
  return publicFileExists(file) ? file : null
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
 * English posts link to other posts by their Vietnamese URL (/ai-for-devs/<vi-slug>
 * or /blog/<vi-slug>). When that post has an English translation, point the link
 * at it instead, so new translations are picked up without editing older posts.
 */
function localizeInternalLinks(html: string, lang: BlogLang): string {
  // Posts link to the home page as /#section; the Vietnamese home page lives at /vi.
  if (lang === 'vi') return html.replace(/href="\/(#[^"]*)?"/g, (_m, hash = '') => `href="${HOME_URLS.vi}${hash}"`)
  /** Vietnamese URL -> URL of the translation. */
  const viToLocal = new Map<string, string>()
  for (const section of BLOG_SECTIONS) {
    const localPosts = getAllPosts(lang, section)
    for (const vi of getAllPosts('vi', section)) {
      const local = localPosts.find((p) => p.order === vi.order)
      if (local) viToLocal.set(postUrl(vi.slug, 'vi', section), postUrl(local.slug, lang, section))
    }
  }
  return html.replace(/href="(\/(?:ai-for-devs|blog)\/[a-z0-9-]+)(#[^"]*)?"/g, (m, url: string, hash = '') => {
    const local = viToLocal.get(url)
    return local ? `href="${local}${hash}"` : m
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

function parseFile(file: string, lang: BlogLang, section: BlogSection): { meta: PostMeta; content: string } {
  const raw = fs.readFileSync(path.join(contentDir(lang, section), file), 'utf8')
  const { data, content } = matter(raw)

  const words = content.trim().split(/\s+/).filter(Boolean).length
  const order = orderOf(file)

  const meta: PostMeta = {
    slug: String(data.slug || file.replace(/\.md$/, '')),
    lang,
    section,
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
    cover: findCover(order, data.cover, section),
    ogImage: findOgImage(order, section),
  }

  return { meta, content }
}

/** Newest first; same-day posts fall back to the higher number. */
function byNewest(a: PostMeta, b: PostMeta): number {
  return b.date.localeCompare(a.date) || b.order - a.order
}

/** Every post of one section in one language, newest first. */
export function getAllPosts(lang: BlogLang = 'vi', section: BlogSection = 'ai'): PostMeta[] {
  return listMarkdown(lang, section)
    .map((f) => parseFile(f, lang, section).meta)
    .sort(byNewest)
}

/** Posts in series order (01, 02, ...), for prev/next reading flow. */
function getSeriesPosts(lang: BlogLang): PostMeta[] {
  return [...getAllPosts(lang)].sort((a, b) => a.order - b.order)
}

export function getPostBySlug(slug: string, lang: BlogLang = 'vi', section: BlogSection = 'ai'): Post | null {
  for (const file of listMarkdown(lang, section)) {
    const parsed = parseFile(file, lang, section)
    if (parsed.meta.slug === slug) {
      // Remove the first H1 from the body: the page renders the title separately.
      const body = parsed.content.replace(/^\s*#\s+.*(\r?\n)+/, '')
      const { html, headings } = renderMarkdown(body, lang)
      return { ...parsed.meta, html, headings }
    }
  }
  return null
}

/** The same post (by number, within its section) in every language it exists in. */
export function getTranslations(
  order: number,
  section: BlogSection = 'ai',
): Partial<Record<BlogLang, PostMeta>> {
  const out: Partial<Record<BlogLang, PostMeta>> = {}
  for (const lang of BLOG_LANGS) {
    const match = getAllPosts(lang, section).find((p) => p.order === order)
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

/**
 * Posts sharing the most tags with `slug`, drawn from both sections. Ties go to
 * the same section first, then to the nearest number, then to the newest post.
 */
export function getRelatedPosts(
  slug: string,
  limit = 3,
  lang: BlogLang = 'vi',
  section: BlogSection = 'ai',
): PostMeta[] {
  const all = getIndexPosts(lang, 'blog')
  const current = all.find((p) => p.slug === slug && p.section === section)
  if (!current) return []
  const tags = new Set(current.tags.filter((t) => !['AI', 'Developer'].includes(t)))
  return all
    .filter((p) => p !== current)
    .map((p) => ({
      p,
      score: p.tags.filter((t) => tags.has(t)).length,
      sameSection: p.section === current.section ? 0 : 1,
      distance: p.section === current.section ? Math.abs(p.order - current.order) : 0,
    }))
    .sort(
      (a, b) =>
        b.score - a.score || a.sameSection - b.sameSection || a.distance - b.distance || byNewest(a.p, b.p),
    )
    .slice(0, limit)
    .map((x) => x.p)
}
