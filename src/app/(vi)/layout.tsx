import type { Metadata } from 'next'
import RootDocument, { siteMetadata, siteViewport } from '@/components/RootDocument'

export const metadata: Metadata = {
  ...siteMetadata,
  openGraph: { ...siteMetadata.openGraph, locale: 'vi_VN' },
}
export const viewport = siteViewport

/** Vietnamese blog (/ai-for-devs): server-rendered with <html lang="vi">. */
export default function VietnameseLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="vi">{children}</RootDocument>
}
