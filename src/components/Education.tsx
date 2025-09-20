"use client"

import { useLanguage } from '@/contexts/LanguageContext'

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
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 shadow-md">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div className="mb-4 md:mb-0">
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {t.education.degree}
                  </h4>
                  <h5 className="text-lg text-blue-600 dark:text-blue-400 mb-3">
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
            
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8 shadow-md border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        {t.education.hackathon.title}
                      </h4>
                      <h5 className="text-lg text-yellow-600 dark:text-yellow-400 mb-3">
                        {t.education.hackathon.company}
                      </h5>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {t.education.hackathon.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm">
                          Algorithm Competition
                        </span>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                          Team Collaboration
                        </span>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                          Problem Solving
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <span className="text-sm text-gray-500 dark:text-gray-400 bg-yellow-200 dark:bg-yellow-800 px-3 py-1 rounded-full">
                        10/2023
                      </span>
                    </div>
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
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <div className="text-blue-600 dark:text-blue-400 text-2xl mb-3">🎯</div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">
                  {t.education.accomplishments.quickLearner.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t.education.accomplishments.quickLearner.description}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <div className="text-green-600 dark:text-green-400 text-2xl mb-3">⏱️</div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">
                  {t.education.accomplishments.timeManagement.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t.education.accomplishments.timeManagement.description}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <div className="text-purple-600 dark:text-purple-400 text-2xl mb-3">🌐</div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">
                  {t.education.accomplishments.international.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t.education.accomplishments.international.description}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md">
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