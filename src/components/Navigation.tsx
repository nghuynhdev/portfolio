"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageToggle from './LanguageToggle'
import { blogHome, blogLangFromPath } from '@/lib/blog-i18n'

const MotionLink = motion.create(Link)

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const { t, language } = useLanguage()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isBlog = blogLangFromPath(pathname) !== null

  const scrollToSection = (sectionId: string, navHeight: number) => {
    const element = document.getElementById(sectionId)
    if (element) {
      setIsMenuOpen(false)
      setTimeout(() => {
        const elementPosition = element.offsetTop - navHeight
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({
          top: elementPosition,
          behavior: reduceMotion ? 'auto' : 'smooth',
        })
      }, 150)
    }
  }

  const menuItems = [
    { key: 'home', section: 'hero' },
    { key: 'overview', section: 'overview' },
    { key: 'experience', section: 'experience' },
    { key: 'skills', section: 'skills' },
    { key: 'education', section: 'education' },
    { key: 'contact', section: 'contact' },
  ]

  type NavItem = { key: string; label: string; href: string; section?: string; active: boolean }

  const navItems: NavItem[] = [
    ...menuItems.map((item) => ({
      key: item.key,
      label: t.nav[item.key as keyof typeof t.nav] as string,
      href: isHome ? `#${item.section}` : `/#${item.section}`,
      section: item.section,
      active: isHome && activeSection === item.section,
    })),
    { key: 'blog', label: 'AI for Devs', href: blogHome(language), active: isBlog },
  ]

  const handleNavClick = (e: React.MouseEvent, item: NavItem, navHeight: number) => {
    if (isHome && item.section) {
      e.preventDefault()
      scrollToSection(item.section, navHeight)
      return
    }
    setIsMenuOpen(false)
  }

  useEffect(() => {
    if (!isHome) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.3 }
    )
    menuItems.forEach((item) => {
      const element = document.getElementById(item.section)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHome])

  const deskClass = (active: boolean) =>
    `relative px-2 lg:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
      active ? 'text-accent' : 'text-gray-500 dark:text-gray-400 hover:text-accent'
    }`

  const mobileClass = (active: boolean) =>
    `relative text-left py-4 px-4 rounded-lg transition-all duration-200 touch-manipulation select-none ${
      active
        ? 'bg-accent/10 text-accent'
        : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800/50 active:bg-blue-100 dark:active:bg-gray-700'
    }`

  return (
    <motion.nav
      layoutRoot
      className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-[#0b0e18]/95 backdrop-blur-xl z-50 border-b border-black/[0.08] dark:border-white/[0.06] shadow-sm dark:shadow-none"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <a
              href={isHome ? '#hero' : '/'}
              onClick={(e) => {
                if (isHome) {
                  e.preventDefault()
                  scrollToSection('hero', 0)
                }
              }}
              className="inline-block py-1.5 text-2xl font-bold text-gray-800 dark:text-white logo-font rounded"
            >
              Huynh.
            </a>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <MotionLink
                key={item.key}
                href={item.href}
                onClick={(e) => handleNavClick(e, item, 0)}
                aria-current={item.active ? 'page' : undefined}
                className={`${deskClass(item.active)} whitespace-nowrap`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.active && (
                  <motion.div
                    layoutId={`activeTab-${pathname}`}
                    // Only re-measure when the active tab changes; otherwise a route
                    // change that resets scroll makes the pill fly in from below.
                    layoutDependency={item.key}
                    className="absolute inset-0 bg-accent/10 rounded-lg"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </MotionLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            <LanguageToggle />

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              onTouchStart={() => {}}
              aria-label={isMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={isMenuOpen}
              className="md:hidden p-3 text-gray-700 dark:text-gray-300 hover:bg-blue-100/50 dark:hover:bg-gray-800 rounded-lg transition-colors touch-manipulation select-none active:bg-blue-100 dark:active:bg-gray-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isMenuOpen ? { rotate: 180 } : { rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden py-4 border-t border-black/[0.06] dark:border-white/[0.06]"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-2">
                {navItems.map((item, index) => (
                  <MotionLink
                    key={item.key}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item, 64)}
                    aria-current={item.active ? 'page' : undefined}
                    className={mobileClass(item.active)}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 * index }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.label}
                  </MotionLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
