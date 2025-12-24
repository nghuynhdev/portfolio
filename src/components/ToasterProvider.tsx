"use client"

import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'

export default function ToasterProvider() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark')
      setIsDark(isDarkMode)
    }

    checkTheme()

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: isDark ? '#1f2937' : '#ffffff',
          color: isDark ? '#f9fafb' : '#111827',
          border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
          boxShadow: isDark
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        },
        success: {
          duration: 4000,
          style: {
            background: isDark ? '#065f46' : '#d1fae5',
            color: isDark ? '#d1fae5' : '#065f46',
            border: isDark ? '1px solid #047857' : '1px solid #6ee7b7',
          },
          iconTheme: {
            primary: isDark ? '#34d399' : '#10b981',
            secondary: isDark ? '#065f46' : '#ffffff',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: isDark ? '#7f1d1d' : '#fee2e2',
            color: isDark ? '#fecaca' : '#7f1d1d',
            border: isDark ? '1px solid #991b1b' : '1px solid #fca5a5',
          },
          iconTheme: {
            primary: isDark ? '#f87171' : '#ef4444',
            secondary: isDark ? '#7f1d1d' : '#ffffff',
          },
        },
      }}
    />
  )
}
