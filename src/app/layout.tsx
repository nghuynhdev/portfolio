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
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}