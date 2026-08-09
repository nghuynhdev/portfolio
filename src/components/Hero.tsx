"use client"

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'

export default function Hero() {
  const { t } = useLanguage()

  const technologies = [
    { name: "React.js" },
    { name: "Next.js" },
    { name: "Node.js" },
    { name: "NestJS" },
    { name: "TypeScript" },
  ]

  const contactInfo = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      text: t.hero.email
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      text: t.hero.phone
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      text: t.hero.location
    }
  ]

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.5) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Avatar */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="/assets/images/avatar1.png"
              alt="Avatar"
              width={224}
              height={224}
              className="w-32 h-32 md:w-56 md:h-56 rounded-full mx-auto object-cover object-[center_10%] border-4 border-blue-500 shadow-lg"
              priority
            />
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-gray-800 dark:text-white mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t.hero.name}
          </motion.h1>
          
          <motion.h2 
            className="text-2xl md:text-3xl text-blue-600 dark:text-blue-400 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t.hero.title}
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed whitespace-pre-line max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {t.hero.description}
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {contactInfo.map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                whileHover={{ scale: 1.05 }}
              >
                {item.icon}
                {item.text}
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="flex flex-wrap gap-1.5 md:gap-3 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {technologies.map((tech, index) => (
              <motion.span
                key={tech.name}
                className="px-2.5 md:px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50 rounded-full text-xs md:text-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + (index * 0.1) }}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                {tech.name}
              </motion.span>
            ))}
          </motion.div>

          {/* Enhanced Floating elements animation */}
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 dark:bg-blue-800/30 rounded-full blur-sm"
            animate={{ 
              y: [0, -40, 0, -25, 0],
              x: [0, 20, -15, 10, 0],
              scale: [1, 1.2, 0.8, 1.1, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-28 h-28 bg-purple-200/30 dark:bg-purple-800/30 rounded-full blur-sm"
            animate={{ 
              y: [0, 30, 0, 15, 0],
              x: [0, -25, 20, -10, 0],
              scale: [1, 0.9, 1.3, 0.95, 1],
              rotate: [360, 180, 0]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/4 w-24 h-24 bg-emerald-200/25 dark:bg-emerald-800/25 rounded-full blur-sm"
            animate={{ 
              y: [0, -20, 15, -10, 0],
              x: [0, 15, -20, 25, 0],
              scale: [1, 1.15, 0.85, 1.05, 1],
              rotate: [0, 90, 270, 180, 360]
            }}
            transition={{ 
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-20 h-20 bg-rose-200/25 dark:bg-rose-800/25 rounded-full blur-sm"
            animate={{ 
              y: [0, 25, -30, 20, 0],
              x: [0, -20, 15, -15, 0],
              scale: [1, 0.9, 1.25, 0.95, 1],
              rotate: [0, -90, -180, -270, -360]
            }}
            transition={{ 
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
          />
        </div>
      </div>
    </section>
  )
}