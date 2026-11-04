import type { Metadata } from 'next'
import './globals.css'
import { Leckerli_One, Inter } from 'next/font/google'
import ToasterProvider from '@/components/ToasterProvider'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const leckerliOne = Leckerli_One({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-leckerli',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const SITE_URL = 'https://www.huynhnguyen.info.vn'
const SITE_TITLE = 'Nguyen Huynh - Full Stack Developer | React, Next.js, NestJS'
const SITE_DESCRIPTION = 'Nguyen Huynh is a Full Stack Developer in Ho Chi Minh City with 4 years of experience building scalable web apps with React.js, Next.js, Node.js, and NestJS.'

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: '%s | Huynh. Portfolio'
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'Nguyen Huynh',
    'Huynh.',
    'Full Stack Developer',
    'React.js Developer',
    'Next.js Developer', 
    'Node.js Developer',
    'NestJS Developer',
    'JavaScript Developer',
    'TypeScript Developer',
    'Web Developer',
    'Frontend Developer',
    'Backend Developer',
    'React Native Developer',
    'Vietnam Developer',
    'Ho Chi Minh City Developer',
    'Portfolio',
    'Web Development',
    'Software Engineer'
  ],
  authors: [{ name: 'Nguyen Huynh', url: SITE_URL }],
  creator: 'Nguyen Huynh',
  publisher: 'Nguyen Huynh',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: '/',
    siteName: 'Huynh. Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: '@nghuynhit',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Nguyen Huynh',
    alternateName: 'Huynh',
    description: 'Full Stack Developer with 4 years of experience specializing in React.js, Next.js, Node.js, and NestJS',
    url: SITE_URL,
    image: `${SITE_URL}/assets/images/avt-v2.png`,
    sameAs: [
      'https://www.facebook.com/nghuynhit',
      'https://github.com/nghuynhdev',
      'https://linkedin.com/in/nghuynhdev'
    ],
    jobTitle: 'Full Stack Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Accenture'
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ho Chi Minh City',
      addressCountry: 'Vietnam'
    },
    email: 'nghuynh.dev@gmail.com',
    telephone: '+84327151506',
    knowsAbout: [
      'React.js',
      'Next.js', 
      'Node.js',
      'NestJS',
      'JavaScript',
      'TypeScript',
      'React Native',
      'Web Development',
      'Full Stack Development'
    ]
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${leckerliOne.variable} ${inter.variable} font-sans antialiased dark:bg-[#0f1117] text-gray-900 dark:text-gray-100 min-h-screen`}>
        <ToasterProvider />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}