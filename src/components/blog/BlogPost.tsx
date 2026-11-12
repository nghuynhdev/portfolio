import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import BlogAuthor from '@/components/blog/BlogAuthor'
import ReadingProgress from '@/components/blog/ReadingProgress'
import PostCover from '@/components/blog/PostCover'
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  getTranslations,
  formatDate,
  BLOG_BASES,
  postUrl,
  type BlogLang,
} from '@/lib/blog'
import { blogStrings } from '@/lib/blog-i18n'

const SITE_URL = 'https://www.huynhnguyen.info.vn'

/** Static params for one language's post route. */
export function postStaticParams(lang: BlogLang) {
  return getAllPosts(lang).map((p) => ({ slug: p.slug }))
}

/** URLs of every language version of a post, keyed by hreflang (plus x-default). */
function postAlternates(order: number): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const [l, p] of Object.entries(getTranslations(order)) as [BlogLang, { slug: string }][]) {
    languages[l] = postUrl(p.slug, l)
  }
  if (languages.vi) languages['x-default'] = languages.vi
  return languages
}

export function postMetadata(slug: string, lang: BlogLang): Metadata {
  const s = blogStrings[lang]
  const post = getPostBySlug(slug, lang)
  if (!post) return { title: s.notFound }

  const url = postUrl(post.slug, lang)
  const images = post.ogImage
    ? [{ url: post.ogImage, width: 1200, height: 630, alt: post.title }]
    : post.cover
      ? [{ url: post.cover, width: 1600, height: 900, alt: post.title }]
      : undefined

  // Keep <title> within ~60 chars so Google doesn't truncate it; add the brand only if it fits.
  const branded = `${post.seoTitle} | Huynh`
  return {
    title: { absolute: branded.length <= 60 ? branded : post.seoTitle },
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url, languages: postAlternates(post.order) },
    openGraph: {
      title: post.title,
      locale: s.ogLocale,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.date,
      ...(post.updated ? { modifiedTime: post.updated } : {}),
      authors: ['Nguyen Huynh'],
      tags: post.tags,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      ...(images ? { images: [images[0].url] } : {}),
    },
  }
}

const cardClass =
  'rounded-2xl border border-black/[0.08] dark:border-white/[0.07] bg-card/70 dark:bg-card/40 p-5'
const cardTitleClass =
  'text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-4'

function Icon({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 text-accent shrink-0"
      aria-hidden
    >
      <path d={d} />
    </svg>
  )
}

const ICONS = {
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  calendar: 'M8 3v3M16 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
  layers: 'm12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5',
}

export default function BlogPost({ slug, lang }: { slug: string; lang: BlogLang }) {
  const s = blogStrings[lang]
  const post = getPostBySlug(slug, lang)
  if (!post) notFound()

  const base = BLOG_BASES[lang]
  // Series numbering follows the Vietnamese original, so totals match across languages.
  const totalPosts = getAllPosts('vi').length
  const isUpdated = Boolean(post.updated && post.updated > post.date)
  const related = getRelatedPosts(slug, 3, lang)
  const otherLang: BlogLang = lang === 'vi' ? 'en' : 'vi'
  const translation = getTranslations(post.order)[otherLang]
  const url = `${SITE_URL}${postUrl(post.slug, lang)}`
  const shareUrl = encodeURIComponent(url)
  const shareText = encodeURIComponent(post.title)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    inLanguage: s.htmlLang,
    keywords: post.keywords,
    ...(translation
      ? {
          [lang === 'vi' ? 'workTranslation' : 'translationOfWork']: {
            '@id': `${SITE_URL}${postUrl(translation.slug, otherLang)}`,
          },
        }
      : {}),
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@id': `${SITE_URL}/#person`, name: 'Nguyen Huynh' },
    publisher: { '@id': `${SITE_URL}/#person`, name: 'Nguyen Huynh' },
    image: `${SITE_URL}${post.cover ?? '/assets/images/avt-v2.webp'}`,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: s.home, item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'AI for Devs', item: `${SITE_URL}${base}` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  }

  const shareLinks = [
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, short: 'f' },
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`, short: 'X' },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, short: 'in' },
  ]

  return (
    <main id="main" className="relative min-h-screen">
      <ReadingProgress />


      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="container mx-auto px-4 sm:px-6 pt-[88px] sm:pt-28 pb-4 max-w-6xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500 dark:text-gray-400 flex min-w-0">
          <Link href="/" className="hover:text-accent transition-colors shrink-0">
            {s.home}
          </Link>
          <span className="mx-2">/</span>
          <Link href={base} className="hover:text-accent transition-colors shrink-0">
            AI for Devs
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300 truncate">{post.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Main column */}
          <div className="min-w-0">
            <article>
              <header className="relative mb-6">
                <div className="absolute -top-14 -left-10 w-[300px] h-[160px] rounded-full bg-accent/10 blur-[80px] -z-10 pointer-events-none" />
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  AI for Devs · {s.postNumber(String(post.order).padStart(2, '0'))}
                </div>
                <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                  {post.title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {lang === 'vi' ? 'Nguyễn Huỳnh' : 'Nguyen Huynh'}
                  </span>
                  <span aria-hidden>•</span>
                  <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
                  {isUpdated && (
                    <>
                      <span aria-hidden>•</span>
                      <span>
                        {s.updated} <time dateTime={post.updated}>{formatDate(post.updated, lang)}</time>
                      </span>
                    </>
                  )}
                  <span aria-hidden>•</span>
                  <span>{s.minRead(post.readingTime)}</span>
                  {translation && (
                    <>
                      <span aria-hidden>•</span>
                      <Link
                        href={postUrl(translation.slug, otherLang)}
                        hrefLang={otherLang}
                        lang={otherLang}
                        className="font-medium text-accent hover:underline"
                      >
                        {s.translationLink}
                      </Link>
                    </>
                  )}
                </div>
              </header>

              <PostCover
                post={post}
                priority
                sizes="(min-width: 1152px) 800px, (min-width: 1024px) 70vw, 100vw"
                className="rounded-2xl mb-8 shadow-2xl shadow-black/30"
              />

              <p className="mb-8 text-lg leading-relaxed text-gray-300 border-l-2 border-accent pl-4">
                {post.description}
              </p>

              <div className="article-content" dangerouslySetInnerHTML={{ __html: post.html }} />
            </article>

            {/* Author card */}
            <div className="mt-12">
              <BlogAuthor lang={lang} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1 [scrollbar-width:thin]">
            <section className={cardClass} aria-labelledby="post-info">
              <h2 id="post-info" className={cardTitleClass}>
                {s.aboutPost}
              </h2>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-3">
                  <Icon d={ICONS.clock} />
                  <span>
                    <strong className="text-white">{s.readingTimeStrong(post.readingTime)}</strong>
                    {s.readingTimeSuffix}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Icon d={ICONS.calendar} />
                  <span>
                    <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
                    {isUpdated && (
                      <span className="block text-xs text-gray-500">
                        {s.updated} {formatDate(post.updated, lang)}
                      </span>
                    )}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Icon d={ICONS.layers} />
                  <span>
                    {s.seriesPositionBefore}
                    <strong className="text-white">{post.order}</strong>
                    {s.seriesPositionAfter(totalPosts)}
                  </span>
                </li>
              </ul>
              {post.tags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-md bg-white/[0.06] text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {post.headings.length > 1 && (
              <nav className={`${cardClass} hidden lg:block`} aria-labelledby="post-toc">
                <h2 id="post-toc" className={cardTitleClass}>
                  {s.toc}
                </h2>
                <ol className="space-y-2 text-sm">
                  {post.headings.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="block leading-snug text-gray-400 hover:text-accent transition-colors"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <section className={cardClass} aria-labelledby="post-share">
              <h2 id="post-share" className={cardTitleClass}>
                {s.share}
              </h2>
              <div className="flex gap-2">
                {shareLinks.map((sl) => (
                  <a
                    key={sl.label}
                    href={sl.href}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    aria-label={s.shareOn(sl.label)}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/[0.1] text-sm font-semibold text-gray-300 hover:border-accent hover:text-accent transition-colors"
                  >
                    {sl.short}
                  </a>
                ))}
              </div>
            </section>

          </aside>
        </div>

        {/* Recommended posts */}
        {related.length > 0 && (
          <section aria-labelledby="post-recommended" className="mt-16">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {s.recommendedEyebrow}
            </div>
            <h2
              id="post-recommended"
              className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              {s.recommended}
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={postUrl(r.slug, lang)} className="group block h-full">
                    <article className="h-full flex flex-col rounded-2xl border border-black/[0.08] dark:border-white/[0.07] bg-white dark:bg-[#161b27] p-4 shadow-sm dark:shadow-black/30 transition-all duration-300 hover:border-accent/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/5">
                      <PostCover post={r} sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" />
                      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <time dateTime={r.date}>{formatDate(r.date, lang)}</time>
                        <span aria-hidden>•</span>
                        <span>{s.minRead(r.readingTime)}</span>
                      </div>
                      <h3 className="mt-2 text-lg font-semibold leading-snug text-gray-900 dark:text-white group-hover:text-accent transition-colors line-clamp-3">
                        {r.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                        {r.description}
                      </p>
                      <span className="mt-auto pt-4 text-sm font-medium text-accent inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        {s.readPost}
                        <span aria-hidden>→</span>
                      </span>
                    </article>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12 text-center">
          <Link
            href={base}
            className="inline-flex items-center gap-2 rounded-xl border border-accent/50 px-5 py-2.5 text-sm font-semibold text-accent hover:bg-accent/10 transition-colors"
          >
            <span aria-hidden>←</span> {s.allPosts}
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}
