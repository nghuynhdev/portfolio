"use client"

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Overview() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const cards = [
    {
      delay: 0.4,
      iconBg: "bg-blue-100 dark:bg-blue-900",
      icon: (
        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: t.overview?.aboutTitle || "About Me",
      description: t.overview?.aboutDescription || "I am a passionate developer with expertise in modern web technologies.",
    },
    {
      delay: 0.6,
      iconBg: "bg-emerald-100 dark:bg-emerald-900",
      icon: (
        <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: t.overview?.missionTitle || "My Mission",
      description: t.overview?.missionDescription || "To leverage technology to solve real-world problems.",
    },
    {
      delay: 0.8,
      iconBg: "bg-purple-100 dark:bg-purple-900",
      icon: (
        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: t.overview?.approachTitle || "My Approach",
      description: t.overview?.approachDescription || "I believe in continuous learning, attention to detail, and collaborative problem-solving.",
    },
  ]

  const stats = [
    { value: "4+", label: "Years Experience", color: "text-accent" },
    { value: "20+", label: "Projects Completed", color: "text-emerald-600 dark:text-emerald-400" },
    { value: "10+", label: "Technologies", color: "text-purple-600 dark:text-purple-400" },
  ]

  return (
    <section id="overview" className="py-10 md:py-20" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-8 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
            {t.overview?.title || "Overview"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t.overview?.subtitle || "Discover my journey, skills, and passion for creating innovative solutions"}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid lg:grid-cols-2 gap-5 lg:gap-12 items-stretch"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Left Column - About & Mission */}
            <div className="flex flex-col space-y-5 md:space-y-8">
              {cards.slice(0, 2).map((card) => (
                <motion.div
                  key={card.title}
                  className="bg-white dark:bg-[#161b27] rounded-2xl p-5 md:p-8 shadow-sm dark:shadow-black/30 border border-black/[0.07] dark:border-white/[0.07] flex-1 relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: card.delay }}
                >
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 ${card.iconBg} rounded-full flex items-center justify-center mr-4`}>
                      {card.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{card.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{card.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Right Column - Approach & Stats */}
            <div className="flex flex-col space-y-5 md:space-y-8">
              <motion.div
                className="bg-white dark:bg-[#161b27] rounded-2xl p-8 shadow-sm dark:shadow-black/30 border border-black/[0.07] dark:border-white/[0.07] flex-1 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: cards[2].delay }}
              >
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${cards[2].iconBg} rounded-full flex items-center justify-center mr-4`}>
                    {cards[2].icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{cards[2].title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{cards[2].description}</p>
              </motion.div>

              <motion.div
                className="bg-white dark:bg-[#161b27] rounded-2xl p-8 shadow-sm dark:shadow-black/30 border border-black/[0.07] dark:border-white/[0.07] flex-1 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">Key Numbers</h4>
                <div className="grid grid-cols-3 gap-2 md:gap-6">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-1 md:mb-2`}>{stat.value}</div>
                      <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-tight">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
