import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'
import FadeIn from '@/components/blog/FadeIn'
import PostCover from '@/components/blog/PostCover'
import BlogSearch, { type SearchItem } from '@/components/blog/BlogSearch'
import {
  BLOG_LANGS,
  formatDate,
  getIndexPosts,
  getPostsPage,
  getTotalPages,
  pageUrl,
  postUrl,
  type BlogLang,
  type BlogSection,
} from '@/lib/blog'
import { SECTION_BASES, blogStrings } from '@/lib/blog-i18n'

const SITE_URL = 'https://www.huynhnguyen.info.vn'

/** Index copy: the series' own strings for 'ai', the general blog's for 'blog'. */
function indexStrings(lang: BlogLang, scope: BlogSection) {
  const s = blogStrings[lang]
  return scope === 'ai' ? { ...s, name: s.seriesName } : s.blog
}

/** hreflang map for index page N: only languages that actually have page N. */
function indexAlternates(page: number, scope: BlogSection): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const l of BLOG_LANGS) {
    if (page <= getTotalPages(l, scope)) {
      languages[blogStrings[l].htmlLang.slice(0, 2)] = pageUrl(page, l, scope)
    }
  }
  if (languages.vi) languages['x-default'] = languages.vi
  return languages
}

export function blogIndexMetadata(page: number, lang: BlogLang = 'vi', scope: BlogSection = 'ai'): Metadata {
  const s = blogStrings[lang]
  const ix = indexStrings(lang, scope)
  const isFirst = page <= 1
  const url = pageUrl(page, lang, scope)
  const title = isFirst ? ix.seriesTitle : ix.pageTitle(page)
  const description = isFirst ? ix.seriesDescription : ix.pageDescription(page, getTotalPages(lang, scope))
  const ogImage = `/images/blog/og/${scope === 'ai' ? 'ai-for-devs' : 'blog'}-${lang}.jpg`

  return {
    title,
    description,
    keywords: ix.seriesKeywords,
    alternates: { canonical: url, languages: indexAlternates(page, scope) },
    openGraph: {
      title: `${title} | ${lang === 'vi' ? 'Nguyễn Huỳnh' : 'Nguyen Huynh'}`,
      description,
      url,
      type: 'website',
      locale: s.ogLocale,
      // Setting openGraph here replaces the layout's opengraph-image, so the image must be explicit.
      images: [{ url: ogImage, width: 1200, height: 630, alt: ix.seriesTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default function BlogIndex({
  page,
  lang = 'vi',
  scope = 'ai',
}: {
  page: number
  lang?: BlogLang
  /** 'ai' lists the AI for Devs series only; 'blog' lists every post. */
  scope?: BlogSection
}) {
  const s = blogStrings[lang]
  const ix = indexStrings(lang, scope)
  const base = SECTION_BASES[scope][lang]
  const totalPages = getTotalPages(lang, scope)
  const posts = getPostsPage(page, lang, scope)
  const isFirst = page <= 1
  // Search covers every post of this index, not just the ones on this page.
  const searchItems: SearchItem[] = getIndexPosts(lang, scope).map((p) => ({
    url: postUrl(p.slug, lang, p.section),
    badge: p.section === 'ai' ? String(p.order).padStart(2, '0') : null,
    title: p.title,
    description: p.description,
    keywords: p.keywords,
    tags: p.tags,
  }))

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: s.home, item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: ix.name, item: `${SITE_URL}${base}` },
      ...(isFirst
        ? []
        : [{ '@type': 'ListItem', position: 3, name: s.page(page), item: `${SITE_URL}${pageUrl(page, lang, scope)}` }]),
    ],
  }

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: ix.seriesTitle,
    url: `${SITE_URL}${base}`,
    inLanguage: s.htmlLang,
    author: { '@id': `${SITE_URL}/#person` },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE_URL}${postUrl(p.slug, lang, p.section)}`,
      ...(p.cover ? { image: `${SITE_URL}${p.cover}` } : {}),
      datePublished: p.date,
    })),
  }

  return (
    <main id="main" className="relative min-h-screen" lang={s.htmlLang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <div className="container mx-auto px-6 pt-[88px] sm:pt-28 pb-4 max-w-4xl">
        {/* Hero */}
        <div className="relative">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[380px] h-[220px] rounded-full bg-accent/10 blur-[90px] -z-10 pointer-events-none" />

          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {scope === 'ai' ? `Series · ${s.seriesName}` : ix.name}
            {isFirst ? '' : ` · ${s.page(page)}/${totalPages}`}
          </div>
          <h1 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            {ix.heroTitle}{isFirst ? '' : ` — ${s.page(page)}`}
          </h1>
          {isFirst && (
            <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed text-base sm:text-lg">
              {ix.heroIntroBefore}
              <Link href="/" className="text-accent hover:underline font-medium">
                {ix.heroIntroLink}
              </Link>
              {ix.heroIntroAfter}
            </p>
          )}
        </div>

        {/* Switch between every post and the AI for Devs series. */}
        <nav aria-label={s.filterLabel} className="mt-8 flex flex-wrap gap-2">
          {(
            [
              { key: 'blog', label: s.filterAll },
              { key: 'ai', label: s.filterSeries },
            ] as const
          ).map((f) => (
            <Link
              key={f.key}
              href={SECTION_BASES[f.key][lang]}
              aria-current={f.key === scope ? 'page' : undefined}
              className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors ${
                f.key === scope
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-black/[0.1] dark:border-white/[0.1] text-gray-700 dark:text-gray-300 hover:border-accent/50 hover:text-accent'
              }`}
            >
              {f.label}
            </Link>
          ))}
        </nav>

        <BlogSearch items={searchItems} lang={lang} className="mt-4" />

        {/* Posts */}
        <ul className="mt-8 space-y-5">
          {posts.map((post, i) => (
            <li key={`${post.section}-${post.slug}`}>
              <FadeIn delay={Math.min(i * 0.03, 0.15)}>
                <Link href={postUrl(post.slug, lang, post.section)} className="block group">
                  <article className="relative flex flex-col sm:flex-row gap-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.07] bg-card/70 dark:bg-card/40 p-4 sm:p-5 transition-all duration-300 hover:border-accent/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/5">
                    <PostCover
                      post={post}
                      sizes="(min-width: 640px) 240px, 100vw"
                      priority={isFirst && i < 2}
                      className="w-full sm:w-60 shrink-0 self-start"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {post.section === 'ai' ? (
                          // Series posts carry their part number; on the mixed index they are also named.
                          <span className="inline-flex items-center justify-center h-7 min-w-7 gap-1.5 rounded-full bg-accent/10 px-2 text-accent font-semibold">
                            {scope === 'blog' && <span>{s.seriesName}</span>}
                            {String(post.order).padStart(2, '0')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center h-7 rounded-full bg-sky-400/10 px-2.5 font-semibold text-sky-600 dark:text-sky-300">
                            {s.techLabel}
                          </span>
                        )}
                        <span>{formatDate(post.date, lang)}</span>
                        <span aria-hidden>•</span>
                        <span>{s.minRead(post.readingTime)}</span>
                      </div>

                      <h2 className="text-lg sm:text-xl font-semibold leading-snug text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                        {post.title}
                      </h2>

                      <p className="mt-2 text-sm sm:text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                        {post.description}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-sm font-medium text-accent inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          {s.readPost}
                          <span aria-hidden>→</span>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>

        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} lang={lang} scope={scope} />}
      </div>

      <Footer />
    </main>
  )
}

/** Real links (rendered as <a href>) so crawlers can reach every page. */
function Pagination({
  page,
  totalPages,
  lang,
  scope,
}: {
  page: number
  totalPages: number
  lang: BlogLang
  scope: BlogSection
}) {
  const s = blogStrings[lang]
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const base =
    'inline-flex items-center justify-center min-w-10 h-10 px-3 rounded-xl border text-sm font-medium transition-colors'
  const idle =
    'border-black/[0.08] dark:border-white/[0.08] text-gray-700 dark:text-gray-300 hover:border-accent/50 hover:text-accent'

  return (
    <nav aria-label={s.pagination} className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={pageUrl(page - 1, lang, scope)} rel="prev" className={`${base} ${idle}`}>
          <span aria-hidden>←</span>
          <span className="ml-1">{s.prevPage}</span>
        </Link>
      )}
      {pages.map((p) =>
        p === page ? (
          <span key={p} aria-current="page" className={`${base} border-accent bg-accent/15 text-accent`}>
            {p}
          </span>
        ) : (
          <Link key={p} href={pageUrl(p, lang, scope)} className={`${base} ${idle}`} aria-label={s.page(p)}>
            {p}
          </Link>
        )
      )}
      {page < totalPages && (
        <Link href={pageUrl(page + 1, lang, scope)} rel="next" className={`${base} ${idle}`}>
          <span className="mr-1">{s.nextPage}</span>
          <span aria-hidden>→</span>
        </Link>
      )}
    </nav>
  )
}
