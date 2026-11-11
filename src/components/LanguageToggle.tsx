"use client"

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

const languages = [
  { code: 'en', label: 'EN', name: 'English', flag: '🇺🇸' },
  { code: 'vi', label: 'VI', name: 'Tiếng Việt', flag: '🇻🇳' },
] as const

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div
      role="group"
      aria-label={t.nav.changeLanguage}
      className="relative inline-flex items-center gap-0.5 p-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-sm"
    >
      {languages.map((lang) => {
        const active = language === lang.code
        return (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code as 'en' | 'vi')}
            aria-pressed={active}
            aria-label={lang.name}
            className={`relative flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors duration-200 ${
              active
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {active && (
              <motion.span
                layoutId="langPill"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                className="absolute inset-0 rounded-full bg-white dark:bg-white/[0.14] shadow-sm dark:shadow-black/20"
              />
            )}
            <span className="relative z-10 text-sm leading-none">{lang.flag}</span>
            <span className="relative z-10">{lang.label}</span>
          </button>
        )
      })}
    </div>
  )
}
