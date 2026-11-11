import Hero from '@/components/Hero'
import Overview from '@/components/Overview'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Education from '@/components/Education'
import Contact from '@/components/Contact'
import LatestPostsSection from '@/components/LatestPostsSection'
import { getAllPosts, formatDate, postUrl, BLOG_BASES, type BlogLang } from '@/lib/blog'
import Footer from '@/components/Footer'
import ParticleWrapper from '@/components/ParticleWrapper'
import MotionProvider from '@/components/MotionProvider'

export default function Home() {
  const latest = (lang: BlogLang) =>
    getAllPosts(lang)
      .slice(0, 3)
      .map((p) => ({ ...p, url: postUrl(p.slug, lang), dateLabel: formatDate(p.date, lang) }))
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
        <LatestPostsSection posts={latestPosts} seriesUrls={BLOG_BASES} />
        <Contact />
        <Footer />
      </main>
    </MotionProvider>
  )
}