import RootDocument, { siteMetadata, siteViewport } from '@/components/RootDocument'

export const metadata = siteMetadata
export const viewport = siteViewport

/** Home page and the English blog (/en/ai-for-devs). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="en">{children}</RootDocument>
}
