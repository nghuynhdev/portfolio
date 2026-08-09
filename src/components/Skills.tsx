"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Skills() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const skillCategories = [
    {
      title: t.skills.frontend,
      skills: [
        { name: "React.js", level: 90 },
        { name: "Next.js", level: 85 },
        { name: "TypeScript", level: 85 },
        { name: "JavaScript", level: 90 },
        { name: "HTML/CSS", level: 85 },
        { name: "Tailwind CSS", level: 80 }
      ]
    },
    {
      title: t.skills.backend,
      skills: [
        { name: "Node.js", level: 85 },
        { name: "NestJS", level: 80 },
        { name: "Laravel", level: 75 },
        { name: "PHP", level: 75 },
        { name: "RESTful APIs", level: 85 },
        { name: "GraphQL", level: 70 }
      ]
    },
    {
      title: t.skills.database,
      skills: [
        { name: "PostgreSQL", level: 80 },
        { name: "MySQL", level: 80 },
        { name: "MongoDB", level: 75 },
        { name: "Redis", level: 75 },
        { name: "Docker", level: 70 },
        { name: "AWS", level: 65 }
      ]
    },
    {
      title: t.skills.mobile,
      skills: [
        { name: "React Native", level: 75 },
        { name: "Telegram Bots", level: 80 },
        { name: "Browser Extensions", level: 75 },
        { name: "Performance Optimization", level: 80 },
        { name: "Testing", level: 70 },
        { name: "Agile/Scrum", level: 75 }
      ]
    }
  ]

  return (
    <section id="skills" className="py-10 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
          {t.skills.title}
        </h2>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div 
                key={categoryIndex} 
                className="bg-white dark:bg-[#161b27] rounded-xl p-6 shadow-sm dark:shadow-black/30 border border-black/[0.07] dark:border-white/[0.07] relative z-10 overflow-hidden"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                  {category.title}
                </h3>
                
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {skill.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-accent h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Additional strengths */}
          <div className="mt-8 md:mt-12 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {t.skills.coreStrengths}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  label: t.skills.performance,
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
                },
                {
                  label: t.skills.cleanCode,
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
                },
                {
                  label: t.skills.teamwork,
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
                },
              ].map((item) => (
                <motion.div
                  key={item.label.title}
                  className="bg-white dark:bg-[#161b27] rounded-xl p-6 shadow-sm dark:shadow-black/30 border border-black/[0.07] dark:border-white/[0.07] relative z-10"
                  whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.12)" }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {item.icon}
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-800 dark:text-white">{item.label.title}</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed text-left">
                    {item.label.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}