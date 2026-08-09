"use client"

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import toast from 'react-hot-toast'

export default function Contact() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ name: '', email: '', message: '' })
        toast.success(t.contact.form.successMessage, {
          duration: 4000,
          position: 'top-center',
        })
      } else {
        toast.error(t.contact.form.errorMessage, {
          duration: 4000,
          position: 'top-center',
        })
      }
    } catch (error) {
      toast.error(t.contact.form.errorMessage, {
        duration: 4000,
        position: 'top-center',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="contact" className="py-10 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-white mb-8 sm:mb-16">
          {t.contact.title}
        </h2>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
            {/* Contact Information */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">
                {t.contact.subtitle}
              </h3>
              
              <div>
                <a href="mailto:nghuynh.dev@gmail.com?subject=Portfolio Contact&body=Hi Nguyen," className="flex items-center space-x-3 sm:space-x-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 py-3.5 rounded-lg transition-colors cursor-pointer">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">Email</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base truncate">nghuynh.dev@gmail.com</p>
                  </div>
                </a>
                
                <a href="tel:+84327151506" className="flex items-center space-x-3 sm:space-x-4 hover:bg-green-50 dark:hover:bg-green-900/20 py-3.5 rounded-lg transition-colors cursor-pointer">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">Phone</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">+84 327151506</p>
                  </div>
                </a>
                
                <a href="https://maps.google.com/?q=Ho+Chi+Minh+City,Vietnam" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 sm:space-x-4 hover:bg-red-50 dark:hover:bg-red-900/20 py-3.5 rounded-lg transition-colors cursor-pointer">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">Location</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Ho Chi Minh, Vietnam</p>
                  </div>
                </a>
                
                <a href="https://www.facebook.com/nghuynhit" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 sm:space-x-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 py-3.5 rounded-lg transition-colors">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">Facebook</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">@nghuynhit</p>
                  </div>
                </a>
                
                <a href="https://zalo.me/84327514700" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 sm:space-x-4 hover:bg-sky-50 dark:hover:bg-sky-900/20 py-3.5 rounded-lg transition-colors">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 14.5h-9v-1.5h9v1.5zm0-3h-9V12h9v1.5zm0-3h-9V9h9v1.5z"/>
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">Zalo</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">+84 327 514 700</p>
                  </div>
                </a>
              </div>
              
              {/* Availability */}
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h4 className="font-bold text-gray-800 dark:text-white mb-2 text-sm sm:text-base">
                  {t.contact.availability.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                  {t.contact.availability.description}
                </p>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white dark:bg-[#161b27] rounded-xl shadow-sm dark:shadow-black/30 border border-black/[0.07] dark:border-white/[0.07] p-4 sm:p-6 lg:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">
                {t.contact.form.title}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    {t.contact.form.name}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-black/10 dark:border-white/[0.1] rounded-lg focus:outline-none focus:border-indigo-400/70 dark:focus:border-indigo-500/60 bg-white dark:bg-[#1e2535] dark:text-[#e2e8f0] placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    placeholder={t.contact.form.namePlaceholder}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    {t.contact.form.email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-black/10 dark:border-white/[0.1] rounded-lg focus:outline-none focus:border-indigo-400/70 dark:focus:border-indigo-500/60 bg-white dark:bg-[#1e2535] dark:text-[#e2e8f0] placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    placeholder={t.contact.form.emailPlaceholder}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    {t.contact.form.message}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    rows={5}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-black/10 dark:border-white/[0.1] rounded-lg focus:outline-none focus:border-indigo-400/70 dark:focus:border-indigo-500/60 bg-white dark:bg-[#1e2535] dark:text-[#e2e8f0] placeholder-slate-400 dark:placeholder-slate-500 resize-none text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    placeholder={t.contact.form.messagePlaceholder}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-full shadow-sm shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>{t.contact.form.submit}</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-12 sm:mt-16 lg:mt-20 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base" dangerouslySetInnerHTML={{__html: t.contact.footer}} />
        </div>
      </div>
    </section>
  )
}