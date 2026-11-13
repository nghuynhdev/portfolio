"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Language, translations, TranslationKeys } from '@/translations'
import { blogHome, blogLangFromPath, homeLangFromPath, homeUrl } from '@/lib/blog-i18n'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationKeys
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

/**
 * Language comes from the URL on the home page (/ = en, /vi = vi) and on blog pages
 * (/ai-for-devs = vi, /en/ai-for-devs = en), so server HTML, nav labels and content
 * agree and each language has its own indexable URL. Switching language navigates to
 * the other version of the same page, found through its hreflang link.
 * Elsewhere (404 pages) it falls back to the preference saved in localStorage.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const homeLanguage = homeLangFromPath(pathname)
  const routeLanguage = blogLangFromPath(pathname) ?? homeLanguage
  const [preferred, setPreferred] = useState<Language>('en')
  const language = routeLanguage ?? preferred

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'vi')) {
      setPreferred(savedLanguage)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = useCallback(
    (lang: Language) => {
      setPreferred(lang)
      localStorage.setItem('language', lang)
      if (!routeLanguage || lang === routeLanguage) return
      const alternate = document.querySelector<HTMLLinkElement>(
        `link[rel="alternate"][hreflang="${lang}"]`
      )
      const fallback = homeLanguage ? homeUrl(lang) : blogHome(lang)
      router.push(alternate ? new URL(alternate.href).pathname : fallback)
    },
    [routeLanguage, homeLanguage, router]
  )

  const value = {
    language,
    setLanguage,
    t: translations[language]
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
