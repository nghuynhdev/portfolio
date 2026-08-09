"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageToggle from './LanguageToggle'
import ThemeToggle from './ThemeToggle'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const { t } = useLanguage()

  const scrollToSection = (sectionId: string, navHeight: number) => {
    const element = document.getElementById(sectionId)
    
    if (element) {
      setIsMenuOpen(false)
      
      setTimeout(() => {
        const elementPosition = element.offsetTop - navHeight
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
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
    { key: 'contact', section: 'contact' }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 }
    )

    menuItems.forEach((item) => {
      const element = document.getElementById(item.section)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-[#0b0e18]/95 backdrop-blur-lg z-50 border-b border-black/[0.06] dark:border-white/[0.06]"
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
            <span className="text-2xl font-bold text-gray-800 dark:text-white logo-font">
              Huynh.
            </span>
          </motion.div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item, index) => {
              const isActive = activeSection === item.section
              return (
                <motion.button
                  key={item.key}
                  onClick={() => scrollToSection(item.section, 0)}
                  className={`relative px-2 lg:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">
                    {t.nav[item.key as keyof typeof t.nav]}
                  </span>
                </motion.button>
              )
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <LanguageToggle />
            
            {/* Mobile Menu Button */}
            <motion.button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              onTouchStart={() => {}}
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
              className="md:hidden py-4 border-t border-gray-200/30 dark:border-gray-700/30"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-2">
                {menuItems.map((item, index) => {
                  const isActive = activeSection === item.section
                  return (
                    <motion.button
                      key={item.key}
                      onClick={() => scrollToSection(item.section, 64)}
                      onTouchStart={() => {}} 
                      className={`relative text-left py-4 px-4 rounded-lg transition-all duration-200 touch-manipulation select-none ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800/50 active:bg-blue-100 dark:active:bg-gray-700'
                      }`}
                      initial={{ x: -10 }}
                      animate={{ x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t.nav[item.key as keyof typeof t.nav]}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}