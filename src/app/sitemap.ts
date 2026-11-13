import { MetadataRoute } from 'next'
import {
  BLOG_LANGS,
  BLOG_SECTIONS,
  getAllPosts,
  getTotalPages,
  getTranslations,
  pageUrl,
  postUrl,
  type BlogLang,
} from '@/lib/blog'

const SITE_URL = 'https://www.huynhnguyen.info.vn'

/** hreflang alternates for a sitemap entry (only when more than one language exists). */
function alternates(urls: Partial<Record<BlogLang, string>>) {
  const entries = Object.entries(urls).filter(([, u]) => u)
  if (entries.length < 2) return {}
  return {
    alternates: {
      languages: Object.fromEntries(entries.map(([l, u]) => [l, `${SITE_URL}${u}`])),
    },
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
  ]

  // 'blog' = the index of every post plus the general posts; 'ai' = the series index and its posts.
  for (const section of BLOG_SECTIONS) {
    for (const lang of BLOG_LANGS) {
      // Index pages; page 1 is the index root.
      for (let page = 1; page <= getTotalPages(lang, section); page++) {
        const urls: Partial<Record<BlogLang, string>> = {}
        for (const l of BLOG_LANGS) {
          if (page <= getTotalPages(l, section)) urls[l] = pageUrl(page, l, section)
        }
        entries.push({
          url: `${SITE_URL}${pageUrl(page, lang, section)}`,
          changeFrequency: 'weekly',
          priority: page === 1 ? 0.8 : 0.5,
          ...alternates(urls),
        })
      }

      for (const post of getAllPosts(lang, section)) {
        const urls: Partial<Record<BlogLang, string>> = {}
        for (const [l, p] of Object.entries(getTranslations(post.order, section)) as [BlogLang, { slug: string }][]) {
          urls[l] = postUrl(p.slug, l, section)
        }
        entries.push({
          url: `${SITE_URL}${postUrl(post.slug, lang, section)}`,
          lastModified: new Date(post.updated || post.date || Date.now()),
          changeFrequency: 'monthly',
          priority: 0.7,
          ...alternates(urls),
        })
      }
    }
  }

  return entries
}
