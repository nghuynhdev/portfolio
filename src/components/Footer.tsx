'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { blogHome, homeUrl } from '@/lib/blog-i18n'

const socials = [
  {
    href: 'https://github.com/nghuynhdev',
    label: 'GitHub',
    path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z',
  },
  {
    href: 'https://www.linkedin.com/in/nghuynhdev/',
    label: 'LinkedIn',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    href: 'https://www.facebook.com/nghuynhit',
    label: 'Facebook',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
]

const footerText = {
  vi: {
    tagline: 'Nguyễn Huỳnh — Full Stack Developer tại TP.HCM. React.js, Next.js, Node.js, NestJS.',
    linksLabel: 'Liên kết nhanh',
    links: 'Liên kết',
    connect: 'Kết nối',
    home: 'Trang chủ',
    experience: 'Kinh nghiệm',
    contact: 'Liên hệ',
  },
  en: {
    tagline: 'Nguyen Huynh — Full Stack Developer in Ho Chi Minh City. React.js, Next.js, Node.js, NestJS.',
    linksLabel: 'Quick links',
    links: 'Links',
    connect: 'Connect',
    home: 'Home',
    experience: 'Experience',
    contact: 'Contact',
  },
}

export default function Footer() {
  const { t, language } = useLanguage()
  const f = footerText[language]
  const quickLinks = [
    { href: homeUrl(language), label: f.home },
    { href: homeUrl(language, 'experience'), label: f.experience },
    { href: blogHome(language), label: 'Blog' },
    { href: homeUrl(language, 'contact'), label: f.contact },
  ]

  return (
    <footer className="relative z-10 mt-24 border-t border-black/[0.08] dark:border-white/[0.08] bg-white/80 dark:bg-[#0b0e18] backdrop-blur-xl">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr] gap-x-8 gap-y-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 max-w-sm">
            <Link
              href={homeUrl(language)}
              className="inline-block py-1.5 text-2xl font-bold logo-font text-gray-800 dark:text-white rounded"
            >
              Huynh.
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {f.tagline}
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label={f.linksLabel} className="flex flex-col md:gap-3 text-sm">
            <span className="mb-1 md:mb-0 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {f.links}
            </span>
            {quickLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="py-3 md:py-0 text-gray-600 dark:text-gray-300 hover:text-accent transition-colors w-fit touch-manipulation"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Connect */}
          <div className="flex flex-col md:gap-3 text-sm">
            <span className="mb-1 md:mb-0 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {f.connect}
            </span>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 py-3 md:py-0 text-gray-600 dark:text-gray-300 hover:text-accent transition-colors w-fit touch-manipulation"
              >
                <svg
                  aria-hidden="true"
                  className="w-[18px] h-[18px] text-gray-400 dark:text-gray-500 group-hover:text-accent transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d={s.path} />
                </svg>
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-black/[0.06] dark:border-white/[0.06] text-center">
          <p
            className="text-gray-500 dark:text-gray-400 text-sm"
            dangerouslySetInnerHTML={{ __html: t.contact.footer }}
          />
        </div>
      </div>
    </footer>
  )
}
