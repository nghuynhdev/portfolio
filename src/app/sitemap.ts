import { MetadataRoute } from 'next'
import {
  BLOG_LANGS,
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

  for (const lang of BLOG_LANGS) {
    // Series index pages; page 1 is the series root.
    for (let page = 1; page <= getTotalPages(lang); page++) {
      const urls: Partial<Record<BlogLang, string>> = {}
      for (const l of BLOG_LANGS) if (page <= getTotalPages(l)) urls[l] = pageUrl(page, l)
      entries.push({
        url: `${SITE_URL}${pageUrl(page, lang)}`,
        changeFrequency: 'weekly',
        priority: page === 1 ? 0.8 : 0.5,
        ...alternates(urls),
      })
    }

    for (const post of getAllPosts(lang)) {
      const urls: Partial<Record<BlogLang, string>> = {}
      for (const [l, p] of Object.entries(getTranslations(post.order)) as [BlogLang, { slug: string }][]) {
        urls[l] = postUrl(p.slug, l)
      }
      entries.push({
        url: `${SITE_URL}${postUrl(post.slug, lang)}`,
        lastModified: new Date(post.updated || post.date || Date.now()),
        changeFrequency: 'monthly',
        priority: 0.7,
        ...alternates(urls),
      })
    }
  }

  return entries
}
