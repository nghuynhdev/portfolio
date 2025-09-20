"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Experience() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const experiences = [
    {
      key: 'hyperpush',
      technologies: ["React.js", "Next.js", "Node.js", "NestJS", "React Native"]
    },
    {
      key: 'okvip',
      technologies: ["React.js", "Next.js", "Node.js", "NestJS", "Telegram API"]
    },
    {
      key: 'nashtech',
      technologies: ["React.js", "Laravel", "PHP", "Moodle"]
    }
  ]

  return (
    <section id="experience" className="py-20" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          {t.experience.title}
        </motion.h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <motion.div 
              className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200 dark:bg-blue-800"
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              style={{ transformOrigin: "top" }}
            />
            
            {experiences.map((exp, index) => {
              const expData = t.experience[exp.key as keyof typeof t.experience] as any
              
              return (
                <motion.div 
                  key={index} 
                  className="relative mb-12 ml-20"
                  initial={{ opacity: 0, x: -50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                  transition={{ duration: 0.6, delay: 0.8 + (index * 0.2) }}
                >
                  {/* Timeline dot */}
                  <motion.div 
                    className="absolute -left-14 top-6 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.4, delay: 1.0 + (index * 0.2) }}
                  />
                  
                  <motion.div 
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <div>
                        <motion.h3 
                          className="text-xl font-bold text-gray-800 dark:text-white"
                          initial={{ opacity: 0 }}
                          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                          transition={{ duration: 0.6, delay: 1.2 + (index * 0.2) }}
                        >
                          {expData.position}
                        </motion.h3>
                        <motion.h4 
                          className="text-lg text-blue-600 dark:text-blue-400 mb-2"
                          initial={{ opacity: 0 }}
                          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                          transition={{ duration: 0.6, delay: 1.3 + (index * 0.2) }}
                        >
                          {expData.company}
                        </motion.h4>
                      </div>
                      <motion.span 
                        className="text-sm text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4, delay: 1.4 + (index * 0.2) }}
                      >
                        {expData.duration}
                      </motion.span>
                    </div>
                    
                    <motion.ul 
                      className="text-gray-600 dark:text-gray-300 mb-4 space-y-2"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.6, delay: 1.5 + (index * 0.2) }}
                    >
                      {expData.description.map((item: string, idx: number) => (
                        <motion.li 
                          key={idx} 
                          className="flex items-start"
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                          transition={{ duration: 0.4, delay: 1.6 + (index * 0.2) + (idx * 0.1) }}
                        >
                          <span className="text-blue-600 dark:text-blue-400 mr-2 mt-2 flex-shrink-0">•</span>
                          {item}
                        </motion.li>
                      ))}
                    </motion.ul>
                    
                    <motion.div 
                      className="flex flex-wrap gap-2"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.6, delay: 1.8 + (index * 0.2) }}
                    >
                      {exp.technologies.map((tech, idx) => (
                        <motion.span 
                          key={idx}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3, delay: 1.9 + (index * 0.2) + (idx * 0.05) }}
                          whileHover={{ scale: 1.1 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </motion.div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}