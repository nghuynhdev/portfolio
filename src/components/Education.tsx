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
            
            <div className="bg-white dark:bg-[#161b27] rounded-xl p-8 shadow-sm dark:shadow-black/30 border border-black/[0.07] dark:border-white/[0.07]">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div className="mb-4 md:mb-0">
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {t.education.degree}
                  </h4>
                  <h5 className="text-lg text-emerald-600 dark:text-[#46f2a7] mb-3">
                    {t.education.university}
                  </h5>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t.education.degreeDescription}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">
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
            
            <div className="bg-white dark:bg-[#161b27] rounded-xl shadow-sm dark:shadow-black/30 border border-black/[0.07] dark:border-white/[0.07] overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Evidence image */}
                <div className="md:w-56 flex-shrink-0">
                  <Image
                    src="/assets/images/hinh1.webp"
                    alt="Hackathon - In Devs We Trust"
                    width={400}
                    height={500}
                    className="w-full h-52 md:h-full object-cover"
                  />
                </div>
                {/* Content */}
                <div className="flex-1 p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                        {t.education.hackathon.title}
                      </h4>
                      <h5 className="text-base text-emerald-600 dark:text-[#46f2a7] mb-3">
                        {t.education.hackathon.company}
                      </h5>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-black/[0.05] dark:bg-white/[0.06] px-3 py-1 rounded-full w-fit">
                      10/2023
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {t.education.hackathon.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-[#46f2a7]/10 dark:bg-[#46f2a7]/[0.08] text-emerald-700 dark:text-[#46f2a7] border border-[#46f2a7]/25 dark:border-[#46f2a7]/20 rounded-full text-sm">
                      Algorithm Competition
                    </span>
                    <span className="px-3 py-1 bg-[#46f2a7]/10 dark:bg-[#46f2a7]/[0.08] text-emerald-700 dark:text-[#46f2a7] border border-[#46f2a7]/25 dark:border-[#46f2a7]/20 rounded-full text-sm">
                      Team Collaboration
                    </span>
                    <span className="px-3 py-1 bg-[#46f2a7]/10 dark:bg-[#46f2a7]/[0.08] text-emerald-700 dark:text-[#46f2a7] border border-[#46f2a7]/25 dark:border-[#46f2a7]/20 rounded-full text-sm">
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
              <div className="bg-white dark:bg-[#161b27] rounded-xl p-6 shadow-sm dark:shadow-black/30 border border-black/[0.07] dark:border-white/[0.07]">
                <div className="text-blue-600 dark:text-blue-400 text-2xl mb-3">🎯</div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">
                  {t.education.accomplishments.quickLearner.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t.education.accomplishments.quickLearner.description}
                </p>
              </div>
              
              <div className="bg-white dark:bg-[#161b27] rounded-xl p-6 shadow-sm dark:shadow-black/30 border border-black/[0.07] dark:border-white/[0.07]">
                <div className="text-green-600 dark:text-green-400 text-2xl mb-3">⏱️</div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">
                  {t.education.accomplishments.timeManagement.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t.education.accomplishments.timeManagement.description}
                </p>
              </div>
              
              <div className="bg-white dark:bg-[#161b27] rounded-xl p-6 shadow-sm dark:shadow-black/30 border border-black/[0.07] dark:border-white/[0.07]">
                <div className="text-purple-600 dark:text-purple-400 text-2xl mb-3">🌐</div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">
                  {t.education.accomplishments.international.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t.education.accomplishments.international.description}
                </p>
              </div>
              
              <div className="bg-white dark:bg-[#161b27] rounded-xl p-6 shadow-sm dark:shadow-black/30 border border-black/[0.07] dark:border-white/[0.07]">
                <div className="text-red-600 dark:text-red-400 text-2xl mb-3">🚀</div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">
                  {t.education.accomplishments.performance.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t.education.accomplishments.performance.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}