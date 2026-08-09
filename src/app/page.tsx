import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Overview from '@/components/Overview'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Education from '@/components/Education'
import Contact from '@/components/Contact'
import { LanguageProvider } from '@/contexts/LanguageContext'
import ParticleWrapper from '@/components/ParticleWrapper'

export default function Home() {
  return (
    <LanguageProvider>
      <main className="relative">
        <ParticleWrapper />
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