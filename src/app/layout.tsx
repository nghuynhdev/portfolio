import type { Metadata } from 'next'
import './globals.css'
import { Leckerli_One, Inter } from 'next/font/google'
import ToasterProvider from '@/components/ToasterProvider'

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

export const metadata: Metadata = {
  title: {
    default: 'Huynh. - Full Stack Developer',
    template: '%s | Huynh. Portfolio'
  },
  description: 'Portfolio of Huynh., Full Stack Developer with 3 years of experience specializing in React.js, Next.js, Node.js, and NestJS. Building scalable web applications with modern technologies.',
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
  authors: [{ name: 'Nguyen Huynh', url: 'https://www.facebook.com/nghuynhit' }],
  creator: 'Nguyen Huynh',
  publisher: 'Nguyen Huynh',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.facebook.com/nghuynhit'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'vi-VN': '/vi-VN',
    },
  },
  openGraph: {
    title: 'Huynh. - Full Stack Developer',
    description: 'Portfolio of Huynh., Full Stack Developer with 3 years of experience specializing in React.js, Next.js, Node.js, and NestJS.',
    url: 'https://www.facebook.com/nghuynhit',
    siteName: 'Huynh. Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Huynh. - Full Stack Developer Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Huynh. - Full Stack Developer',
    description: 'Portfolio of Huynh., Full Stack Developer with 3 years of experience specializing in React.js, Next.js, Node.js, and NestJS.',
    images: ['/og-image.png'],    creator: '@nghuynhit',
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico', 
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon-16x16.png',
      },
    ],
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
    description: 'Full Stack Developer with 3 years of experience specializing in React.js, Next.js, Node.js, and NestJS',
    url: 'https://www.facebook.com/nghuynhit',
    image: 'https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/524052939_1061905626046297_1156620824287850354_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=zEm-P-FckZIQ7kNvwEt30ao&_nc_oc=Adn5IGgAuwHv65OW4x3qtSPQ-Pn36CVBpDE86GbLK_mMRVX3_4LqohvzHTkvVG9YVKc&_nc_zt=23&_nc_ht=scontent-lax3-2.xx&_nc_gid=fBXyB74EaEinXz7_cF0TTQ&oh=00_AfYYnBFgV0YTEkKFXWTmABnn_Zl8NidyIutmw-nLXeH9vw&oe=68D4AAF2',
    sameAs: [
      'https://www.facebook.com/nghuynhit',
      'https://github.com/nghuynhdev',
      'https://linkedin.com/in/nghuynhdev'
    ],
    jobTitle: 'Full Stack Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Hyperpush'
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
      <body className={`${leckerliOne.variable} ${inter.variable} font-sans antialiased bg-[#f8fafc] dark:bg-[#0f1117] text-gray-900 dark:text-gray-100 min-h-screen`}>
        <ToasterProvider />
        {children}
      </body>
    </html>
  )
}