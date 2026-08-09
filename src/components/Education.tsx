"use client"

import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'

export default function Education() {
  const { t } = useLanguage()
  return (
    <section id="education" className="py-10 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-4 md:mb-8">
          {t.education.title}
        </h2>
        
        <div className="max-w-4xl mx-auto">
          {/* Education */}
          <div className="mb-8 md:mb-16">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-8 text-center">
              {t.education.educationTitle}
            </h3>
            
            <div className="bg-white dark:bg-[#161b27] rounded-xl p-5 md:p-8 shadow-sm dark:shadow-black/30 border border-black/[0.07] dark:border-white/[0.07] relative z-10">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div className="mb-4 md:mb-0">
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {t.education.degree}
                  </h4>
                  <h5 className="text-lg text-accent mb-3">
                    {t.education.university}
                  </h5>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t.education.degreeDescription}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    09/2023
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Awards */}
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-8 text-center">
              {t.education.awardsTitle}
            </h3>
            
            <div className="bg-white dark:bg-[#161b27] rounded-xl shadow-sm dark:shadow-black/30 border border-black/[0.07] dark:border-white/[0.07] overflow-hidden relative z-10">
              <div className="flex flex-col md:flex-row">
                {/* Evidence image */}
                <div className="md:w-56 flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                  <Image
                    src="/assets/images/hinh1.webp"
                    alt="Hackathon - In Devs We Trust"
                    width={400}
                    height={500}
                    className="w-full h-60 md:h-full object-cover object-center"
                  />
                </div>
                {/* Content */}
                <div className="flex-1 p-5 md:p-8">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                        {t.education.hackathon.title}
                      </h4>
                      <h5 className="text-base text-accent mb-3">
                        {t.education.hackathon.company}
                      </h5>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/[0.06] px-3 py-1 rounded-full w-fit">
                      10/2023
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                    {t.education.hackathon.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-accent/10 text-accent border border-accent/25 rounded-full text-sm">
                      Algorithm Competition
                    </span>
                    <span className="px-3 py-1 bg-accent/10 text-accent border border-accent/25 rounded-full text-sm">
                      Team Collaboration
                    </span>
                    <span className="px-3 py-1 bg-accent/10 text-accent border border-accent/25 rounded-full text-sm">
                      Problem Solving
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Certifications */}
          <div className="mt-8 md:mt-16">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-8 text-center">
              {t.education.accomplishmentsTitle}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  item: t.education.accomplishments.quickLearner,
                  iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
                },
                {
                  item: t.education.accomplishments.timeManagement,
                  iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                },
                {
                  item: t.education.accomplishments.international,
                  iconPath: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                },
                {
                  item: t.education.accomplishments.performance,
                  iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                },
              ].map(({ item, iconPath }) => (
                <div key={item.title} className="bg-white dark:bg-[#161b27] rounded-xl p-6 shadow-sm dark:shadow-black/30 border border-black/[0.07] dark:border-white/[0.07] relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-800 dark:text-white">{item.title}</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}