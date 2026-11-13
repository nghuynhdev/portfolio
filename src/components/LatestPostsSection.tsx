"use client"

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import PostCover from '@/components/blog/PostCover'
import type { PostMeta } from '@/lib/blog'

/** Post data prepared on the server (lib/blog reads the filesystem). */
export type LatestPostItem = PostMeta & { url: string; dateLabel: string }

/** Home-page teaser for the blog: crawlable links from / to the newest posts. */
export default function LatestPostsSection({
  posts: postsByLang,
  seriesUrls,
}: {
  posts: Record<'vi' | 'en', LatestPostItem[]>
  seriesUrls: Record<'vi' | 'en', string>
}) {
  const { t, language } = useLanguage()
  // Show the series in the visitor's language; fall back to Vietnamese while
  // fewer than three English translations exist.
  const lang = language === 'en' && postsByLang.en.length >= 3 ? 'en' : 'vi'
  const posts = postsByLang[lang]
  const seriesUrl = seriesUrls[lang]

  return (
    <section id="latest-posts" className="py-10 md:py-20">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {t.latestPosts.eyebrow}
          </div>
          <h2 className="mt-2 text-2xl md:text-4xl font-bold text-gray-800 dark:text-white">
            {t.latestPosts.title}
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
            {t.latestPosts.subtitle}
          </p>
        </div>

        <ul className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <li key={post.url} lang={lang}>
              <Link href={post.url} className="group block h-full">
                <article className="h-full flex flex-col rounded-2xl border border-black/[0.08] dark:border-white/[0.07] bg-white dark:bg-[#161b27] p-4 shadow-sm dark:shadow-black/30 transition-all duration-300 hover:border-accent/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/5">
                  <PostCover post={post} sizes="(min-width: 768px) 360px, 100vw" />
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <time dateTime={post.date}>{post.dateLabel}</time>
                    <span aria-hidden>•</span>
                    <span>{post.tags.find((tag) => tag !== 'AI' && tag !== 'Developer') ?? 'AI'}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-gray-900 dark:text-white group-hover:text-accent transition-colors line-clamp-3">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                  <span className="mt-auto pt-4 text-sm font-medium text-accent inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    {t.latestPosts.readMore}
                    <span aria-hidden>→</span>
                  </span>
                </article>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Link
            href={seriesUrl}
            className="inline-flex items-center gap-2 min-h-[44px] rounded-xl border border-accent/50 px-5 py-2.5 text-sm font-semibold text-accent hover:bg-accent/10 transition-colors"
          >
            {t.latestPosts.viewAll}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
