"use client"

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <motion.div 
      className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-[2px] rounded-full"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-center bg-white dark:bg-gray-900 rounded-full px-1 py-1">
        <motion.button
          onClick={() => setLanguage('en')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            language === 'en'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          EN
        </motion.button>
        <motion.button
          onClick={() => setLanguage('vi')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            language === 'vi'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          VI
        </motion.button>
      </div>
    </motion.div>
  )
}