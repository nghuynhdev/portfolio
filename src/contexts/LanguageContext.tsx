"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Language, translations, TranslationKeys } from '@/translations'
import { blogHome, blogLangFromPath } from '@/lib/blog-i18n'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationKeys
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

/**
 * Home page: language is a client-side preference (saved in localStorage).
 * Blog pages: language comes from the URL (/ai-for-devs = vi, /en/ai-for-devs = en),
 * so server HTML, nav labels and content agree. Switching language there navigates
 * to the other version of the same page, found through its hreflang link.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const routeLanguage = blogLangFromPath(pathname)
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
      router.push(alternate ? new URL(alternate.href).pathname : blogHome(lang))
    },
    [routeLanguage, router]
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
