import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Overview from '@/components/Overview'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Education from '@/components/Education'
import Contact from '@/components/Contact'
import FloatingElements from '@/components/FloatingElements'
import { LanguageProvider } from '@/contexts/LanguageContext'

export default function Home() {
  return (
    <LanguageProvider>
      <main className="relative">
        <FloatingElements />
        <Navigation />
        <Hero />
        <Overview />
        <Experience />
        <Skills />
        <Education />
        <Contact />
      </main>
    </LanguageProvider>
  )
}