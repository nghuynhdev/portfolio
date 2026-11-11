'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { blogStrings, type BlogLang } from '@/lib/blog-i18n'

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

export default function BlogAuthor({ lang = 'vi' }: { lang?: BlogLang }) {
  const a = blogStrings[lang].author
  const name = lang === 'vi' ? 'Nguyễn Huỳnh' : 'Nguyen Huynh'
  return (
    <motion.aside
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-gradient-to-br from-white to-accent/[0.05] dark:from-[#161b27] dark:to-accent/[0.08] p-6 sm:p-8"
    >
      <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-accent/15 blur-[70px] pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
        <Link href="/" aria-label={a.homeAria} className="shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-accent shadow-[0_0_24px_rgb(var(--accent)/0.35)] bg-gray-100 dark:bg-[#0f1117]">
            <Image
              src="/assets/images/avt-v2.webp"
              alt={`${name} — Full Stack Developer`}
              width={120}
              height={120}
              sizes="96px"
              priority
              className="w-full h-full object-cover object-top"
            />
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">
            {a.label}
          </div>
          <h3 className="mt-0.5 text-xl font-bold text-gray-900 dark:text-white">
            <Link href="/" className="hover:text-accent transition-colors">
              {name}
            </Link>
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {a.role}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {a.bio}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 grid place-items-center rounded-full border border-black/10 dark:border-white/15 text-gray-500 dark:text-gray-400 hover:text-accent hover:border-accent transition-colors"
              >
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
            <Link
              href="/"
              className="ml-1 inline-flex items-center h-9 px-4 rounded-full bg-accent text-white dark:text-gray-900 text-sm font-medium hover:bg-accent/90 transition-colors shadow-sm shadow-accent/25"
            >
              {a.portfolio}
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center h-9 px-4 rounded-full border border-accent/30 text-accent text-sm font-medium hover:bg-accent/10 transition-colors"
            >
              {a.contact}
            </Link>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
