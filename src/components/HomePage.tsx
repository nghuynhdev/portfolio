import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import Overview from '@/components/Overview'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Education from '@/components/Education'
import Contact from '@/components/Contact'
import LatestPostsSection from '@/components/LatestPostsSection'
import { getIndexPosts, formatDate, postUrl, type BlogLang } from '@/lib/blog'
import { HOME_URLS, SECTION_BASES } from '@/lib/blog-i18n'
import Footer from '@/components/Footer'
import ParticleWrapper from '@/components/ParticleWrapper'
import MotionProvider from '@/components/MotionProvider'

/** Canonical + hreflang for the home page of one language (/ = en, /vi = vi). */
export function homeAlternates(lang: BlogLang): Metadata['alternates'] {
  return {
    canonical: HOME_URLS[lang],
    languages: { en: HOME_URLS.en, vi: HOME_URLS.vi, 'x-default': HOME_URLS.en },
  }
}

/**
 * The home page, shared by / (English) and /vi (Vietnamese). The sections are client
 * components that read the language from the URL through LanguageContext.
 */
export default function HomePage() {
  const latest = (lang: BlogLang) =>
    getIndexPosts(lang, 'blog')
      .slice(0, 3)
      .map((p) => ({ ...p, url: postUrl(p.slug, lang, p.section), dateLabel: formatDate(p.date, lang) }))
  const latestPosts = { vi: latest('vi'), en: latest('en') }

  return (
    <MotionProvider>
      <main id="main" className="relative">
        <ParticleWrapper />
        <Hero />
        <Overview />
        <Experience />
        <Skills />
        <Education />
        <LatestPostsSection posts={latestPosts} seriesUrls={SECTION_BASES.blog} />
        <Contact />
        <Footer />
      </main>
    </MotionProvider>
  )
}
