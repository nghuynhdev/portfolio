import type { Metadata, Viewport } from 'next'
import '@/app/globals.css'
import { Leckerli_One, Inter } from 'next/font/google'
import ToasterProvider from '@/components/ToasterProvider'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Script from 'next/script'

/** GA4 Measurement ID (G-XXXXXXX). GA only loads when this env var is set. */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID
import { LanguageProvider } from '@/contexts/LanguageContext'
import Navigation from '@/components/Navigation'

const leckerliOne = Leckerli_One({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-leckerli',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
})

const SITE_URL = 'https://www.huynhnguyen.info.vn'
const SITE_TITLE = 'Nguyễn Huỳnh (Huynh Nguyen) - Full Stack Developer'
const SITE_DESCRIPTION = 'Nguyễn Huỳnh (Huynh Nguyen), Full Stack Developer in Ho Chi Minh City with 4 years building web apps in React.js, Next.js and NestJS.'
const NAME_VARIANTS = ['Nguyễn Huỳnh', 'Huỳnh Nguyễn', 'Huynh Nguyen', 'Huynhnguyen', 'Huỳnh', 'Huynh']

export const siteViewport: Viewport = {
  themeColor: '#0f1117',
  colorScheme: 'dark',
}

export const siteMetadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: '%s | Huynh'
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
    siteName: 'Nguyễn Huỳnh',
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

/**
 * The <html> document shared by both root layouts. Each route group passes its
 * language so the server-rendered `lang` matches the page content:
 * (site) = home + English blog, (vi) = Vietnamese blog.
 */
export default function RootDocument({
  lang,
  children,
}: Readonly<{
  lang: 'en' | 'vi'
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Nguyen Huynh',
    alternateName: NAME_VARIANTS,
    description: 'Full Stack Developer with 4 years of experience specializing in React.js, Next.js, Node.js, and NestJS',
    url: SITE_URL,
    image: `${SITE_URL}/assets/images/avt-v2.png`,
    sameAs: [
      'https://www.facebook.com/nghuynhit',
      'https://github.com/nghuynhdev',
      'https://www.linkedin.com/in/nghuynhdev/'
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
    telephone: '+84327514700',
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

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Nguyễn Huỳnh',
    alternateName: ['Nguyen Huynh', 'Huynh Nguyen', 'Huynhnguyen'],
    url: `${SITE_URL}/`,
    author: { '@id': `${SITE_URL}/#person` },
  }

  return (
    <html lang={lang} className="dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${leckerliOne.variable} ${inter.variable} font-sans antialiased dark:bg-[#0f1117] text-gray-900 dark:text-gray-100 min-h-screen`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-3 focus:rounded-lg focus:bg-accent focus:text-gray-900 focus:font-medium"
        >
          {lang === 'vi' ? 'Bỏ qua đến nội dung chính' : 'Skip to main content'}
        </a>
        <LanguageProvider>
          <Navigation />
          {children}
        </LanguageProvider>
        <ToasterProvider />
        <Analytics />
        <SpeedInsights />
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}