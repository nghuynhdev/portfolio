import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nguyen Huynh - Full Stack Developer',
  description: 'Portfolio of Nguyen Huynh, Middle Fullstack Developer with 3 years of experience specializing in React.js, Next.js, Node.js, and NestJS',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-blue-50 via-purple-50 via-emerald-50 via-orange-50 via-rose-50 to-violet-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-gray-800 dark:via-zinc-900 dark:via-slate-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}