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
        { name: "Git", level: 85 },
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
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
{t.skills.title}
        </h2>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div 
                key={categoryIndex} 
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700 relative overflow-hidden"
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
                          className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
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
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {t.skills.coreStrengths}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 15px 30px rgba(0,0,0,0.12)"
                }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="text-blue-600 dark:text-blue-400 text-3xl mb-4">🚀</div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">{t.skills.performance.title}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t.skills.performance.description}
                </p>
              </motion.div>
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 15px 30px rgba(0,0,0,0.12)"
                }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="text-green-600 dark:text-green-400 text-3xl mb-4">✨</div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">{t.skills.cleanCode.title}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t.skills.cleanCode.description}
                </p>
              </motion.div>
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 15px 30px rgba(0,0,0,0.12)"
                }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="text-purple-600 dark:text-purple-400 text-3xl mb-4">🤝</div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">{t.skills.teamwork.title}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t.skills.teamwork.description}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}